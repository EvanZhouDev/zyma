"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import TimeElapsed from "./TimeElapsed";
function convertStatus(status: number) {
	if (status === 0) return "Present";
	return "Absent";
}

export default function StudentPresenceTable({
	joined,
}: {
	joined: {
		profiles: { username: string } | null;
		student: string;
		status: number;
		created_at?: string;
	}[];
}) {
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
					{ event: "INSERT", schema: "public", table: "attendance" },
					(payload) => {
						console.log("insert", payload);
						setStatuses((x) => {
							return { ...x, [payload.new.student]: payload.new.status };
						});
					},
				)
				.on(
					"postgres_changes",
					{ event: "UPDATE", schema: "public", table: "attendance" },
					(payload) => {
						console.log("update", payload);
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
