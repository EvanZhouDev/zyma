drop policy "You can insert your own attendance" on "public"."attendance";

drop policy "INSERT for admins only" on "public"."groups";

create policy "Attendees can attend"
on "public"."attendance"
as permissive
for insert
to public
with check (((auth.uid() = attendee) AND (( SELECT profiles.account_type
   FROM profiles
  WHERE (profiles.id = auth.uid())) = 1)));


create policy "INSERT for admins only"
on "public"."groups"
as permissive
for insert
to public
with check (((auth.uid() = admin) AND (( SELECT profiles.account_type
   FROM profiles
  WHERE (profiles.id = auth.uid())) = 0)));



