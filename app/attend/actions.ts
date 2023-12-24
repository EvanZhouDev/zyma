"use server";

import { v } from "@/utils";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function updateExcuse(code: string, user: string, status: number) {
	const cookieStore = cookies();
	const client = createClient(cookieStore);
	v(
		await client
			.from("attendance")
			.update({ status })
			.eq("code_used", code)
			.eq("attendee", user),
	);
}
