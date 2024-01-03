alter table "public"."attendees" alter column "metadata" set default '{"customProperties": {}, "attendanceHistory": {}}'::jsonb;

alter table "public"."attendees" alter column "metadata" set not null;

alter table "public"."groups" add column "metadata" jsonb not null default '{}'::jsonb;

alter table "public"."groups" alter column "config" set default '{}'::jsonb;

alter table "public"."groups" alter column "config" set not null;
