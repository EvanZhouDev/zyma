"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
function convertStatus(status: number) {
	if (status === 0) return "Present";
	return "Absent";
}
function getRelativeTime(time1: string, time2: string) {
	// Convert both times to Date objects
	const date1 = new Date(time1);
	const date2 = new Date(time2);

	// Calculate the difference in milliseconds
	const diff = date2.getTime() - date1.getTime();

	// Convert the difference to minutes
	const minutes = Math.floor(diff / 60000);

	// Convert the remaining difference to seconds
	const seconds = parseInt(((diff % 60000) / 1000).toFixed(0));

	// Return the difference as a string
	return `${minutes} minute${minutes === 1 ? "" : "s"} and ${
		seconds < 10 ? "0" : ""
	}${seconds} second${seconds === 1 ? "" : "s"} ago`;
}
export default function StudentPresenceTable({
	joined,
}: {
	joined: {
		profiles: { username: string } | null;
		student: string;
		status: number;
		created_at: string;
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
	const [curTime, setCurTime] = useState(new Date().toISOString());
	useEffect(() => {
		const interval = setInterval(() => {
			setCurTime(new Date().toISOString());
		}, 1000);
		return () => clearInterval(interval);
	}, []);
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
							<div
								className="tooltip"
								data-tip={getRelativeTime(student.created_at, curTime)}
							>
								{new Date(student.created_at).toLocaleTimeString()}
							</div>
						</td>
						<td>{convertStatus(statuses[student.student])}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
