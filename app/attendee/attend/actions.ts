"use server";

import { v } from "@/utils";
import { getServerClient } from "@/utils/supabase/server";

export async function updateExcuse(code: string, user: string, status: number) {
	const client = await getServerClient();
	v(
		await client
			.from("attendance")
			.update({ status })
			.eq("code_used", code)
			.eq("attendee", user),
	);
}
