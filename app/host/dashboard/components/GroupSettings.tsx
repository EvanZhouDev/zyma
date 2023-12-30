import { Tables } from "@/utils/supabase/types";
import { GearIcon } from "@primer/octicons-react";
import { useRef } from "react";

export default function GroupSettings({ group }: { group: Tables<"groups"> }) {
	const modal = useRef<HTMLDialogElement>(null);
	return (
		<>
			<button
				className="btn btn-standard"
				onClick={() => {
					modal.current?.showModal();
				}}
			>
				<GearIcon size="medium" />
			</button>
			<dialog ref={modal} className="modal">
				<div className="modal-box">
					<h3 className="font-bold text-lg">Hello!</h3>
					<p className="py-4">
						Press ESC key or click the button below to close
					</p>
					<div className="modal-action">
						<form method="dialog">
							{/* if there is a button in form, it will close the modal */}
							<button className="btn btn-standard">Close</button>
						</form>
					</div>
				</div>
				<form method="dialog" className="modal-backdrop">
					<button>close</button>
				</form>
			</dialog>
		</>
	);
}
