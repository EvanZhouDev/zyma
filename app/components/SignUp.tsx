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
	const usernameEmailForm = useRef<HTMLFormElement>(null);
	const [username, setUsername] = useState("");
	return (
		<>
			<form
				ref={usernameEmailForm}
				className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
			>
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
					formAction={async () => {
						nameDialog.current!.showModal();
					}}
				>
					No account? Sign Up
				</button>
			</form>
			<dialog ref={nameDialog} className="modal">
				<div className="modal-box">
					<h3 className="font-bold text-lg">Hello!</h3>
					<p className="py-4">Enter your name to continue.</p>
					<div>
						<label className="label">
							<span className="text-base label-text">Name</span>
						</label>
						<input
							type="text"
							value={username}
							onChange={(event) => {
								setUsername(event.target.value);
							}}
							name="name"
							className="w-full input input-standard mb-10"
						/>
					</div>
					<div className="modal-action">
						{/* if there is a button in form, it will close the modal */}
						<form method="dialog">
							<button className="btn btn-standard">Close</button>
							<button
								className="btn btn-standard ml-3"
								disabled={username.length === 0}
								onClick={async (event) => {
									event.preventDefault();
									nameDialog.current!.close();
									const formData = new FormData(usernameEmailForm.current!);
									formData.set("name", username);
									await signUp(formData);
								}}
							>
								Submit
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
