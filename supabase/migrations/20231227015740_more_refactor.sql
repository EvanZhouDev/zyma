alter table "public"."codes" drop column "id";

CREATE UNIQUE INDEX codes_pkey ON public.codes USING btree (code);

alter table "public"."codes" add constraint "codes_pkey" PRIMARY KEY using index "codes_pkey";


