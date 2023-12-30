import { v } from "@/utils";
import { getServerClientWithRedirect } from "@/utils/supabase/server";
import Dashboard from "./Dashboard";

export default async function Index({
	searchParams,
}: {
	searchParams: { groupId: number };
}) {
	const { client } = await getServerClientWithRedirect(
		`/host/attendance?groupId=${encodeURIComponent(searchParams.groupId)}`,
	);
	const CODE_SELECT = "groups (name), code, created_at";
	const existingCode = v(
		await client
			.from("codes")
			.select(CODE_SELECT)
			.eq("group", searchParams.groupId),
	);
	let data: (typeof existingCode)[0];
	//XXX: Can't I just do an UPSERT?
	if (existingCode.length === 1) {
		data = existingCode[0];
	} else {
		data = v(
			await client
				.from("codes")
				.insert([{ group: searchParams.groupId }])
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
	const totalAttendees =
		(
			await client
				.from("attendees_with_group")
				.select("*", { head: true, count: "exact" })
				.eq("group", searchParams.groupId)
		).count ?? 0;

	return (
		<Dashboard
			data={data}
			initialJoined={joined}
			totalAttendees={totalAttendees}
			groupId={searchParams.groupId}
		/>
	);
}
