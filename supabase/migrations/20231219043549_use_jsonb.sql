alter table "public"."attendance" alter column "metadata" set default 'null'::jsonb;

alter table "public"."attendance" alter column "metadata" set data type jsonb using "metadata"::jsonb;

alter table "public"."classes" alter column "config" set default 'null'::jsonb;

alter table "public"."classes" alter column "config" set data type jsonb using "config"::jsonb;

alter table "public"."students" alter column "metadata" set default 'null'::jsonb;

alter table "public"."students" alter column "metadata" set data type jsonb using "metadata"::jsonb;