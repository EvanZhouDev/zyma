"use client";
import Icon from "@/components/Icon";
import { useEffect, useState } from "react";
import ClassTable from "./ClassTable";
import RegisterStudent from "./RegisterStudent";
import StudentTable from "./StudentTable";

import { Student, StudentsInClassContext } from "@/components/contexts";
import { v } from "@/utils";
import { createClient } from "@/utils/supabase/client";
import NewClass from "./NewClass";
import { RepoIcon } from "@primer/octicons-react";

async function getStudent(uuid: string) {
	const client = await createClient();
	return v(
		await client
			.from("students")
			.select("profiles (username, email), metadata")
			.eq("student", uuid)
	)[0];
}
export default function Dashboard({
	classes,
}: {
	classes: { name: string; id: number }[];
}) {
	const [selectedClass, setSelectedClass] = useState(0);
	const classId = classes[selectedClass]?.id;
	const className = classes[selectedClass]?.name;
	const [students, setStudents] = useState<Student[]>([]);
	useEffect(() => {
		(async () => {
			if (classId) {
				const client = await createClient();
				const students = v(
					await client
						.from("students")
						.select("profiles (username, email), metadata")
						.eq("class", classId)
				);
				setStudents(
					(students ?? []).map((x) => {
						return { ...x.profiles!, metadata: x.metadata } as Student;
					})
				);
				client
					.channel("students-in-class")
					.on(
						"postgres_changes",
						{
							event: "INSERT",
							schema: "public",
							table: "students",
							// I hope this doesn't introduce security errors
							filter: `class=eq.${classId}`,
						},
						(payload) => {
							console.log("insert", payload);
							getStudent(payload.new.student).then((student) => {
								console.assert(student.metadata === payload.new.metadata);
								setStudents((x) => [
									...x,
									{
										...student.profiles!,
										metadata: student.metadata,
									} as Student,
								]);
							});
						}
					)
					.subscribe();
			}
		})();
	}, [classId]);
	return (
		<div className="bg-secondary flex h-full w-full justify-around">
			<div className="rounded-box m-3 mr-1.5 basis-3/5">
				<div role="tablist" className="tabs tabs-lifted">
					<input
						type="radio"
						name="my_tabs_2"
						role="tab"
						className="tab h-10 !w-[15vw]"
						aria-label="Manage Students"
						defaultChecked
					/>
					<div
						role="tabpanel"
						className="tab-content bg-base-100 border-base-300 rounded-box h-[calc(100vh-62px)] p-6"
					>
						<div className="flex flex-col">
							<StudentsInClassContext.Provider value={students}>
								<div className="mt-4 flex w-full flex-row items-center justify-between">
									<h1 className="mr-2 text-3xl font-bold">Current Group: </h1>{" "}
									<select
										className="select input-standard ml-2 mr-2 flex-grow"
										value={selectedClass}
										onChange={async (event) => {
											const newClassIndex = parseInt(event.target.value);
											setSelectedClass(newClassIndex);
										}}
									>
										<option disabled defaultValue={""}>
											Pick a class...
										</option>
										{classes.map((x, i) => (
											<option value={i} key={x.id}>
												{x.name}
											</option>
										))}
									</select>
								</div>
								{classId === undefined && className === undefined ? (
									<div role="alert" className="alert alert-error my-2">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-6 w-6 shrink-0 stroke-current"
											fill="none"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
										<span>Please select a class</span>
									</div>
								) : (
									<>
										<div className="mt-10 flex w-full flex-row items-center justify-between">
											<input
												type="text"
												placeholder="Search Students..."
												className="input input-standard mr-2 flex-grow"
											/>
											<RegisterStudent classId={classId} />
										</div>
										<div>
											<StudentTable />
										</div>
									</>
								)}
							</StudentsInClassContext.Provider>
						</div>
					</div>

					<input
						type="radio"
						name="my_tabs_2"
						role="tab"
						className="tab h-10 !w-[15vw]"
						aria-label="Manage Your Classes"
					/>
					<div
						role="tabpanel"
						className="tab-content bg-base-100 border-base-300 rounded-box h-[calc(100vh-62px)] p-6"
					>
						<div className="flex flex-col">
							<StudentsInClassContext.Provider value={students}>
								<div className="mt-4 flex w-full flex-row items-center justify-between">
									<h1 className="mr-2 text-3xl font-bold">Your Groups</h1>
									<NewClass />
								</div>
								<div className="mt-4 flex w-full flex-row items-center justify-between">
									<input
										type="text"
										placeholder="Search Groups..."
										className="input input-standard mr-2 flex-grow"
									/>
								</div>
								<div>
									<ClassTable classes={classes} />
								</div>
							</StudentsInClassContext.Provider>
						</div>
					</div>
				</div>
			</div>
			<div className="bg-base-100 rounded-box outline-base-300 m-3 ml-1.5 flex basis-2/5 flex-col items-center outline outline-1">
				<a
					className={`btn-start-attendance p-3 m-2 h-[10%] w-[90%] flex items-center justify-center text-2xl font-semibold ${
						classes[0] === undefined ? " btn-disabled" : ""
					} mt-5 flex items-center justify-center`}
					href={`/teacher/attendance?classId=${classId}`}
				>
					<RepoIcon size="medium" verticalAlign="middle" className="mr-2" />
					Start Attendance
				</a>
				{classes[0] === undefined && (
					<p className="ml-10 opacity-50">
						Cannot start attendance session without a class.
					</p>
				)}
				<div className="w-full px-5">
					<h1 className="website-title !text-secondary-content !text-2xl">
						Configure Your Attendance Session:
					</h1>
					<label className="form-control my-2 w-full">
						<div className="label">
							<span className="label-text">
								Session Length (Leave empty for indefinite)
							</span>
						</div>
						<input
							type="text"
							placeholder="Length in seconds..."
							className="input input-standard w-full"
						/>
					</label>
					<label className="form-control my-2 w-full">
						<div className="label">
							<span className="label-text">
								Session Timeout (Leave empty for indefinite)
							</span>
						</div>
						<input
							type="text"
							placeholder="Timeout in seconds..."
							className="input input-standard w-full"
						/>
					</label>
					<label className="form-control my-2 flex w-full max-w-xs flex-row items-center">
						<div className="form-control">
							<label className="label cursor-pointer">
								<input
									type="checkbox"
									defaultChecked={true}
									className="checkbox checkbox-primary [--chkfg:white] rounded-md"
								/>
							</label>
						</div>
						<div className="label">
							<span className="label-text">
								Allow People Not in Class
								<br />
							</span>
						</div>
					</label>
				</div>
			</div>
		</div>
		// <div className="w-fill h-screen bg-secondary overflow-hidden">
		// 	{/* class list and management */}
		// 	{/* button to start the attendance page */}
		// 	{/* class */}
		// 	<div className="w-full flex flex-row justify-center h-full mt-[8.5vh]">
		// 		<div className=" w-[48.5%] mr-[0.5%] h-[90vh]overflow-hidden">
		// 			<div role="tablist" className="tabs tabs-lifted">
		// 				<input
		// 					type="radio"
		// 					name="my_tabs_2"
		// 					role="tab"
		// 					className="tab min-w-[15vw]"
		// 					aria-label="Manage Students"
		// 					defaultChecked
		// 				/>
		// 				<div
		// 					role="tabpanel"
		// 					className="tab-content bg-base-100 border-base-300 rounded-box p-6"
		// 				>
		// 					<StudentsInClassContext.Provider value={students}>
		// 						<div className="min-h-[calc(90vh-78px)]">
		// 							<div className="flex justify-stretch">
		// 								<select
		// 									className="select select-bordered w-full"
		// 									value={selectedClass}
		// 									onChange={async (event) => {
		// 										const newClassIndex = parseInt(event.target.value);
		// 										setSelectedClass(newClassIndex);
		// 									}}
		// 								>
		// 									<option disabled defaultValue={""}>
		// 										Pick a class...
		// 									</option>
		// 									{classes.map((x, i) => (
		// 										<option value={i} key={x.id}>
		// 											{x.name}
		// 										</option>
		// 									))}
		// 								</select>
		// 								{classId === undefined ? (
		// 									<button className="ml-2 btn btn-ghost" disabled>
		// 										<Icon.Outlined name="User" />
		// 										Register Students
		// 									</button>
		// 								) : (
		// 									<RegisterStudent classId={classId} />
		// 								)}
		// 							</div>
		// 							{classId === undefined && className === undefined ? (
		// 								<div role="alert" className="alert alert-error my-2">
		// 									<svg
		// 										xmlns="http://www.w3.org/2000/svg"
		// 										className="stroke-current shrink-0 h-6 w-6"
		// 										fill="none"
		// 										viewBox="0 0 24 24"
		// 									>
		// 										<path
		// 											strokeLinecap="round"
		// 											strokeLinejoin="round"
		// 											strokeWidth="2"
		// 											d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
		// 										/>
		// 									</svg>
		// 									<span>Please select a class</span>
		// 								</div>
		// 							) : (
		// 								<>
		// 									<h1 className="website-title pt-5 !-pt-2">
		// 										Students Registered in {className}
		// 									</h1>
		// 									<StudentTable />
		// 								</>
		// 							)}
		// 						</div>
		// 					</StudentsInClassContext.Provider>
		// 				</div>
		// 				<input
		// 					type="radio"
		// 					name="my_tabs_2"
		// 					role="tab"
		// 					className="tab min-w-[15vw]"
		// 					aria-label="Manage Classes"
		// 				/>
		// 				<div
		// 					role="tabpanel"
		// 					className="tab-content bg-base-100 border-base-300 rounded-box p-6"
		// 				>
		// 					<div className="min-h-[calc(90vh-78px)]">
		// 						<div className="flex flex-row justify-between items-center">
		// 							<h1 className="website-title">All of Your Classes: </h1>
		// 							<NewClass />
		// 						</div>

		// 						<ClassTable classes={classes} />
		// 					</div>
		// 				</div>
		// 			</div>
		// 		</div>
		// 		<div className="bg-base-100 outline outline-1 outline-[#CAC8C5] w-[48.5%] ml-[0.5%] h-[90vh] rounded-xl">
		// 			<a
		// 				className={`btn btn-shadow ml-[5%] h-[10%] w-[90%] !flex !flex-row !justify-center !items-center text-3xl mt-5 ${
		// 					classes[0] === undefined ? " btn-disabled" : ""
		// 				}`}
		// 				href={`/teacher/attendance?classId=${classId}`}
		// 			>
		// 				<Icon.Outlined className="!w-10 !h-10" name="UserGroup" />
		// 				Start Attendance
		// 			</a>
		// 			{classes[0] === undefined && (
		// 				<p className="ml-10 mt-2 opacity-50">
		// 					Cannot start attendance session without a class.
		// 				</p>
		// 			)}
		// 			<div className="ml-[5%] mt-5">
		// 				<h1 className="website-title !text-2xl !text-secondary-content">
		// 					Configure Your Attendance Session:
		// 				</h1>
		// 				<label className="form-control w-full max-w-xs my-2">
		// 					<div className="label">
		// 						<span className="label-text">
		// 							Session Length (Leave empty for indefinite)
		// 						</span>
		// 					</div>
		// 					<input
		// 						type="text"
		// 						placeholder="Type here"
		// 						className="input input-bordered w-full max-w-xs"
		// 					/>
		// 				</label>
		// 				<label className="form-control w-full max-w-xs my-2">
		// 					<div className="label">
		// 						<span className="label-text">
		// 							Session Timeout (Leave empty for indefinite)
		// 						</span>
		// 					</div>
		// 					<input
		// 						type="text"
		// 						placeholder="Type here"
		// 						className="input input-bordered w-full max-w-xs"
		// 					/>
		// 				</label>
		// 				<label className="form-control w-full max-w-xs flex flex-row items-center my-2">
		// 					<input
		// 						type="checkbox"
		// 						className="toggle"
		// 						defaultChecked={false}
		// 					/>
		// 					<div className="label">
		// 						<span className="label-text">
		// 							Allow People Not in Class
		// 							<br />
		// 						</span>
		// 					</div>
		// 				</label>
		// 			</div>
		// 		</div>
		// 	</div>
		// </div>
	);
}
