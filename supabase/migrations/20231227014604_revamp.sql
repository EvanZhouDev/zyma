alter table "public"."codes" drop constraint "codes_pkey";

drop index if exists "public"."codes_pkey";

alter table "public"."codes" drop column "type";

alter table "public"."groups" add column "code" uuid;

CREATE UNIQUE INDEX groups_code_key ON public.groups USING btree (code);

alter table "public"."groups" add constraint "groups_code_key" UNIQUE using index "groups_code_key";


