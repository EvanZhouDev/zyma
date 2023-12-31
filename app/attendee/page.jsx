import { getServerClientWithRedirect } from "@/utils/supabase/server";
import Client from "./components/Client";

export default async function Page() {
	const { attendeeId } = await getServerClientWithRedirect("/attendee");
	console.log(attendeeId);

	return <Client />;
}
