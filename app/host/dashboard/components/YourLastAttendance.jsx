"use client";
import { useRef, useContext, useState } from "react";
import { AttendeesInClassContext } from "../contexts";
import { convertStatus } from "@/components/constants";

export default function YourLastAttendance() {
	const lastAttendanceDialog = useRef(null);
	const allAttendees = useContext(AttendeesInClassContext);
	const [statusFilter, setStatusFilter] = useState("All Statuses");

	const attendeesHistory = allAttendees.map(
		(x) => x.metadata.attendanceHistory,
	);
	// The last attendance anyone's joined
	const allDates = attendeesHistory
		.flatMap((attendee) => Object.keys(attendee))
		.map((date) => new Date(date));
	if (allDates.length === 0) {
		return (
			<div className="flex flex-col items-center justify-between w-full mb-5 px-5 pt-5">
				<h1 className="font-bold !text-secondary-content !text-2xl">
					Your Last Attendance
				</h1>
				<p className="text-secondary-content text-xl opacity-50">
					Take attendance to view statistics
				</p>
			</div>
		);
	}

	const now = new Date();

	// Find the closest date, could be O(1) lates when we stored
	// the last attendance date on the group metadata
	const closestDate = `${allDates
		.reduce((a, b) => {
			return Math.abs(b - now) < Math.abs(a - now) ? b : a;
		})
		.toISOString()
		.slice(0, -5)}Z`; // Remove milliseconds because we didn't store milliseconds on the database

	const lastAttendees = attendeesHistory
		.map((x) => {
			if (x[closestDate] === undefined) return undefined;
			return x[closestDate][1];
		})
		.filter((x) => x !== undefined);

	const attendeesPresent = lastAttendees.filter((x) => x === 0).length;
	const attendeesAbsent = lastAttendees.filter((x) => x !== 0).length;
	const attendeesTotal = lastAttendees.length;
	const lastAttendanceDate = new Date(closestDate);
	const shortDateFormatter = new Intl.DateTimeFormat(navigator.language);
	const longDateFormatter = new Intl.DateTimeFormat(navigator.language, {
		dateStyle: "long",
		timeStyle: "short",
	});

	const lastAttendanceDateString =
		shortDateFormatter.format(lastAttendanceDate);

	return (
		<div className="flex flex-col items-center justify-between w-full mb-5 px-5">
			<div className="flex justify-between items-center w-full mt-3">
				<div className="flex flex-col">
					<h1 className="font-bold !text-secondary-content !text-2xl">
						Your Last Attendance:
					</h1>
					<p className="text-secondary-content text-xl opacity-50">
						On {lastAttendanceDateString} for {attendeesTotal}{" "}
						{lastAttendees.length === 1 ? "attendee" : "attendees"}
					</p>
				</div>
				<button
					className="btn btn-standard"
					onClick={(e) => {
						e.preventDefault();
						lastAttendanceDialog.current.showModal();
					}}
				>
					See Full Statistics
				</button>
				<dialog ref={lastAttendanceDialog} className="modal">
					<div className="modal-box max-w-[75vw]">
						<div className="w-full flex flex-row justify-between items-center">
							<div className="flex flex-col justify-center">
								<h1 className="text-2xl font-bold">Your Last Attendance:</h1>
								<p className="text-xl opacity-50">
									On {lastAttendanceDateString} for {attendeesTotal}{" "}
									{lastAttendees.length === 1 ? "attendee" : "attendees"}
								</p>
							</div>

							<div className="stats w-[70%] overflow-hidden ml-5">
								<div className="stat">
									<div className="stat-title">Attendees Present</div>
									<div className="stat-value">{attendeesPresent}</div>
									<div className="stat-desc">
										{Math.round((attendeesPresent / attendeesTotal) * 100)}% of
										total
									</div>
								</div>

								<div className="stat">
									<div className="stat-title">Attendees Absent</div>
									<div className="stat-value">{attendeesAbsent}</div>
									<div className="stat-desc">
										{Math.round((attendeesAbsent / attendeesTotal) * 100)}% of
										total
									</div>
								</div>
								{/* 
								<div className="stat">
									<div className="stat-title">Unregistered</div>
									<div className="stat-value">1,200</div>
									<div className="stat-desc">3% of total</div>
								</div> */}
							</div>
						</div>
						<div className="flex flex-row items-center w-full justify-between mt-4">
							<label>
								<select
									className="select input-standard mr-2"
									value={statusFilter}
									onChange={(event) => {
										setStatusFilter(event.target.value);
									}}
								>
									<option defaultChecked>All Statuses</option>
									<option>Present</option>
									{/* <option>Late</option> */}
									<option>Absent</option>
								</select>
							</label>
							<input
								type="text"
								placeholder="Search Attendees..."
								className="input input-standard ml-1 flex-grow"
								onChange={() => {}}
							/>
						</div>
						<table className="table mt-5 w-full outline outline-base-200 outline-1 text-[#24292F] rounded-lg">
							<thead>
								<tr>
									<th>Name</th>
									<th>Email</th>
									<th>Attendance Time</th>
									<th>Attendance Status</th>
								</tr>
							</thead>
							<tbody>
								{allAttendees
									.filter(
										(attendee) =>
											// If status filter is "All Statuses"
											// or the corresponding filter
											statusFilter === "All Statuses" ||
											(statusFilter === "Present"
												? attendee.metadata.attendanceHistory[
														closestDate
												  ][1] === 0
												: attendee.metadata.attendanceHistory[
														closestDate
												  ][1] !== 0),
									)
									.map((attendee) => (
										<tr className="border-b-0">
											<td>
												<div className="flex items-center gap-3">
													<div>
														<div className="font-bold">{attendee.username}</div>
													</div>
												</div>
											</td>
											<td>{attendee.email}</td>
											<td>
												{longDateFormatter.format(
													new Date(
														attendee.metadata.attendanceHistory[closestDate][0],
													),
												)}
											</td>
											<td>
												{convertStatus(
													attendee.metadata.attendanceHistory[closestDate][1],
												)}
											</td>
										</tr>
									))}
							</tbody>
						</table>
						<form method="dialog" className="self-end">
							<button className="btn btn-standard mt-5">Close</button>
						</form>
					</div>
					<form method="dialog" className="modal-backdrop">
						<button>Close</button>
					</form>
				</dialog>
			</div>
			<div className="stats w-full overflow-hidden mt-5 mb-3">
				<div className="stat">
					<div className="stat-title">Attendees Present</div>
					<div className="stat-value">{attendeesPresent}</div>
					<div className="stat-desc">
						{Math.round((attendeesPresent / attendeesTotal) * 100)}% of total
					</div>
				</div>

				<div className="stat">
					<div className="stat-title">Attendees Absent</div>
					<div className="stat-value">{attendeesAbsent}</div>
					<div className="stat-desc">
						{Math.round((attendeesAbsent / attendeesTotal) * 100)}% of total
					</div>
				</div>
			</div>
		</div>
	);
}
