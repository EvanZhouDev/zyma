drop policy "Enable read access for all users" on "public"."attendees";

create policy "Enable read access for all users"
on "public"."attendees"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM attendees_with_group
  WHERE (attendees_with_group.admin = auth.uid()))));



