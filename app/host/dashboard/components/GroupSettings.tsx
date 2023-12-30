import { Tables } from "@/utils/supabase/types";
import { GearIcon, PlusIcon, TrashIcon } from "@primer/octicons-react";
import { useRef } from "react";

export default function GroupSettings({ group }: { group: Tables<"groups"> }) {
	const modal = useRef<HTMLDialogElement>(null);
	return (
		<>
			<button
				className="btn btn-standard"
				onClick={() => {
					modal.current?.showModal();
				}}
			>
				<GearIcon size="medium" />
			</button>
			<dialog ref={modal} className="modal">
				<div className="modal-box">
					<div className="flex w-full flex-row items-center justify-between">
						<h3 className="font-bold text-xl">Edit Group Metadata</h3>
						<button
							className="btn btn-standard flex items-center justify-center"
							onClick={async () => {
								// add to metadata
							}}
						>
							<PlusIcon size="medium" verticalAlign="middle" />
							Add Row
						</button>
					</div>

					<table className="mt-5 table">
						<thead>
							<tr>
								<th>Key</th>
								<th>Value</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody className="font-normal text-lg">
							<tr>
								<td>Advisor</td>
								<td>
									<input
										type="text"
										placeholder="Type here"
										onChange={async () => {
											// do db changes
										}}
										value={"Mrs. Smith"}
										className="input input-bordered w-fit max-w-xs"
									/>
								</td>
								<td>
									<div className="flex space-x-2">
										<button
											className="btn btn-dangerous transition-none"
											onClick={async () => {}}
										>
											<TrashIcon size="medium" />
										</button>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
					<div className="modal-action">
						<form method="dialog">
							{/* if there is a button in form, it will close the modal */}
							<button className="btn btn-standard">Close</button>
						</form>
					</div>
				</div>
				<form method="dialog" className="modal-backdrop">
					<button>close</button>
				</form>
			</dialog>
		</>
	);
}
