import Icon from "@/components/Icon";
import { ROOT_URL } from "@/components/constants";
import { v } from "@/utils";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import StudentCounter from "./StudentCounter";
import Image from "next/image";
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
		v(
			await client
				.from("codes")
				// XXX: Perhaps we should just delete it
				.update({ expired: true })
				.eq("id", id),
		);
		return redirect("/teacher/dashboard");
	}
	const existingCode = v(
		await client
			.from("codes")
			.select()
			.eq("class", searchParams.classId)
			.eq("expired", false),
	)!;
	let data;
	if (existingCode.length === 1) {
		data = existingCode[0];
	} else {
		data = v(
			await client
				.from("codes")
				.insert([{ class: searchParams.classId }])
				.select(),
		)![0];
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
	return (
		<div className="w-full h-full bg-secondary justify-around flex">
			<div className="bg-base-100 rounded-xl m-3 mr-1.5 outline outline-base-300 outline-1  basis-1/2 flex flex-col justify-around items-center">
				<div className="flex justify-between items-center w-full">
					<Image
						src="/zyma.svg"
						width={500}
						height={500}
						alt="Zyma Logo"
						className="w-[10vw]"
					></Image>
					<div className="text-right">
						Attendance started 1 minute ago.
						<br />
						9 minutes remaining.
					</div>
				</div>
				<div className="flex flex-col items-center">
					<div className="text-3xl mb-4">Scan the code to attend.</div>
					<div className="flex items-center justify-center w-[29vw] h-[29vw]">
						<div className="absolute z-10">
							<div className="w-[29vw] h-[29vw] rounded-3xl zyma-code-bg"></div>
						</div>
						<div className="absolute z-20">
							<div className="w-[27vw] h-[27vw] rounded-2xl bg-base-100"></div>
						</div>
						<div className="absolute z-30">
							<QRCodeSVG
								value={`${ROOT_URL}/attend?code=${data.code}`}
								size={400}
								className="w-[25vw] h-[25vw]"
							/>
						</div>
					</div>
				</div>

				<div className="flex flex-col items-center">
					<div className="text-3xl">Alternatively, enter the Passcode</div>
					<div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#E8762A] via-[#A96FB5] to-[#3597DD]">
						123456
					</div>
				</div>

				{/* <div className="absolute">
						<div className="flex justify-center">
							<div className="absolute z-10">
								<div className="w-[35vw] h-[35vw] bg-red-500 absolute top-0 left-0"></div>
							</div>
							<div className="absolute z-20">
								<div className="w-[30vw] h-[30vw] bg-red-300 absolute top-0 left-0"></div>
							</div>
							<div className="absolute z-30">
								<QRCodeSVG
									value={`http://localhost:3000/attend?code=${data.code}`}
									size={400}
									className="h-min top-0 left-0"
								/>
							</div>
						</div>
					</div> */}
			</div>
			<div className="bg-base-100 rounded-xl m-3 ml-1.5 outline outline-base-300 outline-1  basis-1/2">
				box2
			</div>
		</div>
		// <div className="w-fill h-screen bg-secondary overflow-hidden">
		// 	{/* class list and management */}
		// 	{/* button to start the attendance page */}
		// 	{/* class */}
		// 	{/* <h1 className="website-title !text-3xl">Attendance for Class 1</h1> */}
		// 	<div className="w-full flex flex-row justify-center h-full mt-[8.5vh]">
		// 		<div className="bg-base-100 outline outline-1 outline-[#CAC8C5] w-[48.5%] mr-[0.5%] h-[90vh] rounded-xl flex flex-col justify-around items-center">
		// 			<div className="flex flex-col items-center">
		// 				<p className="text-3xl mt-2 font text-primary mb-10">
		// 					Scan code to mark attendance.
		// 				</p>
		// 				<QRCodeSVG
		// 					value={`http://localhost:3000/attend?code=${data.code}`}
		// 					size={1000}
		// 					className="w-3/5 h-min bg-black mb-5"
		// 				/>
		// 			</div>

		// 			<div className="flex flex-col items-center mb-5">
		// 				<p className="text-l text-secondary-content">
		// 					Alternatively, join the class with the code:
		// 				</p>
		// 				<h1 className="text-xl mt-3 font-bold text-primary">{data.code}</h1>
		// 			</div>
		// 		</div>
		// 		<div className="bg-base-100 outline outline-1 outline-[#CAC8C5] w-[48.5%] ml-[0.5%] h-[90vh] rounded-xl">
		// 			<div className="flex flex-row justify-between px-4 mt-4">
		// 				<h1 className="website-title !text-5xl">Students</h1>
		// 				<form action={handle.bind(null, data.id)}>
		// 					<button className="btn btn-primary">End Session</button>
		// 				</form>
		// 			</div>
		// 			<div className="ml-[5%] stats w-[90%] shadow my-5">
		// 				<StudentCounter
		// 					total={totalStudents}
		// 					attendanceCode={data.code}
		// 					initialJoined={joined.length}
		// 				/>

		// 				<div className="stat">
		// 					<div className="stat-figure text-primary">
		// 						<Icon.Outlined className="w-10" name="Clock" />
		// 					</div>
		// 					<div className="stat-title">Time Elapsed</div>
		// 					<div className="stat-value text-primary">
		// 						<TimeElapsed
		// 							time={data.created_at}
		// 							getRelativeTime={getRelativeMinuteTime}
		// 						/>
		// 					</div>
		// 					{/* <div className="stat-desc">Ends in 13 minutes</div> */}
		// 				</div>
		// 			</div>
		// 			<div className="overflow-x-auto">
		// 				<StudentPresenceTable
		// 					initialJoined={joined}
		// 					attendanceCode={data.code}
		// 				/>
		// 			</div>
		// 		</div>
		// 	</div>
		// </div>
	);
}
