drop policy "Enable read access for all users" on "public"."groups";

create policy "Limit SELECT to admins and attendees"
on "public"."groups"
as permissive
for select
to public
using (((admin = auth.uid()) OR (EXISTS ( SELECT 1
   FROM attendees
  WHERE ((attendees.attendee = auth.uid()) AND (attendees.with_code = groups.code))))));
