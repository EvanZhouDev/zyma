import ClassActions from "./ClassActions";
import { AlertIcon, InfoIcon } from "@primer/octicons-react";

export default function ClassTable({
	classes,
}: {
	classes: { name: string; id: number }[];
}) {
	if (classes.length === 0) {
		return (
			<div role="alert" className="alert alert-info mt-10">
				<InfoIcon size="medium" />
				<span className="text-lg">
					Please start by creating a Group with the button above.
				</span>
			</div>
		);
	}
	return (
		<>
			<input
				type="text"
				placeholder="Search Groups..."
				className="input input-standard mr-2 flex-grow mt-10"
			/>
			<table className="mt-5 table">
				<thead>
					<tr>
						<th>Name</th>
						<th>Student Count</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{classes.map((klass) => (
						<ClassActions klass={klass} key={klass.id} />
					))}
				</tbody>
			</table>
		</>
	);
}
