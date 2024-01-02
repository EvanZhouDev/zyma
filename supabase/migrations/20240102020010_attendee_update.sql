create policy "Admins can update attendees or attendees can update themselves"
on "public"."attendees"
as permissive
for update
to public
using (((auth.uid() = ( SELECT groups.admin
   FROM groups
  WHERE (groups.code = attendees.with_code))) OR (auth.uid() = attendee)))
with check (true);



