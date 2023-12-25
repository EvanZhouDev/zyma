"use client";

import { useRef } from "react";

export default function SignUp({
	signUp,
	signIn,
}: {
	signUp: (formData: FormData) => Promise<void>;
	signIn: (formData: FormData) => Promise<void>;
}) {
	const nameDialog = useRef<HTMLDialogElement>(null);
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
							name="name"
							className="w-full input input-standard mb-10"
						/>
					</div>
					<button
						type="submit"
						className="btn btn-standard"
						formAction={async (formData: FormData) => {
							await signUp(formData);
							nameDialog.current!.close();
						}}
					>
						Submit
					</button>
				</div>
			</dialog>
		</>
	);
}
