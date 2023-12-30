"use client";
import Logo from "@/components/Logo";
import ZymaCode from "@/components/ZymaCode";
import { ROOT_URL } from "@/components/constants";
import { v } from "@/utils";
import { createClient } from "@/utils/supabase/client";
import { AlertIcon, ZapIcon } from "@primer/octicons-react";
import { useEffect, useState } from "react";
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
			.eq("attendee", uuid),
	)[0];
}
export default function Dashboard({
	data,
	initialJoined,
	totalAttendees,
}: {
	data: { groups: { name: string } | null; code: string; created_at: string };
	initialJoined: {
		profiles: { username: string } | null;
		attendee: string;
		status: number;
		created_at: string;
	}[];
	totalAttendees: number;
}) {
	const attendanceCode = data.code;
	const [joined, setJoined] = useState(initialJoined);
	const [rtStatus, setRtStatus] = useState("");
	const RTworking = rtStatus === "SUBSCRIBED";
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
							},
						);
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
						console.log(payload);
						setJoined((x) =>
							x.map((y) =>
								y.attendee === payload.new.attendee
									? { ...y, status: payload.new.status }
									: y,
							),
						);
					},
				)
				.subscribe((x) => setRtStatus(x));
		})();
	}, [attendanceCode]);

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
					url={`${ROOT_URL}/attend?code=${data.code}`}
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
					<div className="flex flex-row w-full justify-between mt-4">
						<h1 className="text-4xl font-bold">
							{joined.length}/{totalAttendees} Attendees Present
						</h1>{" "}
						<form action={endSession.bind(null, attendanceCode)}>
							<button className="btn btn-dangerous">End Session</button>{" "}
						</form>
					</div>
				</div>
				<AttendeePresenceTable joined={joined} />
			</div>
		</div>
	);
}
