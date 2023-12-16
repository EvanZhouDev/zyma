import Icon from "@/components/Icon";
import { v } from "@/utils";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
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
				.update({ expired: true })
				.eq("id", id)
				.select(),
		);
		return redirect("/teacher/dashboard");
	}
	const data = v(
		await client
			.from("codes")
			.upsert([{ class: searchParams.classId }])
			.select(),
	)![0];

	const joined =
		v(
			await client
				.from("attendance")
				.select("profiles (username), student, status, created_at"),
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
		<div className="w-fill h-screen bg-secondary overflow-hidden">
			{/* class list and management */}
			{/* button to start the attendance page */}
			{/* class */}
			{/* <h1 className="website-title !text-3xl">Attendance for Class 1</h1> */}
			<div className="w-full flex flex-row justify-center h-full mt-[8.5vh]">
				<div className="bg-base-100 outline outline-1 outline-[#CAC8C5] w-[48.5%] mr-[0.5%] h-[90vh] rounded-xl flex flex-col justify-around items-center">
					<div className="flex flex-col items-center">
						<p className="text-3xl mt-2 font text-primary mb-10">
							Scan code to mark attendance.
						</p>
						<QRCodeSVG
							value={`http://localhost:3000/attend?code=${data.code}`}
							size={1000}
							className="w-3/5 h-min bg-black mb-5"
						/>
					</div>

					<div className="flex flex-col items-center mb-5">
						<p className="text-l text-secondary-content">
							Alternatively, join the class with the code:
						</p>
						<h1 className="text-xl mt-3 font-bold text-primary">{data.code}</h1>
					</div>
				</div>
				<div className="bg-base-100 outline outline-1 outline-[#CAC8C5] w-[48.5%] ml-[0.5%] h-[90vh] rounded-xl">
					<div className="flex flex-row justify-between px-4 mt-4">
						<h1 className="website-title !text-5xl">Students</h1>
						<form action={handle.bind(null, data.id)}>
							<button className="btn btn-primary">End Session</button>
						</form>
					</div>
					<div className="ml-[5%] stats w-[90%] shadow my-5">
						<div className="stat">
							<div className="stat-figure text-primary">
								<Icon.Outlined className="w-10" name="UserGroup" />
							</div>
							<div className="stat-title">Count</div>
							{/* TODO */}
							<div className="stat-value text-primary">12 students</div>
							<div className="stat-desc">out of {totalStudents}</div>
						</div>

						<div className="stat">
							<div className="stat-figure text-primary">
								<Icon.Outlined className="w-10" name="Clock" />
							</div>
							<div className="stat-title">Time Elapsed</div>
							<div className="stat-value text-primary">
								<TimeElapsed
									time={data.created_at}
									getRelativeTime={getRelativeMinuteTime}
								/>
							</div>
							{/* <div className="stat-desc">Ends in 13 minutes</div> */}
						</div>
					</div>
					<div className="overflow-x-auto">
						<StudentPresenceTable joined={joined} />
					</div>
				</div>
			</div>
		</div>
	);
}
