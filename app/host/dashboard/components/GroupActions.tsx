import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/utils/supabase/types";
import { TrashIcon } from "@primer/octicons-react";
import { useCallback, useContext, useEffect, useState } from "react";
import {
	deleteClass,
	deleteRowGroupMetadata,
	editRowGroupMetadata,
} from "../actions";
import GroupInfo from "./GroupInfo";
import MetadataEditor from "./MetadataEditor";
import RegisterAttendee from "./RegisterAttendee";
import { AttendeesInClassContext } from "../contexts";

export default function GroupActions({ group }: { group: Tables<"groups"> }) {
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
								await deleteClass(group.id);
							}}
						>
							<TrashIcon size="medium" />
						</button>
					</div>
				</td>
			</tr>
		</>
	);
}
