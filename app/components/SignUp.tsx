"use client";

import { useRef, useState } from "react";

export default function SignUp({
	signUp,
	signIn,
}: {
	signUp: (formData: FormData) => Promise<void>;
	signIn: (formData: FormData) => Promise<void>;
}) {
	const nameDialog = useRef<HTMLDialogElement>(null);

	const [role, setRole] = useState("HOST");

	return (
		<>
			<form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
				<div className="w-full">
					<label className="label">
						<span className="text-base label-text">Email</span>
					</label>
					<input
						required
						type="email"
						name="email"
						className="w-full input input-standard form-input"
					/>
				</div>
				<div className="w-full">
					<label className="label">
						<span className="text-base label-text">Password</span>
					</label>
					<input
						required
						type="password"
						name="password"
						className="w-full input input-standard form-input"
					/>
				</div>
				<button
					className="btn btn-standard !rounded-lg mt-5"
					formAction={signIn}
				>
					Sign In
				</button>
				<button
					className="underline opacity-50 text-lg mt-10 text-secondary-content"
					onClick={async (event) => {
						nameDialog.current!.showModal();
						event.preventDefault();
					}}
				>
					No account? Sign Up
				</button>
			</form>
			<dialog ref={nameDialog} className="modal">
				<form
					action={async (formData) => {
						await signUp(formData);
						nameDialog.current!.close();
					}}
				>
					<div className="modal-box">
						<h3 className="font-bold text-lg">Zyma Sign Up</h3>
						<p className="py-4">
							We need a little bit of information before we can start taking
							attendance.
						</p>
						<label>
							<div className="label">
								<span className="text-base label-text">Name</span>
							</div>
							<input
								type="text"
								name="name"
								required
								className="w-full input input-standard mb-5"
							/>
						</label>
						<label>
							<div className="label">
								<span className="text-base label-text">Email</span>
							</div>
							<input
								type="email"
								name="email"
								required
								className="w-full input input-standard mb-5"
							/>
						</label>
						<label>
							<div className="label">
								<span className="text-base label-text">Password</span>
							</div>
							<input
								type="password"
								name="password"
								required
								className="w-full input input-standard mb-5"
							/>
						</label>

						<label>
							<div className="label">
								<span className="text-base label-text">Who are You?</span>
							</div>
							<select
								className="select input-standard w-full"
								name="role"
								value={role}
								onChange={(e) => setRole(e.target.value)}
							>
								<option value="ATTENDEE">Attendee</option>
								<option value="HOST">Host</option>
							</select>
						</label>

						{role === "HOST" ? (
							<p className="mt-2">
								<b>Hosts create Groups to track attendance.</b>
								<br />
								Be aware that hosts are <b>unable</b> to attend groups.
							</p>
						) : (
							<p className="mt-2">
								<b>Guest accounts join Groups.</b>
								<br />
								Be aware that attendees are <b>unable</b> to host groups.
							</p>
						)}

						<div className="modal-action">
							<button type="submit" className="btn btn-standard">
								Sign Up
							</button>
						</div>
					</div>
				</form>
				<form method="dialog" className="modal-backdrop">
					<button>close</button>
				</form>
			</dialog>
		</>
	);
}
