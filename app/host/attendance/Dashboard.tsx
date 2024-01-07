"use client";
import Logo from "@/components/Logo";
import ZymaCode from "@/components/ZymaCode";
import { ROOT_URL } from "@/components/constants";
import { v } from "@/utils";
import { createClient } from "@/utils/supabase/client";
import { AlertIcon, ZapIcon, GraphIcon } from "@primer/octicons-react";
import { useEffect, useState, useRef } from "react";
import AttendeePresenceTable from "./AttendeePresenceTable";
import TimeElapsed from "./TimeElapsed";
import { endSession } from "./actions";
import { getRelativeMinuteTime } from "./utils";

async function getAttendee(uuid: string, code: string) {
	const client = await createClient();
	return v(
		await client
			.from("attendance")
			.select("profiles (username), attendee, status, created_at")
			.eq("code_used", code)
			.eq("attendee", uuid)
	)[0];
}
export default function Dashboard({
	data,
	initialJoined,
	totalAttendeesList,
}: {
	data: { groups: { name: string } | null; code: string; created_at: string };
	initialJoined: {
		profiles: { username: string } | null;
		attendee: string;
		status: number;
		created_at: string;
	}[];
	totalAttendeesList;
}) {
	const totalAttendees = totalAttendeesList.length;
	const attendanceCode = data.code;
	const [joined, setJoined] = useState(initialJoined);
	const [rtStatus, setRtStatus] = useState("");
	const RTworking = rtStatus === "SUBSCRIBED";
	const statsDialog = useRef<HTMLDialogElement>(null);
	console.log(joined);
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
						getAttendee(payload.new.attendee, attendanceCode).then(
							(attendee) => {
								setJoined((x) => [...x, attendee!]);
							}
						);
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
						console.log(payload);
						setJoined((x) =>
							x.map((y) =>
								y.attendee === payload.new.attendee
									? { ...y, status: payload.new.status }
									: y
							)
						);
					}
				)
				.subscribe((x) => setRtStatus(x));
		})();
	}, [attendanceCode]);

	const getInClass = (joined) => {
		return joined.filter((x) =>
			totalAttendeesList.map((y) => y.attendee).includes(x.attendee)
		);
	};
	const getForeign = (joined) => {
		return joined.filter(
			(x) => !totalAttendeesList.map((y) => y.attendee).includes(x.attendee)
		);
	};

	return (
		<div className="w-full h-full bg-secondary-active justify-around flex">
			<div className="bg-base-100 rounded-xl m-3 mr-1.5 outline outline-base-200 outline-1 basis-1/2 flex flex-col justify-between items-center">
				<div className="flex justify-between items-center w-full">
					<div className="flex flex-col mt-5">
						<Logo className="w-[8.7vw] ml-5 mb-1" size={500} />

						{RTworking ? (
							<span className="text-[#1E883E] ml-5">
								<ZapIcon /> RT Connected
							</span>
						) : (
							<span className="text-red-600 ml-5">
								<AlertIcon /> RT Failed
							</span>
						)}
					</div>
					<div className="text-right mr-5 mt-5">
						Attendance session for
						<br />
						<b className="text-xl">{data.groups!.name}</b>
					</div>
				</div>
				<ZymaCode
					code={data.code}
					url={`${ROOT_URL}/attendee/attend?code=${data.code}`}
				/>
				<div className="flex flex-col items-center mb-4">
					<div className="text-3xl opacity-50">
						Session started{" "}
						<TimeElapsed
							time={data.created_at}
							getRelativeTime={getRelativeMinuteTime}
						/>{" "}
						ago.
					</div>
				</div>
			</div>
			<div className="bg-base-100 rounded-xl m-3 ml-1.5 outline outline-base-200 outline-1 basis-1/2 flex flex-col justify-between items-center pl-5 pr-5">
				<div className="w-full">
					<div className="flex flex-row w-full justify-between mt-4 align-center">
						<div className="flex flex-col">
							<h1 className="text-4xl font-bold">
								{getInClass(joined).length}/{totalAttendees} Attendees Present
							</h1>{" "}
							<p className="opacity-50 text-2xl mt-2">
								{getForeign(joined).map((x) => x.status === 0).length}/
								{getForeign(joined).length} Foreign Attendees Joined are Present
							</p>{" "}
						</div>
						<div className="flex items-center flex-row">
							{" "}
							<button
								className="btn btn-dangerous ml-2"
								onClick={() => statsDialog.current!.showModal()}
							>
								End Session
							</button>{" "}
						</div>
						<dialog ref={statsDialog} className="modal">
							<div className="modal-box !min-w-[90vw] h-[90vh]">
								<div className="w-full flex flex-row justify-between items-center">
									<div className="flex flex-col justify-center">
										<h1 className="text-2xl font-bold">
											Your Current Attendance
										</h1>
										<p className="text-xl opacity-50">
											For {totalAttendees} registered{" "}
											{totalAttendees === 1 ? "attendee" : "attendees"} and{" "}
											{getForeign(joined).length} foreign{" "}
											{getForeign(joined) === 1 ? "attendee" : "attendees"}
										</p>
									</div>

									<div className="stats w-[70%] overflow-hidden ml-5">
										<div className="stat">
											<div className="stat-title">Attendees Present</div>
											<div className="stat-value">
												{
													getInClass(joined).filter((x) => x.status === 0)
														.length
												}
											</div>
											<div className="stat-desc">
												{totalAttendees === 0 ? 0 : Math.round(
													(getInClass(joined).filter((x) => x.status === 0)
														.length /
														totalAttendees) *
														100
												)}
												% of total
											</div>
										</div>

										<div className="stat">
											<div className="stat-title">Attendees Absent</div>
											<div className="stat-value">
												{
													getInClass(joined).filter((x) => x.status !== 0)
														.length
												}
											</div>
											<div className="stat-desc">
												{totalAttendees === 0 ? 0 : Math.round(
													(getInClass(joined).filter((x) => x.status !== 0)
														.length /
														totalAttendees) *
														100
												)}
												% of total
											</div>
										</div>

										<div className="stat">
											<div className="stat-title">Unregistered</div>
											<div className="stat-value">
												{
													getForeign(joined)
														.filter(
															(x) =>
																!totalAttendeesList
																	.map((y) => y.attendee)
																	.includes(x.attendee)
														)
														.filter((x) => x.status === 0).length
												}
												/
												{
													getForeign(joined).filter(
														(x) =>
															!totalAttendeesList
																.map((y) => y.attendee)
																.includes(x.attendee)
													).length
												}
											</div>
											<div className="stat-desc">
												{getForeign(joined).filter(
													(x) =>
														!totalAttendeesList
															.map((y) => y.attendee)
															.includes(x.attendee)
												).length === 0
													? 0
													: Math.round(
															(getForeign(joined)
																.filter(
																	(x) =>
																		!totalAttendeesList
																			.map((y) => y.attendee)
																			.includes(x.attendee)
																)
																.filter((x) => x.status === 0).length /
																getForeign(joined).filter(
																	(x) =>
																		!totalAttendeesList
																			.map((y) => y.attendee)
																			.includes(x.attendee)
																).length) *
																100
													  )}
												% of total unregistered
											</div>
										</div>
									</div>
								</div>

								<div role="alert" className="alert alert-error mt-5">
									<AlertIcon size="medium" />
									<div>
										<p className="text-lg">
											Unregistered attendee data is irreversibly discarded.
											Ensure to copy the data now if you need it.
										</p>
									</div>
								</div>

								<AttendeePresenceTable
									joined={joined}
									totalAttendeesList={totalAttendeesList}
								/>
								{/* <div className="flex flex-row items-center w-full justify-between mt-4"></div> */}

								<div className="flex flex-row justify-between mt-5">
									<form method="dialog">
										<button className="btn btn-standard">Close</button>{" "}
									</form>
									<form action={endSession.bind(null, attendanceCode)}>
										<button className="btn btn-dangerous">End Session</button>{" "}
									</form>
								</div>
							</div>
						</dialog>
					</div>
				</div>
				<AttendeePresenceTable
					joined={joined}
					totalAttendeesList={totalAttendeesList}
					accessories={
						<button
							className="btn btn-standard ml-2"
							onClick={() => statsDialog.current!.showModal()}
						>
							<GraphIcon size="medium" verticalAlign="middle" />
							Current Statistics
						</button>
					}
				/>
			</div>
		</div>
	);
}
