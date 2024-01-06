import { CheckIcon, TrashIcon } from "@primer/octicons-react";
import { useState } from "react";

export default function MetadataRow({
	row,
	originalValue,
	editRow,
	deleteRow,
}: {
	row: string;
	originalValue: string;
	editRow: (key: string, value: string) => Promise<void>;
	deleteRow: (key: string) => Promise<void>;
}) {
	const [value, setValue] = useState<string>(originalValue);
	return (
		<tr>
			<td>{row}</td>
			<td className="flex flex-row">
				<input
					type="text"
					placeholder="Type here"
					onChange={(event) => {
						setValue(event.target.value);
					}}
					value={value}
					className="w-full input input-standard mr-2"
				/>
				<button
					className="btn btn-standard"
					title="Submit Changes"
					disabled={value === originalValue}
					onClick={async (event) => {
						event.preventDefault();
						await editRow(row, value);
					}}
				>
					<CheckIcon size="medium" />
				</button>
			</td>
			<td>
				<div className="flex space-x-2">
					<button
						className="btn btn-dangerous transition-none"
						onClick={async (event) => {
							event.preventDefault();
							await deleteRow(row);
						}}
					>
						<TrashIcon size="medium" />
					</button>
				</div>
			</td>
		</tr>
	);
}
