alter table "public"."attendance" drop constraint "attendance_student_fkey";

alter table "public"."classes" drop constraint "classes_admin_fkey";

alter table "public"."profiles" drop constraint "profiles_id_fkey";

alter table "public"."profiles" drop column "created_at";

alter table "public"."profiles" alter column "email" set not null;

alter table "public"."profiles" alter column "username" drop not null;

alter table "public"."attendance" add constraint "attendance_student_fkey" FOREIGN KEY (student) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."attendance" validate constraint "attendance_student_fkey";

alter table "public"."classes" add constraint "classes_admin_fkey" FOREIGN KEY (admin) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."classes" validate constraint "classes_admin_fkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();