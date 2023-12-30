drop policy "Enable insert for users based on user_id" on "public"."attendance";

drop policy "Enable select for authenticated users only" on "public"."codes";

drop policy "Enable delete for users based on user_id" on "public"."groups";

drop policy "Enable insert for users based on user_id" on "public"."groups";

create policy "Only admins can see who in attendance"
on "public"."attendance"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM groups,
    codes
  WHERE ((groups.id = codes."group") AND (codes.code = attendance.code_used) AND (auth.uid() = groups.admin)))));


create policy "You can insert your own attendance"
on "public"."attendance"
as permissive
for insert
to public
with check ((auth.uid() = attendee));


create policy "You can see your own attendance information"
on "public"."attendance"
as permissive
for select
to public
using ((auth.uid() = attendee));


create policy "Limit attendee insertion to group admins"
on "public"."attendees"
as permissive
for insert
to public
with check ((EXISTS ( SELECT 1
   FROM groups
  WHERE ((groups.admin = auth.uid()) AND (groups.id = attendees."group")))));


create policy "Anyone can select"
on "public"."codes"
as permissive
for select
to public
using (true);


create policy "Enable delete for users based on groups.admin"
on "public"."codes"
as permissive
for delete
to public
using ((EXISTS ( SELECT 1
   FROM groups
  WHERE ((groups.id = codes."group") AND (groups.admin = auth.uid())))));


create policy "Only admins of the group can insert codes for that group"
on "public"."codes"
as permissive
for insert
to public
with check ((EXISTS ( SELECT 1
   FROM groups
  WHERE ((groups.admin = auth.uid()) AND (groups.id = codes."group")))));


create policy "INSERT for admins only"
on "public"."groups"
as permissive
for insert
to public
with check ((auth.uid() = admin));


create policy "Only admins can delete"
on "public"."groups"
as permissive
for delete
to public
using ((auth.uid() = admin));


create policy "Only admins can update groups"
on "public"."groups"
as permissive
for update
to public
using ((auth.uid() = admin))
with check (true);



