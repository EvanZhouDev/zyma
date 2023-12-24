"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function StudentCounter({
	attendanceCode,
	initialJoined,
}: {
	attendanceCode: string;
	initialJoined: number;
}) {
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
					(_) => {
						setStudentCount((x) => x + 1);
					},
				)
				.subscribe();
		})();
	});
	return <>{studentCount}</>;
}
