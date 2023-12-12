alter table "public"."profiles" add column "email" text;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  insert into public.profiles (id, username, email)
  values (new.id, new.raw_user_meta_data ->> 'name', new.email);
  return new;
end;
$function$
;


