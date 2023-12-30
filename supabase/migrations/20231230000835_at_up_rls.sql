create policy "You can update your own attendance status"
on "public"."attendance"
as permissive
for update
to public
using ((auth.uid() = attendee))
with check ((auth.uid() = attendee));



