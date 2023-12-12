"use client";
import Icon from "@/components/Icon";
import { useRef, useState } from "react";
import { createClass } from "../actions";
export default function NewClass() {
	const [className, setClassName] = useState("");
	const handle = async () => {
		const { data, error } = await createClass(className);
		if (error == null) {
			modal.current.close();
		}
	};
	console.log("asdf");
	const modal = useRef();
	return (
		<>
			<button
				className="btn btn-ghost"
				onClick={() => document.getElementById("my_modal_3").showModal()}
			>
				<Icon.Outlined name="User" onclick="my_modal_3.showModal()" />
				Create Class
			</button>
			<dialog ref={modal} id="my_modal_3" className="modal">
				<div className="modal-box">
					<h3 className="font-bold text-lg">Create a Class</h3>
					<p className="py-4">
						First, name your class. Afterwards, go to Mange Students and hit
						Register Students to continue.
					</p>
					<div>
						<label className="label">
							<span className="text-base label-text">Class Name</span>
						</label>
						<input
							type="text"
							name="className"
							value={className}
							onChange={(event) => {
								setClassName(event.target.value);
							}}
							className="w-full input input-bordered border-primary form-input"
						/>
					</div>
					<p className="py-4 opacity-50">
						You can rename your class at any time. To make sure the name is
						unique, it is recommended to include your period.
					</p>
					<div className="modal-action">
						<form method="dialog">
							<button className="btn">Close</button>
							<button className="btn btn-primary ml-3" formAction={handle}>
								Create Class
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
