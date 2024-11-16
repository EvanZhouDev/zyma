import { PersonIcon } from "@primer/octicons-react";
import { useRef, useState } from "react";

export default function Profile() {
	const profileModal = useRef<HTMLDialogElement>(null);
	const [newPassword, setNewpassword] = useState("");
	const tabs = [
		"Account",
		"Passwords",
		"Notifications",
		"Billing",
		"Security",
		"Privacy",
		"Help",
		"Logout",
	];
	const [activeTab, setActiveTab] = useState("Account");
	return (
		<>
			<dialog ref={profileModal} className="modal">
				<div className="modal-box w-4/5 h-fit p-0 backdrop-blur-sm bg-white/30">
					{/* <div className=""> */}
					<div className="drawer h-full w-full lg:drawer-open">
						<input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
						<div className="drawer-content h-full w-full flex flex-col items-center p-4  bg-base-100">
							<div className="p-6">
								<h3 className="font-bold text-xl pb-3">Your profile</h3>
								<div className="space-y-2">
									{/* Change email
									<label className="input input-bordered flex items-center gap-2">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 16 16"
											fill="currentColor"
											className="h-4 w-4 opacity-70"
										>
											<path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
											<path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
										</svg>
										<input type="text" className="grow" placeholder="Email" />
									</label> */}
									Change your username
									<label className="input input-bordered flex items-center gap-2">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 16 16"
											fill="currentColor"
											className="h-4 w-4 opacity-70"
										>
											<path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
										</svg>
										<input
											type="text"
											className="grow"
											placeholder="Username"
										/>
									</label>
									Change your password
									<label className="input input-bordered flex items-center gap-2">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 16 16"
											fill="currentColor"
											className="h-4 w-4 opacity-70"
										>
											<path
												fillRule="evenodd"
												d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
												clipRule="evenodd"
											/>
										</svg>
										<input
											type="password"
											className="grow"
											value={newPassword}
											autoComplete="new-password"
											onChange={(event) => setNewpassword(event.target.value)}
										/>
									</label>
								</div>
							</div>
							{/* <label
								htmlFor="my-drawer-2"
								className="btn btn-primary drawer-button lg:hidden"
							>
								Open drawer
							</label> */}

							<div className="modal-action justify-end w-full mx-4">
								<form method="dialog">
									{/* if there is a button in form, it will close the modal */}
									<button className="btn btn-standard">Close</button>
								</form>
							</div>
						</div>
						<div className="drawer-side h-full">
							<label
								htmlFor="my-drawer-2"
								aria-label="close sidebar"
								className="drawer-overlay"
							></label>
							<ul className="menu backdrop-blur-sm bg-white/30 h-full pr-0 w-32 transition-all duration-75">
								{tabs.map((tab) => (
									<li
										key={tab}
										className={
											activeTab === tab
												? "bg-base-100 rounded-lg rounded-r-none shadow-lg"
												: ""
										}
									>
										<button
											className={activeTab === tab ? "active" : ""}
											onClick={() => {
												setActiveTab(tab);
											}}
										>
											{tab}
										</button>
									</li>
								))}
							</ul>
						</div>
					</div>
					{/* </div> */}
					{/* <p className="py-4">Change account role</p> */}
				</div>
			</dialog>
			<button
				className="btn btn-ghost"
				onClick={() => {
					profileModal.current!.showModal();
				}}
			>
				<PersonIcon className="w-8 h-8"></PersonIcon>
			</button>
		</>
	);
}
