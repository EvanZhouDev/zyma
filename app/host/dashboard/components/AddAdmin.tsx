import { PersonAddIcon } from "@primer/octicons-react";
import { useRef } from "react";
import AdminTable from "./AdminTable";

export default function AddAdmin({ groupName }: { groupName: string }) {
	const modal = useRef<HTMLDialogElement>(null);
	return (
		<>
			<button
				className="btn btn-standard"
				onClick={() => {
					modal.current!.showModal();
				}}
			>
				<PersonAddIcon size="medium" verticalAlign="middle" />
				Add Admin
			</button>
			<dialog ref={modal} className="modal">
				<div className="modal-box min-w-fit">
					<form className="flex justify-stretch w-full space-x-2">
						<label className="label">
							<span className="label-text text-base">Admin Email: </span>
						</label>
						<input
							name="email"
							type="email"
							required
							className="input input-standard form-input w-fit flex-grow"
						/>
						<button className="btn btn-standard ml-3">
							<PersonAddIcon size="medium" verticalAlign="middle" />
							Add Admin
						</button>
					</form>
					<hr className="divider" />
					<h1 className="text-xl font-bold my-2">
						Admins for <b>{groupName}</b>
					</h1>
					<AdminTable />
					<div className="modal-action">
						<form method="dialog">
							<button className="btn btn-standard">Close</button>
						</form>
					</div>
				</div>
				<div className="modal-backdrop">
					<form method="dialog">
						<button>Close</button>
					</form>
				</div>
			</dialog>
		</>
	);
}
