import Logo from "@/components/Logo.jsx";
import ZymaCode from "@/components/ZymaCode";
import { ROOT_URL } from "@/components/constants";
import { v } from "@/utils";
import { getServerClientWithRedirect } from "@/utils/supabase/server";
import { AlertIcon, ZapIcon } from "@primer/octicons-react";
import Right from "./Right";
import TimeElapsed from "./TimeElapsed";
import { getRelativeMinuteTime } from "./utils";

export default async function Index({
	searchParams,
}: {
	searchParams: { groupId: number };
}) {
	const { client } = await getServerClientWithRedirect(
		`/host/attendance?groupId=${encodeURIComponent(searchParams.groupId)}`,
	);
	const CODE_SELECT = "groups (name), code, created_at";
	const existingCode = v(
		await client
			.from("codes")
			.select(CODE_SELECT)
			.eq("group", searchParams.groupId),
	);
	let data: (typeof existingCode)[0];
	//XXX: Can't I just do an UPSERT?
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
				.select("group")
				.eq("group", searchParams.groupId),
		) ?? []
	).length;

	const RTworking = true;

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
			<Right
				data={data}
				initialJoined={joined}
				totalAttendees={totalAttendees}
				searchParams={searchParams}
			/>
		</div>
	);
}
