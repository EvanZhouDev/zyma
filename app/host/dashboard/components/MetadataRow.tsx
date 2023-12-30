import { TrashIcon } from "@primer/octicons-react";
import { useState } from "react";

export default function MetadataRow({
	key,
	originalValue,
	editRow,
	deleteRow,
}: {
	key: string;
	originalValue: string;
	editRow: (key: string, value: string) => Promise<void>;
	deleteRow: (key: string) => Promise<void>;
}) {
	const [value, setValue] = useState<string>(originalValue);
	return (
		<tr>
			<td>{key}</td>
			<td>
				<input
					type="text"
					placeholder="Type here"
					onChange={(event) => {
						setValue(event.target.value);
					}}
					onInput={async () => {
						await editRow(key, value);
					}}
					value={value}
					className="input input-standard w-fit max-w-xs"
				/>
			</td>
			<td>
				<div className="flex space-x-2">
					<button
						className="btn btn-dangerous transition-none"
						onClick={async () => {
							await deleteRow(key);
						}}
					>
						<TrashIcon size="medium" />
					</button>
				</div>
			</td>
		</tr>
	);
}
