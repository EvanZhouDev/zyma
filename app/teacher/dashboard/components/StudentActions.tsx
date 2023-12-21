import { Student } from "@/components/contexts";
import { InfoIcon, TrashIcon } from "@primer/octicons-react";
import { useRef } from "react";

export default function StudentActions({ student }: { student: Student }) {
	const modal = useRef<HTMLDialogElement>(null);
	return (
		<div className="flex">
			<button
				onClick={() => modal.current!.showModal()}
				className="ml-2 btn btn-secondary"
			>
				<InfoIcon size="medium" />
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
				<TrashIcon size="medium" />
			</button>
		</div>
	);
}
