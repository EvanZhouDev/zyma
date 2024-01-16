import { Tables } from "@/utils/supabase/types";
import { TrashIcon } from "@primer/octicons-react";
import { useCallback, useContext, useRef } from "react";
import {
	deleteClass,
	deleteRowGroupMetadata,
	editRowGroupMetadata,
} from "../actions";
import GroupInfo from "./GroupInfo";
import MetadataEditor from "./MetadataEditor";
import { AttendeesInClassContext } from "../contexts";
import toast from "react-hot-toast";

export default function GroupActions({ group }: { group: Tables<"groups"> }) {
	const deleteDialog = useRef<HTMLDialogElement>(null);
	const attendeeCount = useContext(AttendeesInClassContext).length;
	const editRow = useCallback(
		async (key: string, value: string) => {
			await editRowGroupMetadata(group.id, key, value);
		},
		[group.id],
	);
	const addRow = useCallback(
		async (key: string) => {
			await editRowGroupMetadata(group.id, key, "");
		},
		[group.id],
	);
	const deleteRow = useCallback(
		async (key: string) => {
			await deleteRowGroupMetadata(group.id, key);
		},
		[group.id],
	);
	return (
		<>
			<tr>
				<td>
					<div className="flex items-center gap-3">
						<div>
							<div className="font-bold">{group.name}</div>
						</div>
					</div>
				</td>
				<td>{attendeeCount ?? "--"}</td>
				<td>
					<div className="flex space-x-2">
						<GroupInfo group={group} />
						<MetadataEditor
							title="Group"
							metadata={group.metadata as { [key: string]: string }}
							editRow={editRow}
							addRow={addRow}
							deleteRow={deleteRow}
						/>
						{/* <RegisterAttendee groupId={group.id} /> */}
						<button
							className="btn btn-dangerous transition-none"
							onClick={async () => {
								deleteDialog.current?.showModal();
								// toast.success(`Deleted class "${group.name}"`);
								// await deleteClass(group.id);
							}}
						>
							<TrashIcon size="medium" />
						</button>
						<dialog ref={deleteDialog} className="modal">
							<div className="modal-box">
								<p className="text-2xl font-bold">
									Are you sure you want to delete class "{group.name}"?
								</p>
								<p className="mt-2">This is an irreversible action.</p>
								<div className="flex flex-row w-full justify-between">
									<form method="dialog" className="self-end">
										<button className="btn btn-standard mt-5">Close</button>
									</form>
									<button
										className="btn btn-dangerous mt-5"
										onClick={async () => {
											toast.success(`Deleted class "${group.name}"`);
											await deleteClass(group.id);
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
				</td>
			</tr>
		</>
	);
}
