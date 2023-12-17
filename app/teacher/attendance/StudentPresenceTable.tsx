"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import TimeElapsed from "./TimeElapsed";
import { v } from "@/utils";
function convertStatus(status: number) {
	if (status === 0) return "Present";
	return "Absent";
}
type StudentInAttendance = {
	profiles: { username: string } | null;
	student: string;
	status: number;
	created_at?: string;
};
async function getStudent(uuid: string, code: string) {
	const client = await createClient();
	return v(
		await client
			.from("attendance")
			.select("profiles (username), student, status, created_at")
			.eq("code_used", code)
			.eq("student", uuid),
	)![0];
}
export default function StudentPresenceTable({
	initialJoined,
	attendanceCode,
}: {
	initialJoined: StudentInAttendance[];
	attendanceCode: string;
}) {
	const [joined, setJoined] = useState(initialJoined);
	const [statuses, setStatuses] = useState<{ [key: string]: number }>(
		Object.fromEntries(joined.map(({ student, status }) => [student, status])),
	);
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
						console.log("insert", payload);
						getStudent(payload.new.student, attendanceCode).then((student) => {
							setJoined((x) => [...x, student!]);
						});
						setStatuses((x) => {
							return { ...x, [payload.new.student]: payload.new.status };
						});
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
						console.log("update", payload);
						getStudent(payload.new.student, attendanceCode).then((student) => {
							setJoined((x) => [...x, student!]);
						});

						setStatuses((x) => {
							return { ...x, [payload.new.student]: payload.new.status };
						});
					},
				)
				.subscribe();
		})();
	});
	return (
		<table className="table">
			{/* head */}
			<thead>
				<tr>
					<th />
					<th>Name</th>
					<th>Time Joined</th>
					<th>Status</th>
				</tr>
			</thead>
			<tbody>
				{joined.map((student, i) => (
					<tr key={student.student}>
						<th>{i + 1}</th>
						<td>{student.profiles!.username}</td>
						<td>
							<TimeElapsed time={student.created_at} />
						</td>
						<td>{convertStatus(statuses[student.student])}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
