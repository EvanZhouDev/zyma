create table "public"."attendance" (
    "created_at" timestamp with time zone not null default now(),
    "code_used" bigint not null,
    "student" uuid not null,
    "status" smallint not null default '0'::smallint,
    "metadata" json default 'null'::json
);


alter table "public"."attendance" enable row level security;

CREATE UNIQUE INDEX attendance_pkey ON public.attendance USING btree (code_used, student);

alter table "public"."attendance" add constraint "attendance_pkey" PRIMARY KEY using index "attendance_pkey";

alter table "public"."attendance" add constraint "attendance_code_used_fkey" FOREIGN KEY (code_used) REFERENCES codes(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."attendance" validate constraint "attendance_code_used_fkey";

alter table "public"."attendance" add constraint "attendance_student_fkey" FOREIGN KEY (student) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."attendance" validate constraint "attendance_student_fkey";


