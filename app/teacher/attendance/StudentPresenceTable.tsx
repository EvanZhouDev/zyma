"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function StudentPresenceTable({
	joined,
}: {
	joined: { profiles: { username: string } | null; student: string }[] | null;
}) {
	const [statuses, setStatuses] = useState<{ [key: string]: number }>({});
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
				{joined?.map((student, i) => (
					<tr>
						<th>{i + 1}</th>
						<td>{student.profiles?.username}</td>
						<td>4:31</td>
						{/* TODO: relative time */}
						<td>{statuses[student.student]}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
