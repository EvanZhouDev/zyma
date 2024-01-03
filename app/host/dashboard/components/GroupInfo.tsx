import { Tables } from "@/utils/supabase/types";
import { InfoIcon } from "@primer/octicons-react";
import { useRef } from "react";

export default function GroupInfo({ group }: { group: Tables<"groups"> }) {
	const modal = useRef<HTMLDialogElement>(null);
	return (
		<>
			<button
				onClick={() => modal.current!.showModal()}
				className="btn btn-standard ml-2"
			>
				<InfoIcon size="medium" />
			</button>
			<dialog ref={modal} className="modal">
				<div className="modal-box">
					<h3 className="font-bold text-lg">Group Name: "{group.name}"</h3>
					<p className="py-4 mt-5">
						The ID associated with this group is {group.id}.
					</p>
					<div className="modal-action">
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
