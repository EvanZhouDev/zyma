import { TrashIcon } from "@primer/octicons-react";
import {
	deleteRowAttendeeMetadata,
	editRowAttendeeMetadata,
	removeAttendee,
} from "../actions";
import { Attendee } from "../contexts";
import AttendeeInfo from "./AttendeeInfo";
import MetadataEditor from "./MetadataEditor";
import toast from "react-hot-toast";
import { useRef } from "react";

export default function AttendeeActions({ attendee }: { attendee: Attendee }) {
	const deleteDialog = useRef<HTMLDialogElement>(null);
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
					deleteDialog.current?.showModal();
				}}
			>
				<TrashIcon size="medium" />
			</button>
			<dialog ref={deleteDialog} className="modal">
				<div className="modal-box">
					<p className="text-2xl font-bold">
						Are you sure you want to remove {attendee.username} from your class?
					</p>
					<p className="mt-2">You will need to add them again.</p>
					<div className="flex flex-row w-full justify-between">
						<form method="dialog" className="self-end">
							<button className="btn btn-standard mt-5">Close</button>
						</form>
						<button
							className="btn btn-dangerous mt-5"
							onClick={async () => {
								toast.success(`Removed ${attendee.username} from class.`);
								await removeAttendee(attendee.group, attendee.id);
							}}
						>
							Delete
						</button>
					</div>
				</div>
				<form method="dialog" className="modal-backdrop">
					<button>Close</button>
				</form>
			</dialog>
		</div>
	);
}
