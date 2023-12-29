import { TrashIcon } from "@primer/octicons-react";

export default function AdminTable() {
	const admins = [{ name: "admin1" }, { name: "admin2" }];
	return (
		<table className="mt-5 table">
			<thead>
				<tr>
					<th>Name</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{admins.map((user) => (
					<tr>
						<td>
							<div className="flex items-center gap-3">
								<div>
									<div className="font-bold">{user.name}</div>
								</div>
							</div>
						</td>
						<td>
							<button
								className="btn btn-dangerous ml-2 transition-none"
								onClick={async () => {}}
							>
								<TrashIcon size="medium" />
							</button>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
