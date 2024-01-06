"use client";
import Logo from "@/components/Logo";
import SwitchTheme from "@/components/SwitchTheme.jsx";
import { SelectPublic, v } from "@/utils";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/utils/supabase/types";
import {
	InfoIcon,
	RepoIcon,
	ReportIcon,
	SignOutIcon,
} from "@primer/octicons-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Attendee, AttendeesInClassContext } from "../contexts";
import AttendeeTable from "./AttendeeTable";
import ExportButton from "./ExportButton";
import GroupTable from "./GroupTable";
import NewGroup from "./NewGroup";
import RegisterAttendee from "./RegisterAttendee";
import YourLastAttendance from "./YourLastAttendance";
import { SELECT_ATTENDEES } from "../queries";
import pDebounce from "p-debounce";

async function getAttendees(group: number) {
	const client = await createClient();
	return v(
		await client
			.from("groups")
			.select(`attendees (${SELECT_ATTENDEES})`)
			.eq("id", group),
	)[0].attendees;
}

async function getGroupId(code: string) {
	const client = await createClient();
	return v(await client.from("groups").select("id").eq("code", code))[0];
}

type Group = Tables<"groups"> & {
	attendees: SelectPublic<"attendees", typeof SELECT_ATTENDEES>[]; // for now
};
function transformAttendeeResult(
	x: SelectPublic<"attendees", typeof SELECT_ATTENDEES>,
) {
	return {
		...x.profiles!,
		metadata: x.metadata,
		id: x.attendee,
		group: x.groups!.id,
	} as Attendee;
}
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
	const [allAttendees, setAllAttendees] = useState<{
		[key: number]: Attendee[];
	}>(
		Object.fromEntries(
			initialGroups.map((x) => [
				x.id,
				(x.attendees ?? []).map(transformAttendeeResult),
			]),
		),
	);
	const attendees = allAttendees[groupId] ?? [];
	const router = useRouter();
	const refetchAttendees = useCallback(
		pDebounce(async (groupId: number) => {
			const newAttendees = await getAttendees(groupId);
			setAllAttendees((x) => {
				return {
					...x,
					[groupId]: newAttendees.map(transformAttendeeResult),
				};
			});
		}, 200),
		[],
	);
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
							groups.map((x) =>
								x.id === payload.new.id ? (payload.new as Group) : x,
							),
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
			const client = await createClient();
			client
				.channel("attendees")
				.on(
					"postgres_changes",
					{
						event: "INSERT",
						schema: "public",
						table: "attendees",
					},
					(payload) => {
						console.log(payload);
						refetchAttendees(groupId);
					},
				)
				.on(
					"postgres_changes",
					{
						event: "UPDATE",
						schema: "public",
						table: "attendees",
					},
					(payload) => {
						console.log(payload);
						refetchAttendees(groupId);
					},
				)
				.on(
					"postgres_changes",
					{
						event: "DELETE",
						schema: "public",
						table: "attendees",
					},
					(payload) => {
						console.log(payload);
						refetchAttendees(groupId);
					},
				)
				.subscribe(console.log);
		})();
	}, [groupId, refetchAttendees]);

	return (
		<div className="bg-secondary flex h-full w-full justify-around">
			<div className="rounded-box m-3 mr-1.5 basis-3/5">
				<div role="tablist" className="tabs tabs-lifted">
					<input
						type="radio"
						name="my_tabs_2"
						role="tab"
						className="tab h-10 !w-[200px]"
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
											<ExportButton group={groups[selectedClass]} />
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
						className="tab h-10 !w-[200px]"
						aria-label="Manage Your Groups"
					/>
					<div
						role="tabpanel"
						className="w-[60vw] tab-content bg-base-100 border-base-200 rounded-box h-[calc(100vh-62px)] p-6"
					>
						<div className="flex flex-col">
							<div className="mt-4 flex w-full flex-row items-center justify-between">
								<h1 className="mr-2 text-3xl font-bold">Your Groups</h1>
								<NewGroup />
							</div>
							<AttendeesInClassContext.Provider value={attendees}>
								{/* <div className="mt-4 flex w-full flex-row items-center justify-between"></div> */}
								{/* <div> */}
								<GroupTable groups={groups} />
							</AttendeesInClassContext.Provider>
							{/* </div> */}
						</div>
					</div>
				</div>
			</div>
			<div className="m-3 ml-1.5 flex basis-2/5 flex-col items-center justify-between">
				<div className="bg-base-100 rounded-box outline-base-200 flex flex-col items-center outline outline-1 justify-between w-full flex-grow">
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
							<div role="alert" className="alert alert-warning">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="stroke-current shrink-0 h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
									/>
								</svg>
								<span>
									Currently, configuring your attendance session is not
									implemented
								</span>
							</div>
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
				</div>
				<div className="bg-base-100 rounded-box outline-base-200 flex flex-col items-center outline outline-1 justify-between w-full mt-3">
					<AttendeesInClassContext.Provider value={attendees}>
						<YourLastAttendance />
					</AttendeesInClassContext.Provider>
				</div>
				<div className="bg-base-100 rounded-box outline-base-200 flex flex-col items-center outline outline-1 justify-between w-full mt-3">
					<div className="flex flex-row items-center justify-between w-full mb-5 mt-5 px-5">
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
									router.push("/");
								}}
							>
								<SignOutIcon className="w-8 h-8" />
								Log Out
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
