"use client";

import { convertStatus } from "@/components/constants";
import { v } from "@/utils";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import TimeElapsed from "./TimeElapsed";

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
			.eq("student", uuid)
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
	const [statuses, setStatuses] = useState<{ [key: string]: string }>(
		Object.fromEntries(
			joined.map(({ student, status }) => [student, convertStatus(status)])
		)
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
							return {
								...x,
								[payload.new.student]: convertStatus(payload.new.status),
							};
						});
					}
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
						setStatuses((x) => {
							return {
								...x,
								[payload.new.student]: convertStatus(payload.new.status),
							};
						});
					}
				)
				.subscribe();
		})();
	}, [attendanceCode]);
	return (
		<>
			<table className="table mt-5 w-full outline outline-base-300 outline-1 text-[#24292F] rounded-lg">
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
							<td>{statuses[student.student]}</td>
						</tr>
					))}
				</tbody>
			</table>
			{joined.length === 0 ? <h1 className="text-center font-bold mt-5 text-xl opacity-50">Waiting for students to join...</h1> : ""}
		</>
	);
}
