import { STATUS_TO_NUMBER } from "@/components/constants";
import { Tables } from "@/utils/supabase/types";
import { UploadIcon, InfoIcon } from "@primer/octicons-react";
import Papa from "papaparse";
import { useContext, useEffect, useRef, useState } from "react";
import { AttendeesInClassContext } from "../contexts";
import toast from "react-hot-toast";

export default function ExportButton({ group }: { group: Tables<"groups"> }) {
	const exportDialog = useRef<HTMLDialogElement>(null);
	const attendees = useContext(AttendeesInClassContext);
	useEffect(() => {
		exportDialog.current!.showModal();
	}, []);

	// ! SHOULD BE SYNCED TO DB
	const [selectedOption, setSelectedOption] = useState("alphabeticalName");
	const [customOrder, setCustomOrder] = useState(null);

	return (
		<>
			<dialog ref={exportDialog} className="modal">
				<div className="modal-box max-w-[40vw] flex flex-col">
					<button
						className={`btn btn-standard flex items-center justify-center mb-5 ${
							selectedOption === "custom" &&
							customOrder === null &&
							"btn-disabled"
						}`}
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
									for (const property of Object.keys(
										metadata.customProperties
									)) {
										propertiesSet.add(property);
									}
								}
							}
							// A list of unique dates that we have taken attendance on
							const attendanceDates = Array.from(attendanceDatesSet);
							const customProperties = Array.from(propertiesSet);

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
										})
									),
								],
								...attendees
									.sort((a, b) => {
										if (selectedOption === "alphabeticalName") {
											return a.username.localeCompare(b.username);
										}
										if (selectedOption === "alphabeticalEmail") {
											return a.email.localeCompare(b.email);
										}
										if (selectedOption === "custom") {
											const orderArray = customOrder;
											const indexA = orderArray.indexOf(a.username);
											const indexB = orderArray.indexOf(b.username);

											if (indexA === -1) return 1; // send to end if not found in orderArray
											if (indexB === -1) return -1; // send to end if not found in orderArray

											return indexA - indexB;
										}

										return 0;
									})
									.map((student) => [
										student.username,
										...customProperties.map(
											(property) =>
												student.metadata?.customProperties?.[property] ?? "--"
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
						Export Attendees
					</button>
					<p className="font-bold text-xl mb-2">Order Names By: </p>
					<select
						className="select input-standard flex-grow"
						onChange={(e) => setSelectedOption(e.target.value)}
						value={selectedOption}
					>
						<option value="alphabeticalName">Alphabetical (By Name)</option>
						<option value="alphabeticalEmail">Alphabetical (By Email)</option>
						<option value="custom">Custom Order</option>
					</select>
					{selectedOption === "custom" && (
						<div className="my-5">
							<p className="font-bold text-xl">Custom Name Order</p>
							<div role="alert" className="alert alert-info my-5">
								<InfoIcon size="medium" />
								<div>
									<ul className="!list-disc pl-5">
										<li>Extra names in the CSV will be ignored.</li>
										<li>
											Names in your list not on the CSV will be put at the end,
											in alphabetical order by first name.
										</li>
									</ul>
								</div>
							</div>
							{customOrder ? (
								<div className="my-2">
									A CSV has already been loaded previously. Upload a new one to
									replace the current Custom Order.
								</div>
							) : (
								<div className="my-2">
									Import a CSV of the order of the names you want.
								</div>
							)}

							<input
								type="file"
								className="file-input-standard w-full max-w-xs"
								onChange={(event) => {
									const file = event.target.files[0];
									if (file.name.split(".").at(-1) === "csv") {
										if (file) {
											const reader = new FileReader();
											reader.onload = (e) => {
												const content = e.target.result;
												setCustomOrder(content.split(","));
											};
											reader.readAsText(file);
										}
									} else {
										alert("Please input a CSV.");
										event.target.value = "";
									}
								}}
							/>
							<div className="my-2 opacity-75">
								For example, your CSV could look like this:{" "}
								<span className="font-mono bg-secondary !border-base-300 !border-[1px] !px-2 py-1 rounded-full">
									Alice,Bob,Carl
								</span>
							</div>
						</div>
					)}
				</div>
				<form method="dialog" className="modal-backdrop">
					<button>Close</button>
				</form>
			</dialog>
			<button
				className="btn btn-standard flex items-center justify-center"
				onClick={() => {
					exportDialog.current!.showModal();
				}}
			>
				<UploadIcon size="medium" verticalAlign="middle" />
				Export Data
			</button>
		</>
	);
}
