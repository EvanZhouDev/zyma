"use client";
import Icon from "@/components/Icon";
import { QRCodeSVG } from "qrcode.react";
import { useRef } from "react";
import { addStudent } from "../actions";
import StudentTable from "./StudentTable";
import { ROOT_URL } from "@/components/constants";

export default function RegisterStudent({ classId }: { classId: number }) {
	const myModal = useRef<HTMLDialogElement>(null);
	return (
		<>
			<button
				className="ml-2 btn btn-ghost"
				onClick={() => myModal.current!.showModal()}
			>
				<Icon.Outlined name="User" />
				Register Students
			</button>
			<dialog ref={myModal} className="modal">
				<div className="modal-box bg-secondary min-w-[90vw]">
					<div className="flex w-full">
						<div className="flex h-[75vh] w-[30vw] flex-grow card bg-neutral rounded-box place-items-center flex-col items-center justify-center">
							<p className="text-3xl mt-2 font text-primary mb-10">
								Scan code to join the class.
							</p>
							<QRCodeSVG
								value={`${ROOT_URL}/join?class=${classId}`}
								size={1000}
								className="w-3/5 h-min bg-black mb-5"
							/>
							<div className="flex flex-col items-center opacity-50 mb-5 text-center text-lg px-10">
								For a fast and easy setup, have students scan your code to link
								them to your class.
							</div>
						</div>
						<div className="divider divider-horizontal">OR</div>
						<div className="flex h-[75vh] w-[30vw] flex-grow card bg-neutral rounded-box place-items-center">
							<form
								className="flex justify-stretch w-full items-center p-10"
								action={addStudent.bind(null, classId)}
							>
								<label className="label">
									<span className="text-base label-text">Student Email: </span>
								</label>
								<input
									name="email"
									type="email"
									required
									className="w-full input input-bordered border-primary form-input"
								/>
								<button className="btn ml-3 btn-filled">Add Student</button>
							</form>
							<StudentTable classId={classId} />
						</div>
					</div>
					<div className="modal-action">
						<form method="dialog">
							<button className="btn btn-ghost">Close</button>
						</form>
					</div>
				</div>
			</dialog>
		</>
	);
}
