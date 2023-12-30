alter table "public"."attendees" drop constraint "attendees_group_fkey";

alter table "public"."attendees" drop constraint "attendees_pkey";

drop index if exists "public"."attendees_pkey";

alter table "public"."attendees" drop column "group";

alter table "public"."attendees" add column "code_used" uuid not null;

alter table "public"."codes" add column "type" smallint not null default '0'::smallint;

alter table "public"."attendees" add constraint "attendees_code_used_fkey" FOREIGN KEY (code_used) REFERENCES codes(code) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."attendees" validate constraint "attendees_code_used_fkey";


