"use client";
import ZymaCode from "@/components/ZymaCode";
import { ROOT_URL } from "@/components/constants";
import { generateCode, v } from "@/utils";
import { createClient } from "@/utils/supabase/client";
import { PersonAddIcon, UploadIcon } from "@primer/octicons-react";
import { useEffect, useRef, useState } from "react";
import { addAttendee } from "../actions";
import AttendeeTable from "./AttendeeTable";
import Papa from "papaparse";

export default function RegisterAttendee({ groupId }: { groupId: number }) {
	const myModal = useRef<HTMLDialogElement>(null);
	const [code, setCode] = useState("");
	useEffect(() => {
		(async () => {
			const client = await createClient();
			console.log("lol");
			const data = v(
				await client
					.from("groups")
					.update({ code: generateCode(), joinable: true })
					.eq("id", groupId)
					.select("code")
			);
			setCode(data[0].code!);
		})();
	}, [groupId]);
	return (
		<>
			<button
				className="btn btn-standard flex items-center justify-center"
				onClick={() => {
					// TODO: HOOK UP TO BACKEND
					const data = {
						Student1: {
							attendanceHistory: {
								[new Date("12/29/2023 08:01").toISOString()]: [
									new Date("12/29/2023 08:02").toISOString(),
									0,
								],
								[new Date("12/30/2023 08:01").toISOString()]: [
									new Date("12/30/2023 08:02").toISOString(),
									0,
								],
							},
						},
						Student2: {
							attendanceHistory: {
								[new Date("12/29/2023 08:01").toISOString()]: [
									new Date("12/29/2023 08:05").toISOString(),
									0,
								],
								[new Date("12/30/2023 08:01").toISOString()]: [
									new Date("12/30/2023 08:10").toISOString(),
									1,
								],
								[new Date("12/31/2023 08:01").toISOString()]: [
									new Date("12/31/2023 08:10").toISOString(),
									0,
								],
							},
						},
					};

					const students = Object.keys(data);

					const attendanceDatesSet = new Set();

					for (const [student, { attendanceHistory }] of Object.entries(data)) {
						console.log(Object.keys(attendanceHistory));
						for (const date of Object.keys(attendanceHistory)) {
							attendanceDatesSet.add(date);
						}
						console.log(student, attendanceHistory);
					}

					const attendanceDates = Array.from(attendanceDatesSet);

					// TODO: HOOK UP TO BACKEND
					const advisorName = "[advisor name]";
					const dates = "Wednesday";
					const times = "4:00-5:00PM";

					const csv = Papa.unparse([
						[
							`Advisor: ${advisorName}`,
							...new Array(attendanceDates.length + 1),
						],
						[`Dates: ${dates}`, ...new Array(attendanceDates.length + 1)],
						[`Times: ${times}`, ...new Array(attendanceDates.length + 1)],
						[
							"Student Name",
							"Grade",
							...attendanceDates.map((x) =>
								new Date(x).toLocaleDateString("en-US", {
									month: "2-digit",
									day: "2-digit",
								})
							),
						],
						...students.map((student) => [
							student,
							"DO GRADE",
							...attendanceDates.map((date) => {
								const attendanceHistory = data[student].attendanceHistory;
								console.log(date, attendanceHistory[date]);
								if (attendanceHistory[date] && attendanceHistory[date][1] === 0)
									return "X";
							}),
						]),
					]);

					// Create a blob from the CSV string
					const blob = new Blob([csv], { type: "text/csv" });

					// Create a blob URL
					const url = URL.createObjectURL(blob);

					// Create a temporary `a` element
					const a = document.createElement("a");

					// Set the href to the blob URL and the download attribute to the filename
					a.href = url;
					a.download = "attendeeRecord.csv";

					// Append the `a` element to the body, click it to start the download, and then remove it
					document.body.appendChild(a);
					a.click();
					document.body.removeChild(a);
				}}
			>
				<UploadIcon size="medium" verticalAlign="middle" />
				Export Students
			</button>
			<button
				className="ml-2 btn btn-standard flex items-center justify-center"
				onClick={() => myModal.current!.showModal()}
			>
				<PersonAddIcon size="medium" verticalAlign="middle" />
			</button>
			<dialog ref={myModal} className="modal">
				<div className="modal-box bg-base-100 min-w-[90vw]">
					<div className="flex w-full">
						<div className="card bg-base-100 rounded-box flex h-[75vh] w-[30vw] flex-grow flex-col place-items-center items-center justify-between">
							<ZymaCode code={code} url={`${ROOT_URL}/join?code=${code}`} />
						</div>
						<div className="divider divider-horizontal">OR</div>
						<div className="card bg-base-100 rounded-box flex h-[75vh] w-[30vw] flex-grow place-items-center">
							<form
								className="my-10 flex justify-stretch w-full space-x-2"
								action={addAttendee.bind(null, code)}
							>
								<label className="label">
									<span className="label-text text-base">Attendee Email: </span>
								</label>
								<input
									name="email"
									type="email"
									required
									className="input input-standard form-input w-fit flex-grow"
								/>
								<button className="btn btn-standard ml-3">
									<PersonAddIcon size="medium" verticalAlign="middle" />
									Add Attendee
								</button>
							</form>
							<AttendeeTable />
						</div>
					</div>
					<div className="modal-action justify-self-end">
						<form method="dialog">
							<button className="btn btn-standard">Close</button>
						</form>
					</div>
				</div>
				{/* TODO: Disable joinable */}
				<form method="dialog" className="modal-backdrop">
					<button>Close</button>
				</form>
			</dialog>
		</>
	);
}
