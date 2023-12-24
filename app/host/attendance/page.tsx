import { ROOT_URL } from "@/components/constants";
import { v } from "@/utils";
import { getServerClientWithRedirect } from "@/utils/supabase/server";
import { AlertIcon, ZapIcon } from "@primer/octicons-react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import AttendeeCounter from "./AttendeeCounter";
import AttendeePresenceTable from "./AttendeePresenceTable";
import TimeElapsed from "./TimeElapsed";
import { endSession } from "./actions";
import { getRelativeMinuteTime } from "./utils";

export default async function Index({
	searchParams,
}: {
	searchParams: { groupId: number };
}) {
	const { client } = await getServerClientWithRedirect(
		`/host/attendance?groupId=${encodeURIComponent(searchParams.groupId)}`,
	);
	const CODE_SELECT = "groups (name), code, created_at, id";
	const existingCode = v(
		await client
			.from("codes")
			.select(CODE_SELECT)
			.eq("group", searchParams.groupId),
	);
	let data: (typeof existingCode)[0];

	if (existingCode.length === 1) {
		data = existingCode[0];
	} else {
		data = v(
			await client
				.from("codes")
				.insert([{ group: searchParams.groupId }])
				.select(CODE_SELECT),
		)[0];
	}

	const joined =
		v(
			await client
				.from("attendance")
				.select("profiles (username), attendee, status, created_at")
				.eq("code_used", data.code),
		) ?? [];
	const totalAttendees = (
		v(
			await client
				.from("attendees")
				.select("*")
				.eq("group", searchParams.groupId),
		) ?? []
	).length;

	const RTworking = true;

	return (
		<div className="w-full h-full bg-secondary justify-around flex">
			<div className="bg-base-100 rounded-xl m-3 mr-1.5 outline outline-base-300 outline-1 basis-1/2 flex flex-col justify-between items-center">
				<div className="flex justify-between items-center w-full">
					<div className="flex flex-col mt-5">
						<Image
							src="/zyma.svg"
							width={500}
							height={500}
							alt="Zyma Logo"
							className="w-[8.7vw] ml-5 mb-1"
						/>
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
				<div className="flex flex-col items-center -mt-5">
					<div className="text-3xl mb-4">Scan the code to attend.</div>
					<div className="flex items-center justify-center w-[27vw] h-[27vw]">
						<div className="absolute z-10">
							<div className="w-[27vw] h-[27vw] rounded-3xl zyma-code-bg" />
						</div>
						<div className="absolute z-20">
							<div className="w-[25vw] h-[25vw] rounded-2xl bg-base-100" />
						</div>
						<div className="absolute z-30">
							<QRCodeSVG
								value={`${ROOT_URL}/attend?code=${data.code}`}
								size={400}
								className="top-0 left-0 w-[23vw] h-[23vw]"
							/>
						</div>
					</div>
				</div>

				<div className="flex flex-col items-center">
					<div className="text-2xl mb-2">Alternatively, enter the Passcode</div>
					<div className="flex flex-row items-center">
						<div className="text-3xl font-bold">{data.code}</div>
					</div>
				</div>

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
			<div className="bg-base-100 rounded-xl m-3 ml-1.5 outline outline-base-300 outline-1 basis-1/2 flex flex-col justify-between items-center pl-5 pr-5">
				<div className="w-full">
					<div className="flex flex-row w-full justify-between mt-4">
						<h1 className="text-4xl font-bold">
							<AttendeeCounter
								attendanceCode={data.code}
								initialJoined={joined.length}
							/>
							/{totalAttendees} Attendees Present
						</h1>{" "}
						<form action={endSession.bind(null, data.id)}>
							<button className="btn btn-dangerous">End Session</button>{" "}
						</form>
					</div>
				</div>
				<AttendeePresenceTable
					initialJoined={joined}
					attendanceCode={data.code}
				/>
			</div>
		</div>
	);
}
