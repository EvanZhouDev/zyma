"use client";

import { convertStatus } from "@/components/constants";
import { ChangeEvent, useState } from "react";

type AttendeeInAttendance = {
	profiles: { username: string } | null;
	attendee: string;
	status: number;
	created_at?: string;
};
export default function AttendeePresenceTable({
	joined,
	totalAttendeesList,
}: {
	joined: AttendeeInAttendance[];
}) {
	const [selectedFilter, setSelectedFilter] = useState("All Statuses");
	const [searchContent, setSearchContent] = useState("");

	const handleFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
		setSelectedFilter(event.target.value);
	};
	const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
		setSearchContent(event.target.value);
	};

	// const [joined, setJoined] = useState(initialJoined);
	const statuses = Object.fromEntries(
		joined.map(({ attendee, status }) => [attendee, convertStatus(status)])
	);
	// useEffect(() => {
	// 	(async () => {
	// 		const client = await createClient();
	// 		client
	// 			.channel("custom-insert-channel")
	// 			.on(
	// 				"postgres_changes",
	// 				{
	// 					event: "INSERT",
	// 					schema: "public",
	// 					table: "attendance",
	// 					// I hope this doesn't introduce security errors
	// 					filter: `code_used=eq.${attendanceCode}`,
	// 				},
	// 				(payload) => {
	// 					getAttendee(payload.new.attendee, attendanceCode).then(
	// 						(attendee) => {
	// 							setJoined((x) => [...x, attendee!]);
	// 						},
	// 					);
	// 					setStatuses((x) => {
	// 						return {
	// 							...x,
	// 							[payload.new.attendee]: convertStatus(payload.new.status),
	// 						};
	// 					});
	// 				},
	// 			)
	// 			.on(
	// 				"postgres_changes",
	// 				{
	// 					event: "UPDATE",
	// 					schema: "public",
	// 					table: "attendance",
	// 					filter: `code_used=eq.${attendanceCode}`,
	// 				},
	// 				(payload) => {
	// 					setStatuses((x) => {
	// 						return {
	// 							...x,
	// 							[payload.new.attendee]: convertStatus(payload.new.status),
	// 						};
	// 					});
	// 				},
	// 			)
	// 			.subscribe();
	// 	})();
	// }, [attendanceCode]);
	return (
		<>
			<div className="flex flex-row items-center w-full justify-between mt-4">
				<label>
					<select
						className="select input-standard mr-2"
						onChange={handleFilterChange}
					>
						<option defaultChecked>All Statuses</option>
						<option>Present</option>
						{/* <option>Late</option> */}
						<option>Absent</option>
					</select>
				</label>
				<input
					type="text"
					placeholder="Search Attendees..."
					className="input input-standard ml-1 flex-grow"
					onChange={handleSearchChange}
				/>
			</div>
			<div className="flex-grow w-full">
				<table className="table mt-5 w-full outline outline-base-200 outline-1 text-[#24292F] rounded-lg">
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
							.filter((attendee, _i) => {
								let show = true;
								if (
									selectedFilter === "Absent" &&
									statuses[attendee.attendee] === "Present"
								) {
									show = false;
								}
								if (
									selectedFilter === "Present" &&
									statuses[attendee.attendee] !== "Present"
								) {
									show = false;
								}
								if (selectedFilter === "Late") {
									// TODO: ADD "LATE"
									show = false;
								}
								if (
									!attendee
										.profiles!.username.toLowerCase()
										.includes(searchContent.toLowerCase())
								)
									show = false;

								return show;
							})
							.map((attendee, i) => {
								return (
									<tr key={attendee.attendee}>
										<th>{i + 1}</th>
										<td>
											{attendee.profiles!.username}
											{!totalAttendeesList
												.map((x) => x.attendee)
												.includes(attendee.attendee) && (
												<p className="opacity-50">(Unregistered)</p>
											)}
										</td>
										<td>
											{new Date(attendee.created_at ?? "").toLocaleTimeString(
												[],
												{
													hour: "2-digit",
													minute: "2-digit",
												}
											)}
										</td>
										<td>
											{(() => {
												const parsedStatus =
													statuses[attendee.attendee] === "Present"
														? "Present"
														: "Absent";

												const colorMap: { [key: string]: string } = {
													Present: "#1E883E",
													Absent: "#881E1E",
												};

												return (
													<span
														style={{
															borderColor: colorMap[parsedStatus],
															color: colorMap[parsedStatus],
														}}
														className={"border border-3 p-2 rounded-full"}
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
					<tfoot className="border-none outline-none" />
				</table>
				{joined.length === 0 ? (
					<h1 className="text-center font-bold mt-5 text-xl opacity-50">
						Waiting for attendees to join...
					</h1>
				) : (
					""
				)}
			</div>
		</>
	);
}
