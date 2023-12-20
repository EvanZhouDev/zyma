import Icon from "@/components/Icon";
import { v } from "@/utils";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useRef, useState } from "react";

type Metadata = { attendence?: [number, number] };
type Student = { email: string; username: string; metadata?: Metadata };
async function getStudent(uuid: string) {
	const client = await createClient();
	return v(
		await client
			.from("students")
			.select("profiles (username, email), metadata")
			.eq("student", uuid),
	)[0];
}
export default function StudentTable({ classId }: { classId: number }) {
	const [data, setData] = useState<Student[]>([]);
	useEffect(() => {
		(async () => {
			if (classId) {
				const client = await createClient();
				const students = v(
					await client
						.from("students")
						.select("profiles (username, email), metadata")
						.eq("class", classId),
				);
				setData(
					(students ?? []).map((x) => {
						return { ...x.profiles!, metadata: x.metadata } as Student;
					}),
				);
				client
					.channel("students-in-class")
					.on(
						"postgres_changes",
						{
							event: "INSERT",
							schema: "public",
							table: "students",
							// I hope this doesn't introduce security errors
							filter: `class=eq.${classId}`,
						},
						(payload) => {
							console.log("insert", payload);
							getStudent(payload.new.student).then((student) => {
								console.assert(student.metadata === payload.new.metadata);
								setData((x) => [
									...x,
									{
										...student.profiles!,
										metadata: student.metadata,
									} as Student,
								]);
							});
						},
					)
					.subscribe();
			}
		})();
	}, [classId]);
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
						<tr key={student.email}>
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
