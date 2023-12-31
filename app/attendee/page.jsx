import { getServerClientWithRedirect } from "@/utils/supabase/server";
import Client from "./components/Client";
import { v } from "@/utils";

export default async function Page() {
	const { client, attendeeId } = await getServerClientWithRedirect("/attendee");
	// RLS will automatically filter out groups that the attendee is not a member of
	const initialGroups = v(await client.from("groups").select("*"));

	return <Client initialGroups={initialGroups} attendeeId={attendeeId} />;
}
