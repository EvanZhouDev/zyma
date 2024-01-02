import { getServerClientWithRedirect } from "@/utils/supabase/server";
import Dashboard from "./components/Dashboard";
import { SELECT_ATTENDEES } from "./queries";

// import { useEffect } from "react";
export default async function Page() {
	const { client, attendeeId } =
		await getServerClientWithRedirect("/host/dashboard");
	const { data: groups, error } = await client
		.from("groups")
		.select(`*, attendees (${SELECT_ATTENDEES})`)
		.eq("admin", attendeeId);
	if (error) {
		return <p>An error occurred</p>;
	}
	return <Dashboard initialGroups={groups} admin={attendeeId} />;
}
