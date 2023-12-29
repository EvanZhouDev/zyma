drop policy "Limit attendee insertion to joinable groups OR admins" on "public"."attendees";

CREATE OR REPLACE FUNCTION public.is_joinable(join_code uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
  RETURN (EXISTS (SELECT 1 FROM groups WHERE groups.joinable AND groups.code = join_code));
END;$function$
;

create policy "Limit attendee insertion to joinable groups OR admins"
on "public"."attendees"
as permissive
for insert
to authenticated
with check ((is_joinable(with_code) OR (EXISTS ( SELECT 1
   FROM groups
  WHERE ((groups.code = attendees.with_code) AND (groups.admin = auth.uid()))))));
