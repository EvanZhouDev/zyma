import ClassInfo from "./ClassInfo";
export default function ClassTable({
	classes,
}: { classes: { name: string; id: number }[] }) {
	if (classes.length === 0) {
		return (
			<div role="alert" className="alert alert-warning my-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="stroke-current shrink-0 h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
					/>
				</svg>
				<span>No classes found</span>
			</div>
		);
	}
	return (
		<div className="overflow-x-auto">
			<table className="table mt-5">
				<thead>
					<tr>
						<th>Name</th>
						<th>Student Count</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{classes.map((klass) => (
						<ClassInfo klass={klass} key={klass.id} />
					))}
				</tbody>
			</table>
		</div>
	);
}
