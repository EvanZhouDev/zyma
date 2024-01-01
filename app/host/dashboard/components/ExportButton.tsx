import { STATUS_TO_NUMBER } from "@/components/constants";
import { Tables } from "@/utils/supabase/types";
import { UploadIcon } from "@primer/octicons-react";
import Papa from "papaparse";
import { useContext } from "react";
import { AttendeesInClassContext } from "../contexts";

export default function ExportButton({ group }: { group: Tables<"groups"> }) {
	const attendees = useContext(AttendeesInClassContext);
	return (
		<button
			className="btn btn-standard flex items-center justify-center"
			onClick={() => {
				const attendanceDatesSet = new Set<string>();
				const propertiesSet = new Set<string>();
				for (const { metadata } of attendees) {
					if (metadata?.attendanceHistory) {
						const attendanceHistory = metadata.attendanceHistory;
						for (const date of Object.keys(attendanceHistory)) {
							attendanceDatesSet.add(date);
						}
					}
					if (metadata?.customProperties) {
						for (const property of Object.keys(metadata.customProperties)) {
							propertiesSet.add(property);
						}
					}
				}
				// A list of unique dates that we have taken attendance on
				const attendanceDates = Array.from(attendanceDatesSet);
				const customProperties = Array.from(propertiesSet);

				// TODO: HOOK UP TO BACKEND
				const groupMetadata = Object.entries(group.metadata ?? {});

				const csv = Papa.unparse([
					...groupMetadata,
					[
						"Attendee Name",
						...customProperties,
						...attendanceDates.map((x) =>
							new Date(x).toLocaleDateString("en-US", {
								month: "2-digit",
								day: "2-digit",
							}),
						),
					],
					...attendees.map((student) => [
						student.username,
						...customProperties.map(
							(property) =>
								student.metadata?.customProperties?.[property] ?? "--",
						),
						...attendanceDates.map((date) => {
							const attendanceHistory =
								student.metadata?.attendanceHistory ?? {};

							if (
								attendanceHistory[date] &&
								attendanceHistory[date][1] === STATUS_TO_NUMBER.Present
							)
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
