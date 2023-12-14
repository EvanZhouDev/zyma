import Icon from "@/components/Icon";
import { deleteClass } from "../actions";
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
						<tr key={klass.id}>
							<td>
								<div className="flex items-center gap-3">
									<div>
										<div className="font-bold">{klass.name}</div>
									</div>
								</div>
							</td>
							<td>10/13</td>
							<th>
								<div className="flex">
									<button
										className="ml-2 btn btn-secondary"
										onClick={
											() => {}
											// (
											// 	document.getElementById(
											// 		`my_modal_${klass.id}`,
											// 	) as HTMLDialogElement
											// ).showModal()
										}
									>
										<Icon.Outlined
											className="w-4 h-4"
											name="InformationCircle"
										/>
									</button>
									{/* <dialog
										id={`my_modal_${klass.id}`}
										className="modal"
									>
										<div className="modal-box">
											<h3 className="font-bold text-lg">
												Class Name: "{klass.name}"
											</h3>
											<p className="py-4 mt-5">
												The ID associated with this class is {klass.id}.
											</p>
											<p className="py-4 font-normal">
												There are 0 students in this class currently.
											</p>
											<div className="modal-action">
												<form method="dialog">
													<button className="btn">Close</button>
												</form>
											</div>
										</div>
									</dialog> */}
									<button
										className="ml-2 btn btn-secondary"
										onClick={async () => {
											await deleteClass(klass.id);
											// TODO: update UI
										}}
									>
										<Icon.Outlined className="w-4 h-4" name="Trash" />
									</button>
								</div>
							</th>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
