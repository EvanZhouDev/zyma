"use client";
import React from "react";

export default function SignUp({ signUp, signIn, searchParams }) {
	const signUpFormRef = React.useRef();

	return (
		<form
			className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
			action={signIn}
			id="signInForm"
			ref={signUpFormRef}
		>
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
			<button className="btn btn-filled !rounded-lg mt-5">Sign In</button>
			<button
				className="btn"
				formAction={() => {}}
				onClick={() => {
					document.getElementById("my_modal_2").showModal();
				}}
			>
				Sign Up
			</button>
			<dialog id="my_modal_2" className="modal">
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
					<button type="submit" className="btn" formAction={signUp}>
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
