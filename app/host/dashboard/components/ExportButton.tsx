import Papa from "papaparse";
import { UploadIcon } from "@primer/octicons-react";

export default function ExportButton() {
	return (
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
					[`Advisor: ${advisorName}`, ...new Array(attendanceDates.length + 1)],
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
	);
}
