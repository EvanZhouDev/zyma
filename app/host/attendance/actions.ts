"use server";

import { v } from "@/utils";
import { getServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function endSession(group: number) {
  "use server";
  const client = getServerClient();
  v(await client.from("codes").delete().eq("group", group));
  return redirect("/host/dashboard");
}
