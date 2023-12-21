"use server";

import { v } from "@/utils";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function addStudent(classId: number, form: FormData) {
  const cookieStore = cookies();
  const client = createClient(cookieStore);
  const students = v(
    await client
      .from("profiles")
      .select("id")
      .eq("email", form.get("email") as string),
  );
  // TODO: Form validation and use return
  if (students?.length == null) {
    throw new Error("Student not found");
  }
  const student = students[0].id;

  const { error } = await client
    .from("students")
    .insert([{ class: classId, student }]);
  if (error != null) {
    throw new Error("Student is already in your class");
  }
}
export async function createClass(className: string) {
  const cookieStore = cookies();
  const client = createClient(cookieStore);
  return await client
    .from("classes")
    .insert([
      { admin: (await client.auth.getUser()).data.user!.id, name: className },
    ]);
}
export async function deleteClass(classId: number) {
  const cookieStore = cookies();
  const client = createClient(cookieStore);
  v(await client.from("classes").delete().eq("id", classId));
}
