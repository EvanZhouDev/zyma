"use client";
import { usePathname } from "next/navigation";
import Icon from "./Icon";

export default function Navbar() {
	const pathname = usePathname();
	const pathToData = {
		"/teacher/dashboard": {
			name: "Teacher Dashboard",
			icon: "ComputerDesktop",
		},
		"/teacher/attendance": {
			name: "Attendance",
			icon: "Clipboard",
		},
		"/": {
			name: "Main Page",
			icon: "Clipboard",
		},
		"/join": {
			name: "Joining Class",
			icon: "User",
		},
		"/attend": {
			name: "Mark Attendance",
			icon: "Clipboard",
		},
	};
	return (
		<div className="w-full navbar absolute bg-base-100 flex flex-row justify-between h-[5%]">
			<div className="website-title !m-0 w-[20%]">CH20</div>
			<div className="bg-secondary p-3 rounded-full">
				<Icon.Outlined
					className="!w-5 !h-5 !stroke-[2px] mx-2"
					name={pathToData[pathname].icon}
				/>
				{pathToData[pathname].name}
			</div>
			<div className="w-[20%] flex justify-end">
				<label className="swap swap-rotate">
					{/* this hidden checkbox controls the state */}
					<input
						type="checkbox"
						className="theme-controller"
						value="materialYouDark"
					/>

					{/* sun icon */}
					<Icon.Outlined
						className="swap-on !w-10 !h-10 !stroke-[1.5px] mx-2"
						name="Sun"
					/>

					{/* moon icon */}
					<Icon.Outlined
						className="swap-off !w-10 !h-10 !stroke-[1.5px] mx-2"
						name="Moon"
					/>
				</label>
			</div>
		</div>
	);
}
