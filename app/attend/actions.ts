"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function updateExcuse(code: string, user: string, status: number) {
	const cookieStore = cookies();
	const client = createClient(cookieStore);
	const res = await client
		.from("attendance")
		.update({ status })
		.eq("code_used", code)
		.eq("student", user)
		.select();
	return res;
}
