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

	const [role, setRole] = useState("host");

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
					onSubmit={async (event) => {
						event.preventDefault();
						const formData = new FormData(event.currentTarget);
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
						<div>
							<label className="label">
								<span className="text-base label-text">Name</span>
							</label>
							<input
								type="text"
								name="name"
								required
								className="w-full input input-standard mb-5"
							/>
						</div>
						<div>
							<label className="label">
								<span className="text-base label-text">Email</span>
							</label>
							<input
								type="email"
								name="email"
								required
								className="w-full input input-standard mb-5"
							/>
						</div>
						<div>
							<label className="label">
								<span className="text-base label-text">Password</span>
							</label>
							<input
								type="password"
								name="password"
								required
								className="w-full input input-standard mb-5"
							/>
						</div>
						<div className="h-min">
							<label className="label">
								<span className="text-base label-text">Who are You?</span>
							</label>
							<select
								className="select input-standard w-full"
								name="role"
								value={role}
								onChange={(e) => setRole(e.target.value)}
							>
								<option value="host">Host</option>
								<option value="attendee">Attendee</option>
							</select>

							{role === "host" && (
								<div className="ml-1 mt-2 mb-10">
									Hosts cannot join Groups or Attend.
									<br />
									<b>You will not be able to change your role later.</b>
								</div>
							)}

							{role === "attendee" && (
								<div className="ml-1 mt-2 mb-10">
									Attendees cannot host Sessions.
									<br />
									<b>You will not be able to change your role later.</b>
								</div>
							)}
						</div>

						<button type="submit" className="btn btn-standard">
							Sign Up
						</button>
					</div>
				</form>
			</dialog>
		</>
	);
}
