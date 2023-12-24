import { StudentsInClassContext } from "@/components/contexts";
import { InfoIcon } from "@primer/octicons-react";
import { useContext } from "react";
import StudentActions from "./StudentActions";
export default function StudentTable() {
	const students = useContext(StudentsInClassContext);
	if (students.length === 0) {
		return (
			<div role="alert" className="alert alert-info mt-5">
				<InfoIcon size="medium" />
				<div>
					<p className="text-lg">No students registered.</p>
				</div>
			</div>
		);
	}
	return (
		<>
			<table className="table mt-5 w-full outline outline-base-300 outline-1 text-[#24292F] rounded-lg">
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
		</>
	);
}
