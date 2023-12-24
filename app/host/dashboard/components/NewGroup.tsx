"use client";
import { PlusIcon } from "@primer/octicons-react";
import { useRef, useState } from "react";
import { createClass } from "../actions";
export default function NewGroup() {
	const [className, setClassName] = useState<string>("");
	const handle = async () => {
		const { error } = await createClass(className);
		if (error == null) {
			modal.current!.close();
		} else {
			console.error(error);
		}
	};
	const modal = useRef<HTMLDialogElement>(null);
	return (
		<>
			<button
				className="btn btn-standard flex items-center justify-center"
				onClick={() => modal.current!.showModal()}
			>
				<PlusIcon size="medium" verticalAlign="middle" />
				Add Group
			</button>
			<dialog ref={modal} id="my_modal_3" className="modal">
				<div className="modal-box">
					<h3 className="text-lg font-bold">Create a Group</h3>
					<p className="py-4">
						First, name your group. Afterwards, go to Mange Attendees and hit
						Register Attendees to continue.
					</p>
					<div>
						<label className="label">
							<span className="label-text text-base">Group Name</span>
						</label>
						<input
							type="text"
							name="className"
							required
							value={className}
							onChange={(event) => {
								setClassName(event.target.value);
							}}
							className="input input-standard w-full"
							placeholder="Group name..."
						/>
					</div>
					<p className="py-4 opacity-50">
						You can rename your group at any time.
					</p>
					<div className="modal-action">
						<form method="dialog">
							<button className="btn btn-standard">Close</button>
							<button
								className="btn btn-standard ml-3"
								formAction={handle}
								disabled={className.trim().length === 0}
							>
								Create Group
							</button>
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