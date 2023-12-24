import { getServerClientWithRedirect } from "@/utils/supabase/server";
import Dashboard from "./components/Dashboard";

// import { useEffect } from "react";

export default async function Page() {
	const { client } = await getServerClientWithRedirect("/teacher/dashboard");
	const { data: groups, error } = await client
		.from("groups")
		.select("name, id")
		.eq("admin", (await client.auth.getUser()).data.user!.id);
	if (error) {
		return <p>An error occurred</p>;
	}
	return <Dashboard groups={groups} />;
}
