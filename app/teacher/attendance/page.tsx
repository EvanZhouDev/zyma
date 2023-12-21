import { ROOT_URL } from "@/components/constants";
import { v } from "@/utils";
import { createClient } from "@/utils/supabase/server";
import { AlertIcon, ZapIcon } from "@primer/octicons-react";
import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import StudentCounter from "./StudentCounter";
import StudentPresenceTable from "./StudentPresenceTable";
import TimeElapsed from "./TimeElapsed";
import { getRelativeMinuteTime } from "./utils";

export default async function Index({
	searchParams,
}: {
	searchParams: { classId: number };
}) {
	const cookieStore = cookies();
	const client = createClient(cookieStore);
	if ((await client.auth.getUser()).data?.user?.id == null) {
		return redirect("/");
	}
	// We pass it in with the .bind instead of re-using
	// the codeId in the outer scope
	// because React Server Components suck
	async function handle(id: number) {
		"use server";
		const cookieStore = cookies();
		const client = createClient(cookieStore);
		if ((await client.auth.getUser()).data?.user?.id == null) {
			return redirect("/");
		}
		v(await client.from("codes").delete().eq("id", id));
		return redirect("/teacher/dashboard");
	}

	const CODE_SELECT = "classes (name), code, created_at, id";
	const existingCode = v(
		await client
			.from("codes")
			.select(CODE_SELECT)
			.eq("class", searchParams.classId),
	);
	let data: (typeof existingCode)[0];

	if (existingCode.length === 1) {
		data = existingCode[0];
	} else {
		data = v(
			await client
				.from("codes")
				.insert([{ class: searchParams.classId }])
				.select(CODE_SELECT),
		)[0];
	}

	const joined =
		v(
			await client
				.from("attendance")
				.select("profiles (username), student, status, created_at")
				.eq("code_used", data.code),
		) ?? [];
	const totalStudents = (
		v(
			await client
				.from("students")
				.select("*")
				.eq("class", searchParams.classId),
		) ?? []
	).length;

	const RTworking = true;

	return (
		<div className="w-full h-full bg-secondary justify-around flex">
			<div className="bg-base-100 rounded-xl m-3 mr-1.5 outline outline-base-300 outline-1 basis-1/2 flex flex-col justify-between items-center">
				<div className="flex justify-between items-center w-full">
					<div>
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
						<b className="text-xl">{data.classes!.name}</b>
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
							<StudentCounter
								attendanceCode={data.code}
								initialJoined={joined.length}
							/>
							/{totalStudents} Students Present
						</h1>{" "}
						<form action={handle.bind(null, data.id)}>
							<button className="btn btn-dangerous">End Session</button>{" "}
						</form>
					</div>
				</div>
				<StudentPresenceTable
					initialJoined={joined}
					attendanceCode={data.code}
				/>
			</div>
		</div>
	);
}
