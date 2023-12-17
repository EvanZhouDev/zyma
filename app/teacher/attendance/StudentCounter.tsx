"use client";

import Icon from "@/components/Icon";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function StudentCounter({
	total,
	attendanceCode,
	initialJoined,
}: { total: number; attendanceCode: string; initialJoined: number }) {
	const [studentCount, setStudentCount] = useState(initialJoined);
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
						setStudentCount((x) => x + 1);
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
						setStudentCount((x) => x + 1);
					},
				)
				.subscribe();
		})();
	});
	return (
		<div className="stat">
			<div className="stat-figure text-primary">
				<Icon.Outlined className="w-10" name="UserGroup" />
			</div>
			<div className="stat-title">Count</div>
			{/* TODO */}
			<div className="stat-value text-primary">
				{studentCount} student{studentCount === 1 ? "" : "s"}
			</div>
			<div className="stat-desc">out of {total}</div>
		</div>
	);
}
