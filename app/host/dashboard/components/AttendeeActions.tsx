import { TrashIcon } from "@primer/octicons-react";
import {
	deleteRowAttendeeMetadata,
	editRowAttendeeMetadata,
	removeAttendee,
} from "../actions";
import { Attendee } from "../contexts";
import AttendeeInfo from "./AttendeeInfo";
import MetadataEditor from "./MetadataEditor";

export default function AttendeeActions({ attendee }: { attendee: Attendee }) {
	return (
		<div className="flex space-x-2">
			<AttendeeInfo attendee={attendee} />
			<MetadataEditor
				title="Attendee"
				metadata={attendee.metadata.customProperties}
				editRow={async (key, value) => {
					await editRowAttendeeMetadata(attendee.id, key, value);
				}}
				addRow={async (key) => {
					await editRowAttendeeMetadata(attendee.id, key, "");
				}}
				deleteRow={async (key) => {
					await deleteRowAttendeeMetadata(attendee.id, key);
				}}
			/>
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
