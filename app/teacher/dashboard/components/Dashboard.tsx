"use client";
import Icon from "@/components/Icon";
import { useEffect, useState } from "react";
import ClassTable from "./ClassTable";
import RegisterStudent from "./RegisterStudent";
import StudentTable from "./StudentTable";
import {
	FilterIcon,
	PlusIcon,
	PlusCircleIcon,
	SearchIcon,
	GearIcon,
} from "@primer/octicons-react";

import { Student, StudentsInClassContext } from "@/components/contexts";
import { v } from "@/utils";
import { createClient } from "@/utils/supabase/client";
import NewClass from "./NewClass";
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
		<div className="w-full h-full bg-secondary justify-around flex">
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
						className="tab-content bg-base-100 border-base-300 rounded-box p-6 h-[calc(100vh-62px)] flex flex-col"
					>
						<StudentsInClassContext.Provider value={students}>
							<div className="flex flex-row w-full justify-between mt-4 items-center">
								<h1 className="text-3xl font-bold mr-2">Select Group: </h1>{" "}
								<select className="ml-2 select input-standard mr-2 flex-grow">
									<option>BASIS DECA Club 1</option>
									<option>1A Calculus BC</option>
									<option>1A Calculus AB</option>
								</select>
								<button>
									<GearIcon
										size="medium"
										verticalAlign="middle"
										className="mr-2"
									/>
								</button>
							</div>
							<div className="flex flex-row w-full justify-between mt-4 items-center">
								<h1 className="text-2xl mr-2">Students in Selected Group</h1>{" "}
								<div>This is the group you will do attendance for.</div>
							</div>
							<div className="flex flex-row items-center w-full justify-between mt-10">
								<SearchIcon
									size="medium"
									verticalAlign="middle"
									className="mr-2"
								/>
								<input
									type="text"
									placeholder="Search Students..."
									className="input input-standard mr-2 flex-grow"
								/>
								<button className="btn btn-standard flex items-center justify-center">
									<PlusCircleIcon size="medium" verticalAlign="middle" />
									Register Students
								</button>
							</div>
							<div>
								<StudentTable />
							</div>
						</StudentsInClassContext.Provider>
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
						className="tab-content bg-base-100 border-base-300 rounded-box p-6 h-[calc(100vh-62px)]"
					>
						hi
					</div>
				</div>
			</div>
			<div className="bg-base-100 rounded-box m-3 ml-1.5 outline outline-base-300 outline-1 basis-2/5 flex flex-col justify-between items-center"></div>
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
