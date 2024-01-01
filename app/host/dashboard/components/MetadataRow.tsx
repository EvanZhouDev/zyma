import { TrashIcon } from "@primer/octicons-react";
import { useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";

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
	const debouncedValue = useDebounce<string>(value, 500);
	useEffect(() => {
		// Do fetch here...
		// Triggers when "debouncedValue" changes
		(async () => {
			await editRow(row, debouncedValue);
		})();
	}, [debouncedValue]);
	return (
		<tr>
			<td>{row}</td>
			<td>
				<input
					type="text"
					placeholder="Type here"
					onChange={(event) => {
						setValue(event.target.value);
					}}
					value={value}
					className="input input-standard w-fit max-w-xs"
				/>
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
