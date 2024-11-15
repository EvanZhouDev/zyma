"use server";

import { v } from "@/utils";
import { getServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function endSession(code: string) {
	"use server";
	const client = await getServerClient();
	v(
		await client.rpc("end_session", {
			attendance_code: code,
		}),
	);
	return redirect("/host/dashboard");
}
