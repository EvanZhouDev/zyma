"use client";

import { convertStatus } from "@/components/constants";
import { v } from "@/utils";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState, ChangeEvent } from "react";
import TimeElapsed from "./TimeElapsed";
import { FilterIcon, SearchIcon } from "@primer/octicons-react";

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
	)[0];
}
export default function StudentPresenceTable({
	initialJoined,
	attendanceCode,
}: {
	initialJoined: StudentInAttendance[];
	attendanceCode: string;
}) {
	const [selectedFilter, setSelectedFilter] = useState("All Statuses");
	const [searchContent, setSearchContent] = useState("");

	const handleFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
		setSelectedFilter(event.target.value);
	};
	const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
		setSearchContent(event.target.value);
	};

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
			<div className="flex flex-row items-center w-full justify-between mt-4">
				<FilterIcon size="medium" verticalAlign="middle" className="mr-2" />
				<select
					className="select input-standard mr-2"
					onChange={handleFilterChange}
				>
					<option defaultChecked>All Statuses</option>
					<option>Present</option>
					<option>Late</option>
					<option>Absent</option>
				</select>
				<SearchIcon size="medium" verticalAlign="middle" className="mr-2" />
				<input
					type="text"
					placeholder="Search Students..."
					className="input input-standard ml-1 flex-grow"
					onChange={handleSearchChange}
				/>
			</div>
			<div className="flex-grow w-full">
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
						{joined
							.filter((student, i) => {
								let show = true;
								if (
									selectedFilter === "Absent" &&
									statuses[student.student] === "Present"
								) {
									show = false;
								}
								if (
									selectedFilter === "Present" &&
									statuses[student.student] !== "Present"
								) {
									show = false;
								}
								if (selectedFilter === "Late") {
									// TODO: ADD "LATE"
									show = false;
								}
								if (
									!student
										.profiles!.username.toLowerCase()
										.includes(searchContent.toLowerCase())
								)
									show = false;

								return show;
							})
							.map((student, i) => {
								return (
									<tr key={student.student}>
										<th>{i + 1}</th>
										<td>{student.profiles!.username}</td>
										<td>
											{new Date(student.created_at ?? "").toLocaleTimeString(
												[],
												{
													hour: "2-digit",
													minute: "2-digit",
												}
											)}
										</td>
										<td>
											{(() => {
												let parsedStatus =
													statuses[student.student] == "Present"
														? "Present"
														: "Absent";

												let colorMap: { [key: string]: string } = {
													Present: "#1E883E",
													Absent: "#881E1E",
												};

												return (
													<span
														style={{
															borderColor: colorMap[parsedStatus],
															color: colorMap[parsedStatus],
														}}
														className={`border border-3 p-2 rounded-full`}
													>
														{parsedStatus}
													</span>
												);
											})()}
										</td>
									</tr>
								);
							})}
					</tbody>
					<tfoot className="border-none outline-none"></tfoot>
				</table>
				{joined.length === 0 ? (
					<h1 className="text-center font-bold mt-5 text-xl opacity-50">
						Waiting for students to join...
					</h1>
				) : (
					""
				)}
			</div>
		</>
	);
}
