"use server";

import { v } from "@/utils";
import { getServerClient } from "@/utils/supabase/server";
import { AttendeeMetadata } from "./contexts";

export async function addAttendee(code: string, form: FormData) {
	const client = getServerClient();
	const attendees = v(
		await client
			.from("profiles")
			.select("id")
			.eq("email", form.get("email") as string),
	);
	// TODO: Form validation and use return
	if (attendees.length === 0) {
		throw new Error("Attendee not found");
	}
	const attendee = attendees[0].id;

	const { error } = await client
		.from("attendees")
		.insert([{ attendee, with_code: code }]);
	if (error != null) {
		console.error(error);
		if (error.code === "42501") {
			throw new Error("You cannot add hosts as an attendee");
		}
		throw new Error("Attendee is already in your group");
	}
}
export async function removeAttendee(group: number, attendee: string) {
	const client = getServerClient();
	v(
		await client
			.from("attendees_with_group")
			.delete()
			.eq("attendee", attendee)
			.eq("group", group),
	);
}
export async function createClass(className: string) {
	const client = getServerClient();
	return await client
		.from("groups")
		.insert([
			{ admin: (await client.auth.getUser()).data.user!.id, name: className },
		]);
}
export async function deleteClass(groupId: number) {
	const client = getServerClient();
	v(await client.from("groups").delete().eq("id", groupId));
}
// "Currently, it is only possible to update the entire JSON document."
// Can't refactor this into a class as 'Only async functions are allowed to be exported in a "use server" file'
export async function editRowGroupMetadata(
	groupId: number,
	row: string,
	newValue = "",
) {
	const client = getServerClient();
	v(
		await client
			.from("groups")
			.update({
				metadata: { ...(await getGroupMetadata(groupId)), [row]: newValue },
			})
			.eq("id", groupId),
	);
}
export async function deleteRowGroupMetadata(groupId: number, row: string) {
	const client = getServerClient();
	const original = await getGroupMetadata(groupId);
	delete original[row];
	v(
		await client
			.from("groups")
			.update({ metadata: original })
			.eq("id", groupId),
	);
}
async function getGroupMetadata(groupId: number) {
	const client = getServerClient();
	return v(await client.from("groups").select("metadata").eq("id", groupId))[0]
		.metadata as { [key: string]: string };
}

export async function editRowAttendeeMetadata(
	attendee: string,
	row: string,
	newValue = "",
) {
	const client = getServerClient();
	const original = await getAttendeeMetadata(attendee);
	original.customProperties[row] = newValue;
	v(
		await client
			.from("attendees")
			.update({
				metadata: original,
			})
			.eq("attendee", attendee),
	);
}
export async function deleteRowAttendeeMetadata(attendee: string, row: string) {
	const client = getServerClient();
	const original = await getAttendeeMetadata(attendee);
	delete original.customProperties[row];
	v(
		await client
			.from("attendees")
			.update({ metadata: original })
			.eq("attendee", attendee),
	);
}
async function getAttendeeMetadata(attendee: string) {
	const client = getServerClient();
	return v(
		await client.from("attendees").select("metadata").eq("attendee", attendee),
	)[0].metadata as AttendeeMetadata;
}
