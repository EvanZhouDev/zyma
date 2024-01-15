"use client";

import { convertStatus } from "@/components/constants";
import { ChangeEvent, ReactNode, useState } from "react";
import {
	IssueDraftIcon,
	IssueClosedIcon,
	RepoIcon,
	RepoTemplateIcon,
} from "@primer/octicons-react";
import { SelectPublic } from "@/utils";
import { AttendeeInAttendance } from "./utils";

export default function AttendeePresenceTable({
	joined,
	attendeesInClass,
	accessories,
}: {
	joined: AttendeeInAttendance[];
	attendeesInClass: SelectPublic<"attendees_with_group", "*">[];
	accessories?: ReactNode;
}) {
	const [searchContent, setSearchContent] = useState("");

	const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
		setSearchContent(event.target.value);
	};

	// const [joined, setJoined] = useState(initialJoined);
	const statuses = Object.fromEntries(
		joined.map(({ attendee, status }) => [attendee, convertStatus(status)]),
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
	const [isPresentSelected, setIsPresentSelected] = useState(true);
	const [isAbsentSelected, setIsAbsentSelected] = useState(true);
	const [isForeignSelected, setIsForeignSelected] = useState(true);
	const [isRegisteredSelected, setIsRegisteredSelected] = useState(true);

	return (
		<>
			<div className="flex flex-row items-center w-full justify-between mt-4">
				{/* <label>
					<select
						className="select input-standard mr-2"
						onChange={handleFilterChange}
					>
						<option defaultChecked>All Statuses</option>
						<option>Present</option>
						<option>Absent</option>
					</select>
				</label> */}
				<input
					type="text"
					placeholder="Search Attendees..."
					className="input input-standard flex-grow"
					onChange={handleSearchChange}
				/>
				{accessories}
			</div>
			{/* Opacity 0 instead of hidden because we want that space padding */}
			<div className="flex flex-row gap-2 w-full mt-7 items-center justify-center">
				<label
					className={`pill-select ${
						isPresentSelected ? "pill-select-filled" : ""
					}`}
				>
					<IssueClosedIcon verticalAlign="middle" size="medium" />
					<input
						type="checkbox"
						className="opacity-0"
						name="present"
						onChange={() => setIsPresentSelected(!isPresentSelected)}
					/>
					Present
				</label>
				<label
					className={`pill-select ml-2 ${
						isAbsentSelected ? "pill-select-filled" : ""
					}`}
				>
					<IssueDraftIcon verticalAlign="middle" size="medium" />
					<input
						type="checkbox"
						className="opacity-0"
						name="absent"
						onChange={() => setIsAbsentSelected(!isAbsentSelected)}
					/>
					Absent
				</label>
				<label
					className={`pill-select ml-2 ${
						isForeignSelected ? "pill-select-filled" : ""
					}`}
				>
					<RepoTemplateIcon verticalAlign="middle" size="medium" />
					<input
						type="checkbox"
						className="opacity-0"
						name="foreign"
						onChange={() => {
							setIsForeignSelected(!isForeignSelected);
						}}
					/>
					Foreign
				</label>
				<label
					className={`pill-select ml-2 ${
						isRegisteredSelected ? "pill-select-filled" : ""
					}`}
				>
					<RepoIcon verticalAlign="middle" size="medium" />
					<input
						type="checkbox"
						className="opacity-0"
						name="registered"
						onChange={() => setIsRegisteredSelected(!isRegisteredSelected)}
					/>
					Registered
				</label>
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
								let showStatus = false;
								if (
									isPresentSelected &&
									statuses[attendee.attendee] === "Present"
								) {
									showStatus = true;
								}
								if (
									isAbsentSelected &&
									statuses[attendee.attendee] !== "Present"
								) {
									showStatus = true;
								}

								let showType = false;

								if (
									isForeignSelected &&
									!attendeesInClass
										.map((x) => x.attendee)
										.includes(attendee.attendee)
								) {
									showType = true;
								}

								if (
									isRegisteredSelected &&
									attendeesInClass
										.map((x) => x.attendee)
										.includes(attendee.attendee)
								) {
									// console.log("AHH2");
									showType = true;
								}

								if (
									!attendee
										.profiles!.username.toLowerCase()
										.includes(searchContent.toLowerCase())
								) {
									showStatus = false;
								}

								return showStatus && showType;
							})
							.map((attendee, i) => {
								return (
									<tr key={attendee.attendee}>
										<th>{i + 1}</th>
										<td>
											{attendee.profiles!.username}
											{!attendeesInClass
												.map((x) => x.attendee)
												.includes(attendee.attendee) && (
												<span className="opacity-50"> (Foreign)</span>
											)}
										</td>
										<td>
											{new Date(attendee.created_at ?? "").toLocaleTimeString(
												[],
												{
													hour: "2-digit",
													minute: "2-digit",
												},
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
					<h1 className="text-center font-bold my-10 text-xl opacity-50">
						Waiting for attendees to join...
					</h1>
				) : (
					""
				)}
			</div>
		</>
	);
}
