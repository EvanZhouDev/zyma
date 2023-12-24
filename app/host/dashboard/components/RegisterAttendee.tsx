"use client";
import { ROOT_URL } from "@/components/constants";
import { PlusIcon } from "@primer/octicons-react";
import { QRCodeSVG } from "qrcode.react";
import { useRef } from "react";
import { addAttendee } from "../actions";
import AttendeeTable from "./AttendeeTable";

export default function RegisterAttendee({ classId }: { classId: number }) {
	const myModal = useRef<HTMLDialogElement>(null);
	return (
		<>
			<button
				className="btn btn-standard flex items-center justify-center"
				onClick={() => myModal.current!.showModal()}
			>
				<PlusIcon size="medium" verticalAlign="middle" />
				Register Attendees
			</button>
			<dialog ref={myModal} className="modal">
				<div className="modal-box bg-base-100 min-w-[90vw]">
					<div className="flex w-full">
						<div className="card bg-base-100 rounded-box flex h-[75vh] w-[30vw] flex-grow flex-col place-items-center items-center justify-center">
							<div className="flex flex-col items-center">
								<div className="mb-4 text-3xl">
									Scan the code to join the Group.
								</div>
								<div className="flex h-[27vw] w-[27vw] items-center justify-center">
									<div className="absolute z-10">
										<div className="zyma-code-bg h-[27vw] w-[27vw] rounded-3xl" />
									</div>
									<div className="absolute z-20">
										<div className="bg-base-100 h-[25vw] w-[25vw] rounded-2xl" />
									</div>
									<div className="absolute z-30">
										<QRCodeSVG
											value={`${ROOT_URL}/join?group=${classId}`}
											size={400}
											className="left-0 top-0 h-[23vw] w-[23vw]"
										/>
									</div>
								</div>
							</div>
							<div className="flex flex-col items-center mt-5">
								<div className="text-2xl mb-2">
									Alternatively, enter the Group ID:
								</div>
								<div className="flex flex-row items-center">
									<div className="text-3xl font-bold">{classId}</div>
								</div>
							</div>
						</div>
						<div className="divider divider-horizontal">OR</div>
						<div className="card bg-base-100 rounded-box flex h-[75vh] w-[30vw] flex-grow place-items-center">
							<form
								className="my-10 flex justify-stretch w-full space-x-2"
								action={addAttendee.bind(null, classId)}
							>
								<label className="label">
									<span className="label-text text-base">Attendee Email: </span>
								</label>
								<input
									name="email"
									type="email"
									required
									className="input input-standard form-input w-fit flex-grow"
								/>
								<button className="btn btn-standard ml-3">
									<PlusIcon size="medium" verticalAlign="middle" />
									Add Attendee
								</button>
							</form>
							<AttendeeTable />
						</div>
					</div>
					<div className="modal-action justify-self-end">
						<form method="dialog">
							<button className="btn btn-standard">Close</button>
						</form>
					</div>
				</div>
				<form method="dialog" className="modal-backdrop">
					<button>Close</button>
				</form>
			</dialog>
		</>
	);
}
