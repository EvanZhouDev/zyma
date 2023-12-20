import Icon from "@/components/Icon";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { deleteClass } from "../actions";

export default function ClassInfo({
	klass,
}: { klass: { name: string; id: number } }) {
	const [studentCount, setStudentCount] = useState<number>();
	useEffect(() => {
		(async () => {
			const client = await createClient();
			const { count, error } = await client
				.from("students")
				// `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the hood.
				// `"planned"`: Approximated but fast count algorithm. Uses the Postgres statistics under the hood.
				// `"estimated"`: Uses exact count for low numbers and planned count for high numbers.
				.select("*", { head: true, count: "estimated" })
				.eq("class", klass.id);
			if (error !== null) {
				console.error(error);
			}
			console.assert(count !== null, "count is null");
			setStudentCount(count!);
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
				<td>{studentCount ?? "--"}</td>
				<th>
					<div className="flex">
						<button
							className="ml-2 btn btn-secondary"
							onClick={
								() => {}
								// (
								// 	document.getElementById(
								// 		`my_modal_${klass.id}`,
								// 	) as HTMLDialogElement
								// ).showModal()
							}
						>
							<Icon.Outlined className="w-4 h-4" name="InformationCircle" />
						</button>
						{/* <dialog
            id={`my_modal_${klass.id}`}
            className="modal"
        >
            <div className="modal-box">
                <h3 className="font-bold text-lg">
                    Class Name: "{klass.name}"
                </h3>
                <p className="py-4 mt-5">
                    The ID associated with this class is {klass.id}.
                </p>
                <p className="py-4 font-normal">
                    There are 0 students in this class currently.
                </p>
                <div className="modal-action">
                    <form method="dialog">
                        <button className="btn">Close</button>
                    </form>
                </div>
            </div>
        </dialog> */}
						<button
							className="ml-2 btn btn-secondary"
							onClick={async () => {
								await deleteClass(klass.id);
								// TODO: update UI
							}}
						>
							<Icon.Outlined className="w-4 h-4" name="Trash" />
						</button>
					</div>
				</th>
			</tr>
		</>
	);
}
