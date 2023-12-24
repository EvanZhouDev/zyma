import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Dashboard from "./components/Dashboard";

// import { useEffect } from "react";

export default async function Page() {
	const cookieStore = cookies();
	const client = createClient(cookieStore);
	if ((await client.auth.getUser()).data?.user?.id == null) {
		return redirect("/");
	}
	const { data: groups, error } = await client
		.from("groups")
		.select("name, id")
		.eq("admin", (await client.auth.getUser()).data.user!.id);
	if (error) {
		return <p>An error occurred</p>;
	}
	return <Dashboard groups={groups} />;
}
