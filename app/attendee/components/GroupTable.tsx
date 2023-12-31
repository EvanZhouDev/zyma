import { removeAttendee } from "@/app/host/dashboard/actions";
import { Tables } from "@/utils/supabase/types";
import { InfoIcon, TrashIcon } from "@primer/octicons-react";

export default function GroupTable({
	groups,
	attendeeId,
}: { groups: Tables<"groups">[]; attendeeId: string }) {
	return (
		<table className="table">
			<thead>
				<tr>
					<th>Group Name</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{groups.map((group) => (
					<tr key={group.id}>
						<td>
							<div className="flex items-center gap-3">
								<div>
									<div className="font-bold">{group.name}</div>
								</div>
							</div>
						</td>
						<th>
							<div className="flex">
								{/* TODO: Attendee group info */}
								{/* <button className="btn btn-standard ml-2" onClick={() => {}}>
									<InfoIcon size="medium" />
								</button> */}
								<button
									className="btn btn-dangerous ml-2 transition-none"
									onClick={async () => {
										await removeAttendee(group.id, attendeeId);
									}}
								>
									<TrashIcon size="medium" />
								</button>
							</div>
						</th>
					</tr>
				))}
			</tbody>
		</table>
	);
}
