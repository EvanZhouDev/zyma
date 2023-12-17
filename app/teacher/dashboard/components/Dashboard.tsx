"use client";
import Icon from "@/components/Icon";
import { useState } from "react";
import ClassTable from "./ClassTable";
import RegisterStudent from "./RegisterStudent";
import StudentTable from "./StudentTable";

// import { createClass, getStudentData } from "../actions";
import NewClass from "./NewClass";
export default function Dashboard({
	classes,
}: { classes: { name: string; id: number }[] }) {
	const [selectedClass, setSelectedClass] = useState(0);
	const classId = classes[selectedClass]?.id;
	const className = classes[selectedClass]?.name;
	return (
		<div className="w-fill h-screen bg-secondary overflow-hidden">
			{/* class list and management */}
			{/* button to start the attendance page */}
			{/* class */}
			<div className="w-full flex flex-row justify-center h-full mt-[8.5vh]">
				<div className=" w-[48.5%] mr-[0.5%] h-[90vh]overflow-hidden">
					<div role="tablist" className="tabs tabs-lifted">
						<input
							type="radio"
							name="my_tabs_2"
							role="tab"
							className="tab min-w-[15vw]"
							aria-label="Manage Students"
							defaultChecked
						/>
						<div
							role="tabpanel"
							className="tab-content bg-base-100 border-base-300 rounded-box p-6"
						>
							<div className="min-h-[calc(90vh-78px)]">
								<div className="flex justify-stretch">
									<select
										className="select select-bordered w-full"
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
									<RegisterStudent classId={classId} />
								</div>
								{classId === undefined && className === undefined ? (
									<div role="alert" className="alert alert-error my-2">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="stroke-current shrink-0 h-6 w-6"
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
										<h1 className="website-title pt-5 !-pt-2">
											Students Registered in {className}
										</h1>
										<StudentTable classId={classId} />
									</>
								)}
							</div>
						</div>
						<input
							type="radio"
							name="my_tabs_2"
							role="tab"
							className="tab min-w-[15vw]"
							aria-label="Manage Classes"
						/>
						<div
							role="tabpanel"
							className="tab-content bg-base-100 border-base-300 rounded-box p-6"
						>
							<div className="min-h-[calc(90vh-78px)]">
								<div className="flex flex-row justify-between items-center">
									<h1 className="website-title">All of Your Classes: </h1>
									<NewClass />
								</div>

								<ClassTable classes={classes} />
							</div>
						</div>
					</div>
				</div>
				<div className="bg-base-100 outline outline-1 outline-[#CAC8C5] w-[48.5%] ml-[0.5%] h-[90vh] rounded-xl">
					<a
						className={`btn btn-shadow ml-[5%] h-[10%] w-[90%] !flex !flex-row !justify-center !items-center text-3xl mt-5 ${
							classes[0] === undefined ? " btn-disabled" : ""
						}`}
						href={`/teacher/attendance?classId=${classId}`}
					>
						<Icon.Outlined className="!w-10 !h-10" name="UserGroup" />
						Start Attendance
					</a>
					{classes[0] === undefined && (
						<p className="ml-10 mt-2 opacity-50">
							Cannot start attendance session without a class.
						</p>
					)}
					<div className="ml-[5%] mt-5">
						<h1 className="website-title !text-2xl !text-secondary-content">
							Configure Your Attendance Session:
						</h1>
						<label className="form-control w-full max-w-xs my-2">
							<div className="label">
								<span className="label-text">
									Session Length (Leave empty for indefinite)
								</span>
							</div>
							<input
								type="text"
								placeholder="Type here"
								className="input input-bordered w-full max-w-xs"
							/>
						</label>
						<label className="form-control w-full max-w-xs my-2">
							<div className="label">
								<span className="label-text">
									Session Timeout (Leave empty for indefinite)
								</span>
							</div>
							<input
								type="text"
								placeholder="Type here"
								className="input input-bordered w-full max-w-xs"
							/>
						</label>
						<label className="form-control w-full max-w-xs flex flex-row items-center my-2">
							<input
								type="checkbox"
								className="toggle"
								defaultChecked={false}
							/>
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
		</div>
	);
}
