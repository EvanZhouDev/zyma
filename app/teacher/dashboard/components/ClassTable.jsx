import Icon from "@/components/Icon";
import { deleteClass } from "../actions";
export default function ClassTable({ classes }) {
	return (
		<div className="overflow-x-auto">
			<table className="table mt-5">
				{/* head */}
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
										onClick={() =>
											document
												.getElementById(`my_modal_${klass.id}`)
												.showModal()
										}
									>
										<Icon.Outlined
											className="w-4 h-4"
											name="InformationCircle"
										/>
									</button>
									<dialog id={`my_modal_${klass.id}`} class="modal">
										<div class="modal-box">
											<h3 class="font-bold text-lg">
												Class Name: "{klass.name}"
											</h3>
											<p class="py-4 mt-5">
												The ID associated with this class is {klass.id}.
											</p>
											<p class="py-4 font-normal">
												There are 0 students in this class currently.
											</p>
											<div class="modal-action">
												<form method="dialog">
													<button class="btn">Close</button>
												</form>
											</div>
										</div>
									</dialog>
									<button
										className="ml-2 btn btn-secondary"
										onClick={async () => {
											await deleteClass(klass.id);
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
