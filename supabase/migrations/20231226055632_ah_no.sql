alter table "public"."attendees" drop constraint "attendees_code_used_fkey";

alter table "public"."codes" drop constraint "codes_pkey";

drop index if exists "public"."codes_pkey";

alter table "public"."attendees" drop column "code_used";

alter table "public"."attendees" add column "group" bigint not null;

CREATE UNIQUE INDEX attendees_pkey ON public.attendees USING btree (attendee, "group");

CREATE UNIQUE INDEX codes_pkey ON public.codes USING btree ("group", type);

alter table "public"."attendees" add constraint "attendees_pkey" PRIMARY KEY using index "attendees_pkey";

alter table "public"."codes" add constraint "codes_pkey" PRIMARY KEY using index "codes_pkey";

alter table "public"."attendees" add constraint "attendees_group_fkey" FOREIGN KEY ("group") REFERENCES groups(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."attendees" validate constraint "attendees_group_fkey";


