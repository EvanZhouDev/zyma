import Icon from "@/components/Icon";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
export default async function Index({
	searchParams,
}: {
	searchParams: { classId: string };
}) {
	"use server";
	// TODO: if there exists an exising code, use it
	const cookieStore = cookies();
	const client = createClient(cookieStore);
	if ((await client.auth.getUser()).data?.user?.id == null) {
		return redirect("/");
	}
	async function handle(id) {
		"use server";
		const cookieStore = cookies();
		const client = createClient(cookieStore);
		if ((await client.auth.getUser()).data?.user?.id == null) {
			return redirect("/");
		}
		const { data, error } = await client
			.from("codes")
			.update({ expired: true })
			.eq("id", id)
			.select();
		console.log("ed", data, error);
		return redirect("/teacher/dashboard");
	}
	let code;
	let codeId;
	const { data, error: __ } = await client
		.from("codes")
		.select()
		.eq("class", searchParams.classId)
		.eq("expired", false);
	// Todo: using the same code
	if (data?.length !== 1) {
		const { data, error: _ } = await client
			.from("codes")
			.insert([{ class: searchParams.classId }])
			.select();
		console.log(data, _);
		code = data![0].code;
		codeId = data![0].id;
	} else {
		code = data[0].code;
		codeId = data![0].id;
	}

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
							value={`http://localhost:3000/attend?code=${code}`}
							renderAs="svg"
							size={1000}
							className="w-3/5 h-min bg-black mb-5"
						/>
					</div>

					<div className="flex flex-col items-center mb-5">
						<p className="text-l text-secondary-content">
							Alternatively, join the class with the code:
						</p>
						<h1 className="text-xl mt-3 font-bold text-primary">{code}</h1>
					</div>
				</div>
				<div className="bg-base-100 outline outline-1 outline-[#CAC8C5] w-[48.5%] ml-[0.5%] h-[90vh] rounded-xl">
					<div className="flex flex-row justify-between px-4 mt-4">
						<h1 className="website-title !text-5xl">Students</h1>
						<form action={handle.bind(null, codeId)}>
							<button className="btn btn-primary">End Session</button>
						</form>
					</div>
					<div className="ml-[5%] stats w-[90%] shadow my-5">
						<div className="stat">
							<div className="stat-figure text-primary">
								<Icon.Outlined className="w-10" name="UserGroup" />
							</div>
							<div className="stat-title">Count</div>
							<div className="stat-value text-primary">13 students</div>
							<div className="stat-desc">out of 25</div>
						</div>

						<div className="stat">
							<div className="stat-figure text-primary">
								<Icon.Outlined className="w-10" name="Clock" />
							</div>
							<div className="stat-title">Time Elapsed</div>
							<div className="stat-value text-primary">3 minutes</div>
							<div className="stat-desc">Ends in 13 minutes</div>
						</div>
					</div>
					<div className="overflow-x-auto">
						<table className="table">
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
								{/* row 1 */}
								<tr>
									<th>1</th>
									<td>Cy Ganderton</td>
									<td>4:30</td>
									<td>Present</td>
								</tr>
								{/* row 2 */}
								<tr>
									<th>2</th>
									<td>Hart Hagerty</td>
									<td>4:31</td>
									<td>Present</td>
								</tr>
								{/* row 3 */}
								<tr>
									<th>3</th>
									<td>Brice Swyre</td>
									<td>4:32</td>
									<td>Absent</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}
