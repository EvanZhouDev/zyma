CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  insert into public.profiles (id, username, email, account_type)
  values (new.id, new.raw_user_meta_data ->> 'name', new.email, CAST (new.raw_user_meta_data ->> 'role' as smallint));
  return new;
end;
$function$
;
