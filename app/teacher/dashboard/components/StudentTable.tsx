import Icon from "@/components/Icon";
import { Student, StudentsInClassContext } from "@/components/contexts";
import { useContext, useRef } from "react";

export default function StudentTable() {
	const students = useContext(StudentsInClassContext);
	return (
		<table className="table mt-5 mx-2 w-full outline outline-base-300 outline-1 text-[#24292F] rounded-lg">
			<thead>
				<tr>
					<th>Name</th>
					<th>Email</th>
					<th>Attendance History</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{students.map((student) => (
					<tr key={student.email} className="border-b-0">
						<td>
							<div className="flex items-center gap-3">
								<div>
									<div className="font-bold">
										{student.username || "Not implemented"}
									</div>
								</div>
							</div>
						</td>
						<td>{student.email}</td>
						<td>{student?.metadata?.attendence}</td>
						<th>
							<StudentActions student={student} />
						</th>
					</tr>
				))}
			</tbody>
		</table>
	);
}

function StudentActions({ student }: { student: Student }) {
	const modal = useRef<HTMLDialogElement>(null);
	return (
		<div className="flex">
			<button
				onClick={() => modal.current!.showModal()}
				className="ml-2 btn btn-secondary"
			>
				<Icon.Outlined className="w-4 h-4" name="InformationCircle" />
			</button>
			<dialog ref={modal} className="modal">
				<div className="modal-box">
					<h3 className="font-bold text-lg">
						Student Name: {student.username}
					</h3>
					<p className="py-4 mt-5">
						The Email associated with this class is {student.email}.
					</p>
					<p className="py-4 font-normal">
						Attendance: {student?.metadata?.attendence}
					</p>
					<div className="modal-action">
						<form method="dialog">
							<button className="btn">Close</button>
						</form>
					</div>
				</div>
			</dialog>
			<button className="ml-2 btn btn-secondary">
				<Icon.Outlined className="w-4 h-4" name="Trash" />
			</button>
		</div>
	);
}
