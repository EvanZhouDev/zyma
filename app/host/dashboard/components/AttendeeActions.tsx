import { InfoIcon, TrashIcon } from "@primer/octicons-react";
import { useRef } from "react";
import { removeAttendee } from "../actions";
import { Attendee } from "../contexts";
import AttendeeInfo from "./AttendeeInfo";

export default function AttendeeActions({ attendee }: { attendee: Attendee }) {
	return (
		<div className="flex">
			<AttendeeInfo attendee={attendee} />
			<button
				className="btn btn-dangerous ml-2 transition-none"
				onClick={async () => {
					await removeAttendee(attendee.group, attendee.id);
				}}
			>
				<TrashIcon size="medium" />
			</button>
		</div>
	);
}
