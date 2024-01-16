"use client";
import ZymaCode from "@/components/ZymaCode";
import { ROOT_URL } from "@/components/constants";
import { generateCode, v } from "@/utils";
import { createClient } from "@/utils/supabase/client";
import { PersonAddIcon } from "@primer/octicons-react";
import { useEffect, useRef, useState } from "react";
import { addAttendee } from "../actions";
import AttendeeTable from "./AttendeeTable";

export default function RegisterAttendee({ groupId }: { groupId: number }) {
	const myModal = useRef<HTMLDialogElement>(null);
	const [code, setCode] = useState("");
	useEffect(() => {
		(async () => {
			const client = await createClient();
			// console.log("lol");
			const data = v(
				await client
					.from("groups")
					.update({ code: generateCode(), joinable: true })
					.eq("id", groupId)
					.select("code"),
			);
			setCode(data[0].code!);
		})();
	}, [groupId]);
	return (
		<>
			<button
				className="ml-2 btn btn-standard flex items-center justify-center"
				onClick={() => myModal.current!.showModal()}
				aria-label="Register Attendees"
			>
				<PersonAddIcon size="medium" verticalAlign="middle" />
			</button>
			<dialog ref={myModal} className="modal">
				<div className="modal-box bg-base-100 min-w-[90vw]">
					<div className="flex w-full">
						<div className="card bg-base-100 rounded-box flex h-[75vh] w-[30vw] flex-grow flex-col place-items-center items-center justify-between">
							<ZymaCode
								code={code}
								url={`${ROOT_URL}/attendee/join?code=${code}`}
							/>
						</div>
						<div className="divider divider-horizontal">OR</div>
						<div className="card bg-base-100 rounded-box flex h-[75vh] w-[30vw] flex-grow place-items-center">
							<form
								className="my-10 flex justify-stretch w-full space-x-2"
								action={addAttendee.bind(null, code)}
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
									<PersonAddIcon size="medium" verticalAlign="middle" />
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
				{/* TODO: Disable joinable */}
				<form method="dialog" className="modal-backdrop">
					<button>Close</button>
				</form>
			</dialog>
		</>
	);
}
