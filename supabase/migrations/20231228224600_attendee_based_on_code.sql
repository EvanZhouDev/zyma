alter table "public"."attendees" drop constraint "attendees_group_fkey";

alter table "public"."attendees" drop constraint "attendees_pkey";

drop index if exists "public"."attendees_pkey";

alter table "public"."attendees" drop column "group";

alter table "public"."attendees" add column "with_code" uuid not null;

alter table "public"."groups" add column "joinable" boolean not null default false;

alter table "public"."groups" alter column "code" set default gen_random_uuid();

alter table "public"."groups" alter column "code" set not null;

CREATE UNIQUE INDEX attendees_pkey ON public.attendees USING btree (attendee, with_code);

alter table "public"."attendees" add constraint "attendees_pkey" PRIMARY KEY using index "attendees_pkey";

alter table "public"."attendees" add constraint "attendees_with_code_fkey" FOREIGN KEY (with_code) REFERENCES groups(code) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."attendees" validate constraint "attendees_with_code_fkey";

create policy "Limit attendee insertion to joinable groups OR admins"
on "public"."attendees"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM groups
  WHERE ((groups.code = attendees.with_code) AND (groups.joinable OR groups.admin = auth.uid())))));
