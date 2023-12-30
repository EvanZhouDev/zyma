import { TrashIcon } from "@primer/octicons-react";
import { removeAttendee } from "../actions";
import { Attendee } from "../contexts";
import AttendeeInfo from "./AttendeeInfo";
import MetadataEditor from "./MetadataEditor";

export default function AttendeeActions({ attendee }: { attendee: Attendee }) {
	return (
		<div className="flex space-x-2">
			<AttendeeInfo attendee={attendee} />
			<MetadataEditor title="Attendee"/>
			<button
				className="btn btn-dangerous transition-none"
				onClick={async () => {
					await removeAttendee(attendee.group, attendee.id);
				}}
			>
				<TrashIcon size="medium" />
			</button>
		</div>
	);
}
