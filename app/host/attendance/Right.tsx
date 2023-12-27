"use client";
import { v } from "@/utils";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import AttendeePresenceTable from "./AttendeePresenceTable";
import { endSession } from "./actions";

async function getAttendee(uuid: string, code: string) {
	const client = await createClient();
	return v(
		await client
			.from("attendance")
			.select("profiles (username), attendee, status, created_at")
			.eq("code_used", code)
			.eq("attendee", uuid),
	)[0];
}
export default function Right({
	data,
	initialJoined,
	totalAttendees,
	searchParams,
}: {
	data: { groups: { name: string } | null; code: string; created_at: string };
	initialJoined: {
		profiles: { username: string } | null;
		attendee: string;
		status: number;
		created_at: string;
	}[];
	totalAttendees: number;
	searchParams: { groupId: number };
}) {
	const attendanceCode = data.code;
	const [joined, setJoined] = useState(initialJoined);
	useEffect(() => {
		(async () => {
			const client = await createClient();
			client
				.channel("custom-insert-channel")
				.on(
					"postgres_changes",
					{
						event: "INSERT",
						schema: "public",
						table: "attendance",
						// I hope this doesn't introduce security errors
						filter: `code_used=eq.${attendanceCode}`,
					},
					(payload) => {
						getAttendee(payload.new.attendee, attendanceCode).then(
							(attendee) => {
								setJoined((x) => [...x, attendee!]);
							},
						);
					},
				)
				.on(
					"postgres_changes",
					{
						event: "UPDATE",
						schema: "public",
						table: "attendance",
						filter: `code_used=eq.${attendanceCode}`,
					},
					(payload) => {
						console.log(payload);
						setJoined((x) =>
							x.map((y) =>
								y.attendee === payload.new.attendee
									? { ...y, status: payload.new.status }
									: y,
							),
						);
					},
				)
				.subscribe();
		})();
	}, [attendanceCode]);
	return (
		<div className="bg-base-100 rounded-xl m-3 ml-1.5 outline outline-base-200 outline-1 basis-1/2 flex flex-col justify-between items-center pl-5 pr-5">
			<div className="w-full">
				<div className="flex flex-row w-full justify-between mt-4">
					<h1 className="text-4xl font-bold">
						{joined.length}/{totalAttendees} Attendees Present
					</h1>{" "}
					<form action={endSession.bind(null, searchParams.groupId)}>
						<button className="btn btn-dangerous">End Session</button>{" "}
					</form>
				</div>
			</div>
			<AttendeePresenceTable joined={joined} />
		</div>
	);
}
