alter table "public"."codes" drop constraint "codes_pkey";

drop index if exists "public"."codes_pkey";

CREATE UNIQUE INDEX codes_pkey ON public.codes USING btree ("group");

alter table "public"."codes" add constraint "codes_pkey" PRIMARY KEY using index "codes_pkey";


