import { InfoIcon } from "@primer/octicons-react";
import ClassActions from "./ClassActions";

export default function ClassTable({
	groups,
}: {
	groups: { name: string; id: number }[];
}) {
	if (groups.length === 0) {
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
				className="input input-standard flex-grow mt-5"
			/>
			<table className="mt-5 table">
				<thead>
					<tr>
						<th>Name</th>
						<th>Attendee Count</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{groups.map((klass) => (
						<ClassActions klass={klass} key={klass.id} />
					))}
				</tbody>
			</table>
		</>
	);
}
