"use client";
import { convertStatus } from "@/components/constants";
import { SignOutIcon } from "@primer/octicons-react";
import { useState } from "react";
import { updateExcuse } from "../actions";

export default function Excuse({
	code,
	user,
	status,
}: {
	code: string;
	user: string;
	status: number;
}) {
	const [excuse, setExcuse] = useState(status);
	const [availableToChoose, setAvailableToChoose] = useState(excuse === 0);
	return (
		<div className="flex flex-col justify-stretch">
			{availableToChoose ? (
				<>
					<p className="py-5 text-sm">
						Leaving later? Choose a reason and let the teacher know.
					</p>
					<select
						className="select input-standard w-full"
						value={excuse}
						onChange={(event) => {
							setExcuse(parseInt(event.target.value));
						}}
					>
						<option disabled defaultValue={0} value={0}>
							Pick a reason for absence...
						</option>
						<option value={1}>Doctor's Appointment</option>
						<option value={2}>Family Issues</option>
						<option value={3}>Busy With Other Clubs</option>
						<option value={4}>Homework</option>
						<option value={5}>Other</option>
					</select>
					<button
						className="mt-5 btn btn-dangerous flex-grow"
						disabled={excuse === status}
						onClick={async () => {
							await updateExcuse(code, user, excuse);
							status = excuse;
							setAvailableToChoose(false);
						}}
					>
						<SignOutIcon />
						Mark me as absent
					</button>
				</>
			) : (
				<>
					<div className="bg-secondary py-3 rounded">
						Successfully Absent with reason:
						<br />
						<b>{convertStatus(excuse)}</b>
					</div>
					<div className="w-full flex flex-col">
						<button
							className="btn btn-standard mt-3"
							onClick={() => {
								setAvailableToChoose(true);
							}}
						>
							Select a different reason
						</button>
						<button
							className="mt-5 underline"
							onClick={async () => {
								await updateExcuse(code, user, 0);
								status = 0;
								setAvailableToChoose(true);
							}}
						>
							Actually here? Mark me present.
						</button>
					</div>
				</>
			)}
			<p className="pt-5 max-w opacity-50">It is safe to close this tab.</p>
		</div>
	);
}
