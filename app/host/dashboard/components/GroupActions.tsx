import { createClient } from "@/utils/supabase/client";
import { InfoIcon, TrashIcon } from "@primer/octicons-react";
import { useEffect, useState } from "react";
import { deleteClass } from "../actions";

export default function GroupActions({
	klass,
}: {
	klass: { name: string; id: number };
}) {
	const [attendeeCount, setAttendeeCount] = useState<number>();
	useEffect(() => {
		(async () => {
			const client = await createClient();
			const { count, error } = await client
				.from("attendees")
				// `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the hood.
				// `"planned"`: Approximated but fast count algorithm. Uses the Postgres statistics under the hood.
				// `"estimated"`: Uses exact count for low numbers and planned count for high numbers.
				.select("*", { head: true, count: "estimated" })
				.eq("group", klass.id);
			if (error !== null) {
				console.error(error);
			}
			console.assert(count !== null, "count is null");
			setAttendeeCount(count!);
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
				<th>
					<div className="flex">
						<button
							className="btn btn-standard ml-2"
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
							className="btn btn-dangerous ml-2 transition-none"
							onClick={async () => {
								await deleteClass(klass.id);
								// TODO: update UI
							}}
						>
							<TrashIcon size="medium" />
						</button>
					</div>
				</th>
			</tr>
		</>
	);
}
