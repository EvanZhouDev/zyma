
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE OR REPLACE FUNCTION "public"."bool2str"("input_bool" boolean) RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$BEGIN
  IF input_bool THEN
    RETURN 'true';
  ELSE
    RETURN 'false';
  END IF;
END;$$;

ALTER FUNCTION "public"."bool2str"("input_bool" boolean) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."delete_expired_codes"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
begin
    DELETE FROM public.codes WHERE metadata->>'expires_at' IS NOT null and 
        TO_TIMESTAMP(metadata->>'expires_at') < NOW();
end;
$$;

ALTER FUNCTION "public"."delete_expired_codes"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."end_session"("attendance_code" "uuid") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$BEGIN
  -- Update metadata for all attendees in the group with the given code
  UPDATE attendees
  SET metadata = jsonb_set(attendees_with_group.metadata,
    CAST(concat('{attendanceHistory,', to_char(codes.created_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z"'), '}') as text[]),
    CAST(concat('["', to_char(attendance.created_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),'", ', CAST (status as char), ']') as jsonb)
  )
  FROM attendees_with_group
  INNER JOIN codes ON codes.group = attendees_with_group.group
  INNER JOIN attendance ON attendance.code_used = attendance_code
  WHERE attendees.with_code in (SELECT groups.code FROM groups INNER JOIN codes ON codes.group = groups.id WHERE codes.code = attendance_code);
  DELETE FROM codes WHERE code = attendance_code;
END;$$;

ALTER FUNCTION "public"."end_session"("attendance_code" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  insert into public.profiles (id, username, email, account_type)
  values (new.id, new.raw_user_meta_data ->> 'name', new.email, CAST (new.raw_user_meta_data ->> 'role' as smallint));
  return new;
end;
$$;

ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."is_joinable"("join_code" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$BEGIN
  RETURN (EXISTS (SELECT 1 FROM groups WHERE groups.joinable AND groups.code = join_code));
END;$$;

ALTER FUNCTION "public"."is_joinable"("join_code" "uuid") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."attendance" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "status" smallint DEFAULT '6'::smallint NOT NULL,
    "metadata" "jsonb" DEFAULT 'null'::"jsonb",
    "code_used" "uuid" NOT NULL,
    "attendee" "uuid" NOT NULL
);

ALTER TABLE "public"."attendance" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."attendees" (
    "attendee" "uuid" NOT NULL,
    "metadata" "jsonb" DEFAULT '{"customProperties": {}, "attendanceHistory": {}}'::"jsonb" NOT NULL,
    "with_code" "uuid" NOT NULL
);

ALTER TABLE "public"."attendees" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."groups" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "admin" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "config" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "code" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "joinable" boolean DEFAULT false NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL
);

ALTER TABLE "public"."groups" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."attendees_with_group" AS
 SELECT "attendees"."attendee",
    "attendees"."metadata",
    "attendees"."with_code",
    ( SELECT "groups"."id"
           FROM "public"."groups"
          WHERE ("groups"."code" = "attendees"."with_code")) AS "group"
   FROM "public"."attendees";

ALTER TABLE "public"."attendees_with_group" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."codes" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "code" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "metadata" "jsonb" DEFAULT '{"expires_at": null}'::"jsonb" NOT NULL,
    "group" bigint NOT NULL
);

ALTER TABLE "public"."codes" OWNER TO "postgres";

ALTER TABLE "public"."groups" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."groups_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "username" character varying NOT NULL,
    "email" "text" NOT NULL,
    "account_type" smallint NOT NULL
);

ALTER TABLE "public"."profiles" OWNER TO "postgres";

ALTER TABLE ONLY "public"."attendance"
    ADD CONSTRAINT "attendance_pkey" PRIMARY KEY ("code_used", "attendee");

ALTER TABLE ONLY "public"."attendees"
    ADD CONSTRAINT "attendees_pkey" PRIMARY KEY ("attendee", "with_code");

ALTER TABLE ONLY "public"."codes"
    ADD CONSTRAINT "codes_code_key" UNIQUE ("code");

ALTER TABLE ONLY "public"."codes"
    ADD CONSTRAINT "codes_pkey" PRIMARY KEY ("group");

ALTER TABLE ONLY "public"."groups"
    ADD CONSTRAINT "groups_code_key" UNIQUE ("code");

ALTER TABLE ONLY "public"."groups"
    ADD CONSTRAINT "groups_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."attendance"
    ADD CONSTRAINT "attendance_attendee_fkey" FOREIGN KEY ("attendee") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."attendance"
    ADD CONSTRAINT "attendance_code_used_fkey" FOREIGN KEY ("code_used") REFERENCES "public"."codes"("code") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."attendees"
    ADD CONSTRAINT "attendees_attendee_fkey" FOREIGN KEY ("attendee") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."attendees"
    ADD CONSTRAINT "attendees_with_code_fkey" FOREIGN KEY ("with_code") REFERENCES "public"."groups"("code") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."codes"
    ADD CONSTRAINT "codes_group_fkey" FOREIGN KEY ("group") REFERENCES "public"."groups"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."groups"
    ADD CONSTRAINT "groups_admin_fkey" FOREIGN KEY ("admin") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

CREATE POLICY "Admins can remove attendees or you can remove yourself" ON "public"."attendees" FOR DELETE USING (((EXISTS ( SELECT 1
   FROM "public"."groups"
  WHERE (("groups"."code" = "attendees"."with_code") AND ("groups"."admin" = "auth"."uid"())))) OR ("attendee" = "auth"."uid"())));

CREATE POLICY "Admins can update attendees or attendees can update themselves" ON "public"."attendees" FOR UPDATE USING ((("auth"."uid"() = ( SELECT "groups"."admin"
   FROM "public"."groups"
  WHERE ("groups"."code" = "attendees"."with_code"))) OR ("auth"."uid"() = "attendee"))) WITH CHECK (true);

CREATE POLICY "Anyone can select" ON "public"."codes" FOR SELECT USING (true);

CREATE POLICY "Attendees can attend" ON "public"."attendance" FOR INSERT WITH CHECK ((("auth"."uid"() = "attendee") AND (( SELECT "profiles"."account_type"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = 1)));

CREATE POLICY "Enable delete for users based on groups.admin" ON "public"."codes" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."groups"
  WHERE (("groups"."id" = "codes"."group") AND ("groups"."admin" = "auth"."uid"())))));

CREATE POLICY "Enable insert for users based on user_id" ON "public"."profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));

CREATE POLICY "Enable read access for all users" ON "public"."attendees" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."profiles" FOR SELECT USING (true);

CREATE POLICY "Enable update for users based on user_id" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id"));

CREATE POLICY "INSERT for admins only" ON "public"."groups" FOR INSERT WITH CHECK ((("auth"."uid"() = "admin") AND (( SELECT "profiles"."account_type"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = 0)));

CREATE POLICY "Limit SELECT to admins and attendees" ON "public"."groups" FOR SELECT USING ((("admin" = "auth"."uid"()) OR (EXISTS ( SELECT 1
   FROM "public"."attendees"
  WHERE (("attendees"."attendee" = "auth"."uid"()) AND ("attendees"."with_code" = "groups"."code"))))));

CREATE POLICY "Limit attendee insertion to joinable groups OR admins" ON "public"."attendees" FOR INSERT TO "authenticated" WITH CHECK ((("public"."is_joinable"("with_code") AND ("attendee" = "auth"."uid"()) AND (( SELECT "profiles"."account_type"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "attendees"."attendee")) = 1)) OR (EXISTS ( SELECT 1
   FROM "public"."groups"
  WHERE (("groups"."code" = "attendees"."with_code") AND ("groups"."admin" = "auth"."uid"()))))));

CREATE POLICY "Only admins can delete" ON "public"."groups" FOR DELETE USING (("auth"."uid"() = "admin"));

CREATE POLICY "Only admins can see who in attendance" ON "public"."attendance" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."groups",
    "public"."codes"
  WHERE (("groups"."id" = "codes"."group") AND ("codes"."code" = "attendance"."code_used") AND ("auth"."uid"() = "groups"."admin")))));

CREATE POLICY "Only admins can update groups" ON "public"."groups" FOR UPDATE USING (("auth"."uid"() = "admin")) WITH CHECK (true);

CREATE POLICY "Only admins of the group can insert codes for that group" ON "public"."codes" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."groups"
  WHERE (("groups"."admin" = "auth"."uid"()) AND ("groups"."id" = "codes"."group")))));

CREATE POLICY "You can see your own attendance information" ON "public"."attendance" FOR SELECT USING (("auth"."uid"() = "attendee"));

CREATE POLICY "You can update your own attendance status" ON "public"."attendance" FOR UPDATE USING (("auth"."uid"() = "attendee")) WITH CHECK (("auth"."uid"() = "attendee"));

ALTER TABLE "public"."attendance" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."attendees" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."codes" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."groups" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."bool2str"("input_bool" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."bool2str"("input_bool" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."bool2str"("input_bool" boolean) TO "service_role";

GRANT ALL ON FUNCTION "public"."delete_expired_codes"() TO "anon";
GRANT ALL ON FUNCTION "public"."delete_expired_codes"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."delete_expired_codes"() TO "service_role";

GRANT ALL ON FUNCTION "public"."end_session"("attendance_code" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."end_session"("attendance_code" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."end_session"("attendance_code" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";

GRANT ALL ON FUNCTION "public"."is_joinable"("join_code" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_joinable"("join_code" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_joinable"("join_code" "uuid") TO "service_role";

GRANT ALL ON TABLE "public"."attendance" TO "anon";
GRANT ALL ON TABLE "public"."attendance" TO "authenticated";
GRANT ALL ON TABLE "public"."attendance" TO "service_role";

GRANT ALL ON TABLE "public"."attendees" TO "anon";
GRANT ALL ON TABLE "public"."attendees" TO "authenticated";
GRANT ALL ON TABLE "public"."attendees" TO "service_role";

GRANT ALL ON TABLE "public"."groups" TO "anon";
GRANT ALL ON TABLE "public"."groups" TO "authenticated";
GRANT ALL ON TABLE "public"."groups" TO "service_role";

GRANT ALL ON TABLE "public"."attendees_with_group" TO "anon";
GRANT ALL ON TABLE "public"."attendees_with_group" TO "authenticated";
GRANT ALL ON TABLE "public"."attendees_with_group" TO "service_role";

GRANT ALL ON TABLE "public"."codes" TO "anon";
GRANT ALL ON TABLE "public"."codes" TO "authenticated";
GRANT ALL ON TABLE "public"."codes" TO "service_role";

GRANT ALL ON SEQUENCE "public"."groups_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."groups_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."groups_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
