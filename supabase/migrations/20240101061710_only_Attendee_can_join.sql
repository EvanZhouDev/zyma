drop policy "Limit attendee insertion to joinable groups OR admins" on "public"."attendees";

create policy "Limit attendee insertion to joinable groups OR admins"
on "public"."attendees"
as permissive
for insert
to authenticated
with check (((is_joinable(with_code) OR (EXISTS ( SELECT 1
   FROM groups
  WHERE ((groups.code = attendees.with_code) AND (groups.admin = auth.uid()))))) AND (attendee = auth.uid()) AND (( SELECT profiles.account_type
   FROM profiles
  WHERE (profiles.id = attendees.attendee)) = 1)));



