"use server";

import { createClient as createBrowserClient } from "@/utils/supabase/client";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function getStudentData(classID: string) {
	"use client";
	const client = createBrowserClient();
	const res = await client
		.from("students")
		.select("profiles (username)")
		.eq("class", classID);
	console.log(res); // rls issues?
	return res;
}
export async function addStudent(classId, form: FormData) {
	console.log("added", form.get("email"));
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
	console.log(error, data, res);
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
export async function deleteClass(classId: string) {
	const cookieStore = cookies();
	const client = createClient(cookieStore);
	const res = await client.from("classes").delete().eq("id", classId);
	return res;
}
