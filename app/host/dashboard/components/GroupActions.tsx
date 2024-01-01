import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/utils/supabase/types";
import { TrashIcon } from "@primer/octicons-react";
import { useCallback, useEffect, useState } from "react";
import {
	deleteClass,
	deleteRowGroupMetadata,
	editRowGroupMetadata,
} from "../actions";
import GroupInfo from "./GroupInfo";
import MetadataEditor from "./MetadataEditor";

export default function GroupActions({ group }: { group: Tables<"groups"> }) {
	const [attendeeCount, setAttendeeCount] = useState<number>();
	useEffect(() => {
		(async () => {
			const client = await createClient();
			const { count } = await client
				.from("attendees")
				// `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the hood.
				// `"planned"`: Approximated but fast count algorithm. Uses the Postgres statistics under the hood.
				// `"estimated"`: Uses exact count for low numbers and planned count for high numbers.
				.select("*", { head: true, count: "exact" })
				.eq("with_code", group.code);
			// If count is null, it means that there are no entires
			setAttendeeCount(count ?? 0);
		})();
	});
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
				<th>
					<div className="flex space-x-2">
						<GroupInfo group={group} />
						<MetadataEditor
							title="Group"
							metadata={group.metadata as { [key: string]: string }}
							editRow={editRow}
							addRow={addRow}
							deleteRow={deleteRow}
						/>
						<button
							className="btn btn-dangerous transition-none"
							onClick={async () => {
								await deleteClass(group.id);
							}}
						>
							<TrashIcon size="medium" />
						</button>
					</div>
				</th>
			</tr>
		</>
	);
}
