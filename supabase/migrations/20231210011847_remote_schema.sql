alter table "public"."students" drop constraint "students_student_fkey";

create table "public"."profiles" (
    "id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "username" character varying not null
);


alter table "public"."profiles" enable row level security;

alter table "public"."codes" add column "expired" boolean not null default false;

alter table "public"."codes" disable row level security;

alter table "public"."students" disable row level security;

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."students" add constraint "students_student_fkey" FOREIGN KEY (student) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."students" validate constraint "students_student_fkey";

create policy "Enable insert for users based on user_id"
on "public"."attendance"
as permissive
for insert
to public
with check ((auth.uid() = student));


create policy "Enable delete for users based on user_id"
on "public"."classes"
as permissive
for delete
to public
using ((auth.uid() = admin));


create policy "Enable insert for users based on user_id"
on "public"."classes"
as permissive
for insert
to public
with check ((auth.uid() = admin));


create policy "Enable read access for all users"
on "public"."classes"
as permissive
for select
to public
using (true);


create policy "Enable select for authenticated users only"
on "public"."codes"
as permissive
for select
to authenticated
using (true);


create policy "Enable insert for users based on user_id"
on "public"."profiles"
as permissive
for insert
to public
with check ((auth.uid() = id));


create policy "Enable read access for all users"
on "public"."profiles"
as permissive
for select
to public
using (true);


create policy "Enable update for users based on user_id"
on "public"."profiles"
as permissive
for update
to public
using ((auth.uid() = id));


create policy "Enable read access for all users"
on "public"."students"
as permissive
for select
to public
using (true);



