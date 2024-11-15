import { v } from "@/utils";
import { getServerClientWithRedirect } from "@/utils/supabase/server";
import Dashboard from "./Dashboard";

export default async function Index({
	searchParams,
}: {
	searchParams: Promise<{ groupId: number }>;
}) {
	const { groupId } = await searchParams;
	const { client } = await getServerClientWithRedirect(
		`/host/attendance?groupId=${encodeURIComponent(groupId)}`,
	);
	const CODE_SELECT = "groups (name), code, created_at";
	const existingCode = v(
		await client.from("codes").select(CODE_SELECT).eq("group", groupId),
	);
	let data: (typeof existingCode)[0];
	//XXX: Can't I just do an UPSERT?
	if (existingCode.length === 1) {
		data = existingCode[0];
	} else {
		data = v(
			await client
				.from("codes")
				.insert([{ group: groupId }])
				.select(CODE_SELECT),
		)[0];
	}

	const joined =
		v(
			await client
				.from("attendance")
				.select("profiles (username), attendee, status, created_at")
				.eq("code_used", data.code),
		) ?? [];
	const attendeesInClass =
		v(
			await client
				.from("attendees_with_group")
				.select("*")
				.eq("group", groupId),
		) ?? [];
	// console.log(totalAttendees);
	return (
		<Dashboard
			data={data}
			initialJoined={joined}
			attendeesInClass={attendeesInClass}
		/>
	);
}
