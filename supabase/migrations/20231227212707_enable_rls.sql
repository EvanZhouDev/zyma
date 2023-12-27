alter table "public"."attendance" drop constraint "attendance_pkey";

drop index if exists "public"."attendance_pkey";

alter table "public"."attendance" enable row level security;

alter table "public"."attendees" enable row level security;

alter table "public"."codes" enable row level security;

alter table "public"."groups" enable row level security;

CREATE UNIQUE INDEX attendance_pkey ON public.attendance USING btree (code_used, attendee);

alter table "public"."attendance" add constraint "attendance_pkey" PRIMARY KEY using index "attendance_pkey";


