import { InfoIcon } from "@primer/octicons-react";
import { useContext } from "react";
import { AttendeesInClassContext } from "../contexts";
import AttendeeActions from "./AttendeeActions";
import { getLatestDate, toISOStringWithoutMilliseconds } from "@/utils";
import { convertStatus } from "@/components/constants";
export default function AttendeeTable() {
	const attendees = useContext(AttendeesInClassContext);
	if (attendees.length === 0) {
		return (
			<div role="alert" className="alert alert-info mt-5">
				<InfoIcon size="medium" />
				<div>
					<p className="text-lg">No attendees registered.</p>
				</div>
			</div>
		);
	}
	return (
		<>
			<table className="table mt-5 w-full outline outline-base-200 outline-1 text-[#24292F] rounded-lg">
				<thead>
					<tr>
						<th>Name</th>
						<th>Email</th>
						<th>Last Attendance Status</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{attendees.map((attendee) => (
						<tr key={attendee.email} className="border-b-0">
							<td>
								<div className="flex items-center gap-3">
									<div>
										<div className="font-bold">
											{attendee.username || "Not implemented"}
										</div>
									</div>
								</div>
							</td>
							<td>{attendee.email}</td>
							<td>
								{attendee?.metadata?.attendanceHistory !== null &&
								Object.keys(attendee.metadata.attendanceHistory).length > 0
									? convertStatus(
											attendee.metadata.attendanceHistory[
												toISOStringWithoutMilliseconds(
													getLatestDate(
														Object.keys(
															attendee.metadata.attendanceHistory,
														).map((x) => new Date(x)),
													),
												)
											][1],
									  )
									: "N/A"}
							</td>
							<td>
								<AttendeeActions attendee={attendee} />
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</>
	);
}
