drop policy "Enable delete for users based on user_id" on "public"."classes";

drop policy "Enable insert for users based on user_id" on "public"."classes";

drop policy "Enable read access for all users" on "public"."classes";

drop policy "Enable read access for all users" on "public"."students";

drop policy "Enable insert for users based on user_id" on "public"."attendance";

revoke delete on table "public"."classes" from "anon";

revoke insert on table "public"."classes" from "anon";

revoke references on table "public"."classes" from "anon";

revoke select on table "public"."classes" from "anon";

revoke trigger on table "public"."classes" from "anon";

revoke truncate on table "public"."classes" from "anon";

revoke update on table "public"."classes" from "anon";

revoke delete on table "public"."classes" from "authenticated";

revoke insert on table "public"."classes" from "authenticated";

revoke references on table "public"."classes" from "authenticated";

revoke select on table "public"."classes" from "authenticated";

revoke trigger on table "public"."classes" from "authenticated";

revoke truncate on table "public"."classes" from "authenticated";

revoke update on table "public"."classes" from "authenticated";

revoke delete on table "public"."classes" from "service_role";

revoke insert on table "public"."classes" from "service_role";

revoke references on table "public"."classes" from "service_role";

revoke select on table "public"."classes" from "service_role";

revoke trigger on table "public"."classes" from "service_role";

revoke truncate on table "public"."classes" from "service_role";

revoke update on table "public"."classes" from "service_role";

revoke delete on table "public"."students" from "anon";

revoke insert on table "public"."students" from "anon";

revoke references on table "public"."students" from "anon";

revoke select on table "public"."students" from "anon";

revoke trigger on table "public"."students" from "anon";

revoke truncate on table "public"."students" from "anon";

revoke update on table "public"."students" from "anon";

revoke delete on table "public"."students" from "authenticated";

revoke insert on table "public"."students" from "authenticated";

revoke references on table "public"."students" from "authenticated";

revoke select on table "public"."students" from "authenticated";

revoke trigger on table "public"."students" from "authenticated";

revoke truncate on table "public"."students" from "authenticated";

revoke update on table "public"."students" from "authenticated";

revoke delete on table "public"."students" from "service_role";

revoke insert on table "public"."students" from "service_role";

revoke references on table "public"."students" from "service_role";

revoke select on table "public"."students" from "service_role";

revoke trigger on table "public"."students" from "service_role";

revoke truncate on table "public"."students" from "service_role";

revoke update on table "public"."students" from "service_role";

alter table "public"."attendance" drop constraint "attendance_student_fkey";

alter table "public"."classes" drop constraint "classes_admin_fkey";

alter table "public"."codes" drop constraint "codes_class_fkey";

alter table "public"."students" drop constraint "students_class_fkey";

alter table "public"."students" drop constraint "students_student_fkey";

alter table "public"."classes" drop constraint "classes_pkey";

alter table "public"."students" drop constraint "students_pkey";

alter table "public"."attendance" drop constraint "attendance_pkey";

drop index if exists "public"."classes_pkey";

drop index if exists "public"."students_pkey";

drop index if exists "public"."attendance_pkey";

drop table "public"."classes";

drop table "public"."students";

create table "public"."attendees" (
    "attendee" uuid not null,
    "group" bigint not null,
    "metadata" jsonb default 'null'::jsonb
);


create table "public"."groups" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "admin" uuid not null,
    "name" text not null,
    "config" jsonb default 'null'::jsonb
);


alter table "public"."attendance" drop column "student";

alter table "public"."attendance" add column "attendee" uuid not null;

alter table "public"."codes" drop column "class";

alter table "public"."codes" add column "group" bigint not null;

CREATE UNIQUE INDEX attendees_pkey ON public.attendees USING btree (attendee, "group");

CREATE UNIQUE INDEX groups_pkey ON public.groups USING btree (id);

CREATE UNIQUE INDEX attendance_pkey ON public.attendance USING btree (attendee, code_used);

alter table "public"."attendees" add constraint "attendees_pkey" PRIMARY KEY using index "attendees_pkey";

alter table "public"."groups" add constraint "groups_pkey" PRIMARY KEY using index "groups_pkey";

alter table "public"."attendance" add constraint "attendance_pkey" PRIMARY KEY using index "attendance_pkey";

alter table "public"."attendance" add constraint "attendance_attendee_fkey" FOREIGN KEY (attendee) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."attendance" validate constraint "attendance_attendee_fkey";

alter table "public"."attendees" add constraint "attendees_attendee_fkey" FOREIGN KEY (attendee) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."attendees" validate constraint "attendees_attendee_fkey";

alter table "public"."attendees" add constraint "attendees_group_fkey" FOREIGN KEY ("group") REFERENCES groups(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."attendees" validate constraint "attendees_group_fkey";

alter table "public"."codes" add constraint "codes_group_fkey" FOREIGN KEY ("group") REFERENCES groups(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."codes" validate constraint "codes_group_fkey";

alter table "public"."groups" add constraint "groups_admin_fkey" FOREIGN KEY (admin) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."groups" validate constraint "groups_admin_fkey";

grant delete on table "public"."attendees" to "anon";

grant insert on table "public"."attendees" to "anon";

grant references on table "public"."attendees" to "anon";

grant select on table "public"."attendees" to "anon";

grant trigger on table "public"."attendees" to "anon";

grant truncate on table "public"."attendees" to "anon";

grant update on table "public"."attendees" to "anon";

grant delete on table "public"."attendees" to "authenticated";

grant insert on table "public"."attendees" to "authenticated";

grant references on table "public"."attendees" to "authenticated";

grant select on table "public"."attendees" to "authenticated";

grant trigger on table "public"."attendees" to "authenticated";

grant truncate on table "public"."attendees" to "authenticated";

grant update on table "public"."attendees" to "authenticated";

grant delete on table "public"."attendees" to "service_role";

grant insert on table "public"."attendees" to "service_role";

grant references on table "public"."attendees" to "service_role";

grant select on table "public"."attendees" to "service_role";

grant trigger on table "public"."attendees" to "service_role";

grant truncate on table "public"."attendees" to "service_role";

grant update on table "public"."attendees" to "service_role";

grant delete on table "public"."groups" to "anon";

grant insert on table "public"."groups" to "anon";

grant references on table "public"."groups" to "anon";

grant select on table "public"."groups" to "anon";

grant trigger on table "public"."groups" to "anon";

grant truncate on table "public"."groups" to "anon";

grant update on table "public"."groups" to "anon";

grant delete on table "public"."groups" to "authenticated";

grant insert on table "public"."groups" to "authenticated";

grant references on table "public"."groups" to "authenticated";

grant select on table "public"."groups" to "authenticated";

grant trigger on table "public"."groups" to "authenticated";

grant truncate on table "public"."groups" to "authenticated";

grant update on table "public"."groups" to "authenticated";

grant delete on table "public"."groups" to "service_role";

grant insert on table "public"."groups" to "service_role";

grant references on table "public"."groups" to "service_role";

grant select on table "public"."groups" to "service_role";

grant trigger on table "public"."groups" to "service_role";

grant truncate on table "public"."groups" to "service_role";

grant update on table "public"."groups" to "service_role";

create policy "Enable read access for all users"
on "public"."attendees"
as permissive
for select
to public
using (true);


create policy "Enable delete for users based on user_id"
on "public"."groups"
as permissive
for delete
to public
using ((auth.uid() = admin));


create policy "Enable insert for users based on user_id"
on "public"."groups"
as permissive
for insert
to public
with check ((auth.uid() = admin));


create policy "Enable read access for all users"
on "public"."groups"
as permissive
for select
to public
using (true);


create policy "Enable insert for users based on user_id"
on "public"."attendance"
as permissive
for insert
to public
with check ((auth.uid() = attendee));