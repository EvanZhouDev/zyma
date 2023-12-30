create policy "Admins can remove attendees or you can remove yourself"
on "public"."attendees"
as permissive
for delete
to public
using (((EXISTS ( SELECT 1
   FROM groups
  WHERE ((groups.code = attendees.with_code) AND (groups.admin = auth.uid())))) OR (attendee = auth.uid())));



