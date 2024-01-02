"use client";
import MainHero from "@/components/MainHero";
import { isValidCode, v } from "@/utils";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/utils/supabase/types";
import { GearIcon, SignOutIcon } from "@primer/octicons-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import GroupTable from "./GroupTable";
async function getGroup(groupCode: string) {
	return v(
		await (await createClient())
			.from("groups")
			.select("*")
			.eq("code", groupCode),
	)[0];
}
export default function Client({
	initialGroups,
	attendeeId,
}: { initialGroups: Tables<"groups">[]; attendeeId: string }) {
	const [groups, setGroups] = useState(initialGroups);
	const classDialog = useRef<HTMLDialogElement>(null);
	const [attendCode, setAttendCode] = useState("");
	const [joinCode, setJoinCode] = useState("");
	const router = useRouter();
	useEffect(() => {
		(async () => {
			const client = await createClient();
			client
				.channel("attendees-in-group")
				.on(
					"postgres_changes",
					{
						event: "INSERT",
						schema: "public",
						table: "attendees",
						// I hope this doesn't introduce security errors
						filter: `attendee=eq.${attendeeId}`,
					},
					(payload) => {
						getGroup(payload.new.with_code).then((group) => {
							setGroups((groups) => [...groups, group]);
						});
					},
				)
				.on(
					"postgres_changes",
					{
						event: "UPDATE",
						schema: "public",
						table: "attendees",
						filter: `attendee=eq.${attendeeId}`,
					},
					(payload) => {
						getGroup(payload.new.with_code).then((group) => {
							setGroups((groups) =>
								groups.map((x) => (x.id === payload.new.group ? group : x)),
							);
						});
					},
				)
				.on(
					"postgres_changes",
					{
						event: "DELETE",
						schema: "public",
						table: "attendees",
						filter: `attendee=eq.${attendeeId}`,
					},
					(payload) => {
						console.log(payload);
						setGroups((groups) =>
							groups.filter((x) => x.id !== payload.old.group),
						);
					},
				)
				.subscribe(console.log);
		})();
	}, [attendeeId]);
	return (
		<MainHero padding={3}>
			<div className="flex-1 flex flex-col items-center px-8 min-w-[450px] text-left mb-10">
				<b className="text-lg text-center w-full mt-10">
					Scan Host's QR Code to Attend.
				</b>
				<br />
				Alternatively, enter the Passcode below.
				<div className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground mt-10 mb-10">
					<input
						required
						type="text"
						name="groupCode"
						value={attendCode}
						onChange={(e) => setAttendCode(e.target.value)}
						placeholder="Group Passcode..."
						className="w-full input input-standard flex-grow form-input"
					/>
					<a
						className={`btn btn-standard !rounded-lg ${
							!isValidCode(attendCode) && "btn-disabled"
						}`}
						href={`/attendee/attend?code=${attendCode}`}
					>
						Attend Session
					</a>
				</div>

				<div className="flex items-center justify-between">
					<button
						className="btn btn-standard !rounded-lg mr-2"
						onClick={(e) => {
							e.preventDefault();
							classDialog.current!.showModal();
						}}
					>
						<GearIcon size="medium" />
						Manage Your Groups
					</button>
					<button
						className="btn btn-dangerous"
						onClick={async (e) => {
							e.preventDefault();
							const supabase = await createClient();
							await supabase.auth.signOut();
							router.push("/");
						}}
					>
						<SignOutIcon className="w-8 h-8" />
						Log Out
					</button>
				</div>
				<dialog ref={classDialog} className="modal">
					<div className="modal-box max-w-[50vw]">
						<div className="w-full flex flex-row text-2xl font-bold mb-5">
							Your Groups
						</div>
						<div className="w-full flex flex-row items-center justify-center">
							<label className="label-text text-xl h-full">Join a Group:</label>
							<input
								type="text"
								value={joinCode}
								onChange={(e) => setJoinCode(e.target.value)}
								placeholder="Group Code..."
								className="input input-standard flex-grow ml-5 mr-3"
							/>
							<a
								className={`btn btn-standard !rounded-lg ${
									!isValidCode(joinCode) && "btn-disabled"
								}`}
								href={`/attendee/join?code=${joinCode}`}
							>
								Join Group
							</a>
						</div>
						<div className="mb-5 mt-5 opacity-50">
							Registering for a group lets the Host automagically get attendance
							statistics. You may also be required to register for the Group to
							Attend.
						</div>
						<GroupTable groups={groups} attendeeId={attendeeId} />
						<form method="dialog" className="self-end">
							<button className="btn btn-standard mt-5">Close</button>
						</form>
					</div>
					<form method="dialog" className="modal-backdrop">
						<button>Close</button>
					</form>
				</dialog>
			</div>
		</MainHero>
	);
}
