"use client";
import Logo from "@/components/Logo";
import SwitchTheme from "@/components/SwitchTheme.jsx";
import { v } from "@/utils";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/utils/supabase/types";
import {
	InfoIcon,
	RepoIcon,
	ReportIcon,
	SignOutIcon,
} from "@primer/octicons-react";
import { useEffect, useRef, useState } from "react";
import { Attendee, AttendeesInClassContext } from "../contexts";
import AttendeeTable from "./AttendeeTable";
import GroupTable from "./GroupTable";
import NewGroup from "./NewGroup";
import RegisterAttendee from "./RegisterAttendee";

async function getAttendee(uuid: string) {
	const client = await createClient();
	return v(
		await client
			.from("attendees")
			.select("profiles (username, email), metadata")
			.eq("attendee", uuid),
	)[0];
}
type Group = Tables<"groups">;
export default function Dashboard({
	initialGroups,
	admin,
}: {
	initialGroups: Group[];
	admin: string;
}) {
	const manageClasses = useRef<HTMLInputElement>(null);
	const [selectedClass, setSelectedClass] = useState(0);
	const [groups, setGroups] = useState(initialGroups);
	const groupId = groups[selectedClass]?.id;
	const className = groups[selectedClass]?.name;
	const [attendees, setAttendees] = useState<Attendee[]>([]);
	useEffect(() => {
		(async () => {
			const client = await createClient();
			client
				.channel("groups")
				.on(
					"postgres_changes",
					{
						event: "INSERT",
						schema: "public",
						table: "groups",
						filter: `admin=eq.${admin}`,
					},
					(payload) => {
						console.log(payload);
						setGroups((x) => [...x, payload.new as Group]);
					},
				)
				.on(
					"postgres_changes",
					{
						event: "UPDATE",
						schema: "public",
						table: "groups",
						filter: `admin=eq.${admin}`,
					},
					(payload) => {
						console.log(payload);
						setGroups((groups) =>
							groups.filter((x) => (x.id === payload.new.id ? payload.new : x)),
						);
					},
				)
				.on(
					"postgres_changes",
					{
						event: "DELETE",
						schema: "public",
						table: "groups",
						filter: `admin=eq.${admin}`,
					},
					(payload) => {
						console.log(payload);
						setGroups((groups) =>
							groups.filter((x) => x.id !== payload.old.id),
						);
					},
				)
				.subscribe(console.log);
		})();
	}, [admin]);
	useEffect(() => {
		(async () => {
			if (groupId) {
				const client = await createClient();
				const attendees = v(
					await client
						.from("attendees_with_group")
						.select("profiles (username, email), metadata, attendee")
						.eq("group", groupId),
				);
				setAttendees(
					(attendees ?? []).map((x) => {
						return {
							...x.profiles!,
							metadata: x.metadata,
							id: x.attendee,
							group: groupId,
						} as Attendee;
					}),
				);
				client
					.channel("attendees-in-group")
					.on(
						"postgres_changes",
						{
							event: "INSERT",
							schema: "public",
							table: "attendees_with_group",
							// I hope this doesn't introduce security errors
							filter: `group=eq.${groupId}`,
						},
						(payload) => {
							getAttendee(payload.new.attendee).then((attendee) => {
								console.assert(attendee.metadata === payload.new.metadata);
								setAttendees((x) => [
									...x,
									{
										...attendee.profiles!,
										metadata: attendee.metadata,
									} as Attendee,
								]);
							});
						},
					)
					.on(
						"postgres_changes",
						{
							event: "UPDATE",
							schema: "public",
							table: "attendees_with_group",
							filter: `group=eq.${groupId}`,
						},
						(payload) => {
							console.log(payload);
							setAttendees((attendees) =>
								attendees.filter((x) =>
									x.id === payload.new.id ? payload.new : x,
								),
							);
						},
					)
					.on(
						"postgres_changes",
						{
							event: "DELETE",
							schema: "public",
							table: "attendees_with_group",
							filter: `group=eq.${groupId}`,
						},
						(payload) => {
							console.log(payload);
							setAttendees((attendees) =>
								attendees.filter((x) => x.id !== payload.old.id),
							);
						},
					)
					.subscribe(console.log);
			}
		})();
	}, [groupId]);

	return (
		<div className="bg-secondary flex h-full w-full justify-around">
			<div className="rounded-box m-3 mr-1.5 basis-3/5">
				<div role="tablist" className="tabs tabs-lifted">
					<input
						type="radio"
						name="my_tabs_2"
						role="tab"
						className="tab h-10 !w-[15vw]"
						aria-label="Manage Attendees"
						defaultChecked
					/>
					<div
						role="tabpanel"
						className="w-[60vw] tab-content bg-base-100 border-base-200 rounded-box h-[calc(100vh-62px)] p-6"
					>
						<div className="flex flex-col">
							<AttendeesInClassContext.Provider value={attendees}>
								<div className="mt-4 flex w-full flex-row items-center justify-between">
									<h1 className="mr-2 text-3xl font-bold">Current Group: </h1>{" "}
									<select
										className="select input-standard mx-2 flex-grow"
										value={selectedClass}
										onChange={async (event) => {
											const newClassIndex = parseInt(event.target.value);
											setSelectedClass(newClassIndex);
										}}
									>
										<option disabled defaultValue={0}>
											Pick a group...
										</option>
										{groups.map((x, i) => (
											<option value={i} key={x.id}>
												{x.name}
											</option>
										))}
									</select>
								</div>
								{groupId === undefined && className === undefined ? (
									<div role="alert" className="alert alert-info mt-10">
										<InfoIcon size="medium" />
										<span className="text-lg">
											No Groups found.{" "}
											<button
												className="link"
												onClick={() => {
													manageClasses.current!.checked = true;
												}}
											>
												Create one to get started.
											</button>
										</span>
									</div>
								) : (
									<>
										<div className="mt-10 flex w-full flex-row items-center justify-between">
											<input
												type="text"
												placeholder="Search Attendees..."
												className="input input-standard mr-2 flex-grow"
											/>
											<RegisterAttendee groupId={groupId} />
										</div>
										<div>
											<AttendeeTable />
										</div>
									</>
								)}
							</AttendeesInClassContext.Provider>
						</div>
					</div>

					<input
						type="radio"
						name="my_tabs_2"
						ref={manageClasses}
						role="tab"
						className="tab h-10 !w-[15vw]"
						aria-label="Manage Your Groups"
					/>
					<div
						role="tabpanel"
						className="w-[60vw] tab-content bg-base-100 border-base-200 rounded-box h-[calc(100vh-62px)] p-6"
					>
						<div className="flex flex-col">
							<AttendeesInClassContext.Provider value={attendees}>
								<div className="mt-4 flex w-full flex-row items-center justify-between">
									<h1 className="mr-2 text-3xl font-bold">Your Groups</h1>
									<NewGroup />
								</div>
								{/* <div className="mt-4 flex w-full flex-row items-center justify-between"></div> */}
								{/* <div> */}
								<GroupTable groups={groups} />
								{/* </div> */}
							</AttendeesInClassContext.Provider>
						</div>
					</div>
				</div>
			</div>
			<div className="bg-base-100 rounded-box outline-base-200 m-3 ml-1.5 flex basis-2/5 flex-col items-center outline outline-1 justify-between">
				<div className="flex flex-col items-center w-full">
					<a
						className={`btn-start-attendance p-3 m-2 h-[10vh] w-[90%] flex items-center justify-center text-2xl font-semibold ${
							groups[0] === undefined ? "btn-disabled btn-start-disabled" : ""
						} mt-5 flex items-center justify-center`}
						href={`/host/attendance?groupId=${groupId}`}
					>
						<RepoIcon
							size="small"
							verticalAlign="middle"
							className="mr-2 w-10 h-10"
						/>
						<div className="flex flex-col">
							Start Attendance
							<span className="font-normal opacity-75 text-lg">
								for {attendees.length} registered attendees
							</span>
						</div>
					</a>
					{groups[0] === undefined ? (
						<p className="opacity-50 text-center">
							Cannot start attendance session without a group.
						</p>
					) : attendees.length === 0 ? (
						<p className="opacity-50 text-center max-w-lg">
							Zyma will not be able to track attendance without registered
							attendees.
						</p>
					) : undefined}
					{/* TODO: Refactor into config component */}
					<div className="w-full px-5 !mt-5">
						<h1 className="website-title !text-secondary-content !text-2xl">
							Configure Your Attendance Session:
						</h1>
						<label className="form-control my-2 w-full">
							<div className="label">
								<span className="label-text">
									Session Length (Leave empty for indefinite)
								</span>
							</div>
							<input
								type="text"
								placeholder="Length in seconds..."
								className="input input-standard w-full"
							/>
						</label>
						<label className="form-control my-2 w-full">
							<div className="label">
								<span className="label-text">
									Session Timeout (Leave empty for indefinite)
								</span>
							</div>
							<input
								type="text"
								placeholder="Timeout in seconds..."
								className="input input-standard w-full"
							/>
						</label>
						<label className="form-control my-2 flex w-full max-w-xs flex-row items-center">
							<div className="form-control">
								<label className="label cursor-pointer">
									<input
										type="checkbox"
										defaultChecked={true}
										className="checkbox checkbox-primary [--chkfg:white] rounded-md"
									/>
								</label>
							</div>
							<div className="label">
								<span className="label-text">
									Allow People Not in Group
									<br />
								</span>
							</div>
						</label>
					</div>
				</div>
				<div className="flex flex-row items-center justify-between w-full mb-5 px-5">
					<Logo className="ml-2" size={125} />
					<div className="flex flex-row items-center justify-between">
						<SwitchTheme />

						<a
							className="mx-5"
							href="https://github.com/EvanZhouDev/zyma/issues"
							title="Report an issue"
							target="_blank"
							rel="noreferrer"
						>
							<ReportIcon className="w-8 h-8" />
						</a>
						<button
							className="btn btn-dangerous"
							onClick={async () => {
								const supabase = await createClient();
								await supabase.auth.signOut();
								window.location.reload();
							}}
						>
							<SignOutIcon className="w-8 h-8" />
							Log Out
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
