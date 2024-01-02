import { useRef, useState } from "react";

import { GearIcon, PlusIcon } from "@primer/octicons-react";
import MetadataRow from "./MetadataRow";

export default function MetadataEditor({
	title,
	metadata,
	editRow,
	addRow,
	deleteRow,
}: {
	title: string;
	metadata: { [key: string]: string };
	editRow: (key: string, value: string) => Promise<void>;
	addRow: (key: string) => Promise<void>;
	deleteRow: (key: string) => Promise<void>;
}) {
	const modal = useRef<HTMLDialogElement>(null);
	const [newKey, setNewKey] = useState<string>("");
	return (
		<>
			<button
				className="btn btn-standard"
				onClick={() => {
					modal.current!.showModal();
				}}
			>
				<GearIcon size="medium" />
			</button>
			<dialog ref={modal} className="modal">
				<div className="modal-box">
					<div className="flex w-full flex-row items-center justify-between">
						<h3 className="font-bold text-xl">Edit {title} Metadata</h3>
					</div>
					<div className="flex w-full flex-row items-center justify-between mt-2 mb-2">
						<p className="opacity-50">
							You will not be able to rename the key of your property later. If
							you need to, recreate the row with a new key.
						</p>
					</div>
					<div className="flex w-full flex-row items-center justify-between">
						<input
							type="text"
							placeholder="Key..."
							value={newKey}
							onChange={(event) => {
								setNewKey(event.target.value);
							}}
							className="input input-standard font-normal flex-grow mr-2"
						/>
						<button
							className="btn btn-standard flex items-center justify-center"
							disabled={newKey.length === 0}
							onClick={async () => {
								await addRow(newKey);
								setNewKey("");
							}}
							aria-label="Add Row with Key"
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
							{Object.entries(metadata).map(([row, value]) => (
								<MetadataRow
									key={row}
									row={row}
									originalValue={value}
									editRow={editRow}
									deleteRow={deleteRow}
								/>
							))}
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
