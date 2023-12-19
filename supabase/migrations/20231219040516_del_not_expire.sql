alter table "public"."codes" drop column "expired";
alter table "public"."codes" drop column "expires_at";
alter table "public"."codes" add column "metadata" jsonb not null default '{"expires_at": null}'::jsonb;

create extension if not exists "pg_cron" with schema "extensions";

CREATE OR REPLACE FUNCTION public.delete_expired_codes()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin
    DELETE FROM public.codes WHERE metadata->>'expires_at' IS NOT null and 
        TO_TIMESTAMP(metadata->>'expires_at') < NOW();
end;
$function$;


select cron.schedule (
    'delete-expired-codes', -- name of the cron job
    '0 0 * * *', -- Every day
    $$ SELECT public.delete_expired_codes() $$
);
