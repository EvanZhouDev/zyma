import Icon from "@/components/Icon";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useRef } from "react";

// import { getStudentData } from "../actions";
type Metadata = { attendence?: [number, number] };
type Student = { email: string; username: string; metadata?: Metadata };
export default async function StudentTable({ classId }: { classId: number }) {
	let data: Student[] = [];
	useEffect(() => {
		(async () => {
			if (classId) {
				const client = await createClient();
				const res = await client
					.from("students")
					.select("student (username, email, metadata)")
					.eq("class", classId);
				data = (res.data ?? []).flatMap((x) => x.student);
			}
		})();
	});
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
		</div>
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
