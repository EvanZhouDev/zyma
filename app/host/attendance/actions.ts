import { v } from "@/utils";
import { getServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function endSession(id: number) {
	"use server";
	const client = getServerClient();
	v(await client.from("codes").delete().eq("id", id));
	return redirect("/host/dashboard");
}
