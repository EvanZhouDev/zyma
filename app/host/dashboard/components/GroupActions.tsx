import { createClient } from "@/utils/supabase/client";
import { InfoIcon, TrashIcon } from "@primer/octicons-react";
import { useEffect, useState } from "react";
import { deleteClass } from "../actions";
import AddAdmin from "./AddAdmin";

export default function GroupActions({
	klass,
}: {
	klass: { name: string; id: number };
}) {
	const [attendeeCount, setAttendeeCount] = useState<number>();
	useEffect(() => {
		(async () => {
			const client = await createClient();
			const { count } = await client
				.from("attendees")
				// `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the hood.
				// `"planned"`: Approximated but fast count algorithm. Uses the Postgres statistics under the hood.
				// `"estimated"`: Uses exact count for low numbers and planned count for high numbers.
				.select("*", { head: true, count: "estimated" })
				.eq("group", klass.id);
			// If count is null, it means that there are no entires
			setAttendeeCount(count ?? 0);
		})();
	});
	return (
		<>
			<tr>
				<td>
					<div className="flex items-center gap-3">
						<div>
							<div className="font-bold">{klass.name}</div>
						</div>
					</div>
				</td>
				<td>{attendeeCount ?? "--"}</td>
				<td>
					<div className="flex space-x-2">
						<button
							className="btn btn-standard"
							onClick={
								() => {}
								// (
								// 	document.getElementById(
								// 		`my_modal_${klass.id}`,
								// 	) as HTMLDialogElement
								// ).showModal()
							}
						>
							<InfoIcon size="medium" />
						</button>
						{/* <dialog
            id={`my_modal_${klass.id}`}
            className="modal"
        >
            <div className="modal-box">
                <h3 className="font-bold text-lg">
                    Group Name: "{klass.name}"
                </h3>
                <p className="py-4 mt-5">
                    The ID associated with this group is {klass.id}.
                </p>
                <p className="py-4 font-normal">
                    There are 0 attendees in this group currently.
                </p>
                <div className="modal-action">
                    <form method="dialog">
                        <button className="btn">Close</button>
                    </form>
                </div>
            </div>
        </dialog> */}
						<button
							className="btn btn-dangerous transition-none"
							onClick={async () => {
								await deleteClass(klass.id);
							}}
						>
							<TrashIcon size="medium" />
						</button>
						<AddAdmin groupName={klass.name} />
					</div>
				</td>
			</tr>
		</>
	);
}
