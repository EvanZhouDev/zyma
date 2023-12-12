import Icon from "@/components/Icon";
import { createClient } from "@/utils/supabase/client";
import toast from "react-hot-toast";

// import { getStudentData } from "../actions";
export default async function StudentTable({ classId }) {
	const client = createClient();
	const res = await client
		.from("students")
		.select("student (username, email)")
		.eq("class", classId);
	console.log(res);
	const data = (res.data ?? []).map((x) => {
		return { email: x.student.email, name: x.student.username };
	});
	console.log(data);
	return (
		<div className="overflow-x-auto">
			<table className="table mt-5">
				{/* head */}
				<thead>
					<tr>
						<th>Name</th>
						<th>Email</th>
						<th>Attendance History</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{data.map((student) => (
						<tr>
							<td>
								<div className="flex items-center gap-3">
									<div>
										<div className="font-bold">
											{student.name || "Not implemented"}
										</div>
									</div>
								</div>
							</td>
							<td>{student.email}</td>
							<td>{student?.attendence}</td>
							<th>
								<div className="flex">
									<button
										onClick={() =>
											document
												.getElementById(`my_modal_${student.email}`)
												.showModal()
										}
										className="ml-2 btn btn-secondary"
									>
										<Icon.Outlined
											className="w-4 h-4"
											name="InformationCircle"
										/>
									</button>
									<dialog id={`my_modal_${student.email}`} class="modal">
										<div class="modal-box">
											<h3 class="font-bold text-lg">
												Student Name: {student.name}
											</h3>
											<p class="py-4 mt-5">
												The Email associated with this class is {student.email}.
											</p>
											<p class="py-4 font-normal">
												Attendance: {student.attendance}
											</p>
											<div class="modal-action">
												<form method="dialog">
													<button class="btn">Close</button>
												</form>
											</div>
										</div>
									</dialog>
									<button className="ml-2 btn btn-secondary">
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
