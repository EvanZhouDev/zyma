"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function addStudent(classId, form: FormData) {
	const cookieStore = cookies();
	const client = createClient(cookieStore);
	const { data, error } = await client
		.from("profiles")
		.select("id")
		.eq("email", form.get("email"));
	if (data?.length == null) {
		console.error("account non existing");
		return;
	}
	const res = await client
		.from("students")
		.insert([{ class: classId, student: data[0].id }])
		.select();
}
export async function createClass(className: string) {
	const cookieStore = cookies();
	const client = createClient(cookieStore);
	const res = await client
		.from("classes")
		.insert([
			{ admin: (await client.auth.getUser()).data.user!.id, name: className },
		])
		.select();
	return res;
}
export async function deleteClass(classId: number) {
	const cookieStore = cookies();
	const client = createClient(cookieStore);
	const res = await client.from("classes").delete().eq("id", classId);
	return res;
}
