"use client";

import { useRef } from "react";

export default function SignUp({
	signUp,
	signIn,
	searchParams,
}: {
	signUp: (formData: FormData) => Promise<void>;
	signIn: (formData: FormData) => Promise<void>;
	searchParams: { message: string };
}) {
	const nameDialog = useRef<HTMLDialogElement>(null);
	return (
		<form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
			<div>
				<label className="label">
					<span className="text-base label-text">Email</span>
				</label>
				<input
					type="email"
					name="email"
					className="w-full input input-bordered border-primary form-input"
				/>
			</div>
			<div>
				<label className="label">
					<span className="text-base label-text">Password</span>
				</label>
				<input
					type="password"
					name="password"
					className="w-full input input-bordered border-primary form-input"
				/>
			</div>
			<button className="btn btn-filled !rounded-lg mt-5" formAction={signIn}>
				Sign In
			</button>
			<button
				className="btn"
				formAction={async () => {
					nameDialog.current!.showModal();
				}}
			>
				Sign Up
			</button>
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
							className="w-full input input-bordered border-primary form-input mb-10"
						/>
					</div>
					<button
						type="submit"
						className="btn"
						formAction={async (formData: FormData) => {
							nameDialog.current!.close();
							await signUp(formData);
						}}
					>
						Submit
					</button>
				</div>
			</dialog>
			{searchParams?.message && (
				<p className="mt-4 p-4 bg-foreground/10 text-foreground text-center rounded-lg">
					{searchParams.message}
				</p>
			)}
		</form>
	);
}