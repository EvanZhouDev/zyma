import { STATUS_TO_NUMBER } from "@/components/constants";
import { Tables } from "@/utils/supabase/types";
import { UploadIcon, InfoIcon } from "@primer/octicons-react";
import Papa from "papaparse";
import { useContext, useEffect, useRef, useState } from "react";
import { AttendeesInClassContext } from "../contexts";
import toast from "react-hot-toast";
import { setGroupOrder } from "../actions";

export default function ExportButton({ group }: { group: Tables<"groups"> }) {
	const exportDialog = useRef<HTMLDialogElement>(null);
	const fileInput = useRef<HTMLInputElement>(null);
	const attendees = useContext(AttendeesInClassContext);
	// useEffect(() => {
	// 	exportDialog.current!.showModal();
	// }, []);

	// ! SHOULD BE SYNCED TO DB
	const [selectedOption, setSelectedOption] = useState("alphabeticalName");
	// We use null because it may not be safe to have a mutable object
	// as a default for useState
	const [customOrder, setCustomOrder] = useState<null | string[]>(
		group.order as null | string[],
	);
	useEffect(() => {
		(async () => {
			if (customOrder) {
				await setGroupOrder(group.id, customOrder);
			}
		})();
	}, [customOrder, group.id]);
	const updateFile = (newFile: null | File = null) => {
		const file = newFile ?? fileInput.current!.files![0];
		if (file !== undefined) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const content = e.target!.result as string;
				setCustomOrder(content.split(","));
			};
			reader.readAsText(file);
		}
	};
	return (
		<>
			<dialog ref={exportDialog} className="modal">
				<div className="modal-box w-md flex flex-col">
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
										metadata.customProperties,
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
										}),
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
											const orderArray = customOrder ?? [];
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
						<div className="mt-5">
							<p className="font-bold text-xl">Custom Name Order</p>
							<div role="alert" className="alert alert-info my-5 max-w-lg">
								<InfoIcon size="medium" />
								<div>
									<ul className="list-disc pl-5">
										<li>Extra names in the CSV will be ignored.</li>
										<li>
											Names in your list not on the CSV will be put at the end,
											in alphabetical order by first name.
										</li>
									</ul>
								</div>
							</div>
							<div role="tablist" className="tabs tabs-lifted">
								<input
									type="radio"
									name="csv_type"
									role="tab"
									className="tab"
									aria-label="File"
									defaultChecked
								/>
								<div
									role="tabpanel"
									className="tab-content bg-base-100 border-base-300 rounded-box p-6"
								>
									{customOrder ? (
										<div className="my-2 max-w-md">
											A CSV has already been loaded previously. Upload a new one
											to replace the current Custom Order.
										</div>
									) : (
										<div className="my-2 max-w-md">
											Import a CSV of the order of the names you want.
										</div>
									)}

									<input
										type="file"
										className="file-input-standard w-full max-w-xs"
										accept="text/csv,text/plain"
										ref={fileInput}
										onChange={() => {
											updateFile();
										}}
										onDragEnter={(e) => {
											e.stopPropagation();
											e.preventDefault();
										}}
										onDragOver={(e) => {
											e.stopPropagation();
											e.preventDefault();
										}}
										onDrop={(e) => {
											e.stopPropagation();
											e.preventDefault();

											const dt = e.dataTransfer;
											const files = dt.files;
											updateFile(files[0]);
										}}
									/>
								</div>

								<input
									type="radio"
									name="csv_type"
									role="tab"
									className="tab"
									aria-label="Text"
								/>
								<div
									role="tabpanel"
									className="tab-content bg-base-100 border-base-300 rounded-box p-6"
								>
									{/* TODO: convert it to a list GUI */}
									<textarea
										className="textarea textarea-bordered w-full"
										placeholder="Alice,Carl,Bob"
										value={customOrder?.join(",") ?? ""}
										onChange={(e) => {
											setCustomOrder(e.target.value.split(","));
										}}
									/>
								</div>
							</div>

							<div className="my-2 opacity-75">
								For example, your CSV could look like this:{" "}
								<span className="font-mono bg-secondary !border-base-300 !border-[1px] !px-2 py-1 rounded-full">
									Alice,Bob,Carl
								</span>
							</div>
						</div>
					)}
					<form method="dialog" className="modal-action">
						<button className="btn btn-standard">Close</button>
					</form>
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
