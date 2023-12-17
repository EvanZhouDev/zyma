"use client";
import Icon from "@/components/Icon";
import { convertStatus } from "@/components/constants";
import { useState } from "react";
import { updateExcuse } from "../actions";

export default function Excuse({
	code,
	user,
	status,
}: { code: string; user: string; status: number }) {
	const [excuse, setExcuse] = useState(status);
	const [availableToChoose, setAvailableToChoose] = useState(excuse === 0);
	return (
		<div className="flex flex-col justify-stretch">
			{availableToChoose ? (
				<>
					<p className="py-6 max-w">
						Not actually here? Select a reason and change your status.
					</p>
					<select
						className="select select-bordered w-full"
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
						className="ml-2 mt-5 btn btn-filled"
						disabled={excuse === status}
						onClick={async () => {
							await updateExcuse(code, user, excuse);
							status = excuse;
							setAvailableToChoose(false);
						}}
					>
						<Icon.Outlined name="ArrowRightOnRectangle" />
						Mark me as absent
					</button>
				</>
			) : (
				<>
					<div className="mt-10 bg-secondary py-5 rounded">
						Successfully marked you as "{convertStatus(excuse)}"
					</div>
					<div className="w-full flex flex-row space-x-2">
						<button
							className="btn btn-primary mt-3"
							onClick={() => {
								setAvailableToChoose(true);
							}}
						>
							Select a different absense
						</button>
						<button
							className="btn btn-primary mt-3"
							onClick={async () => {
								await updateExcuse(code, user, 0);
								status = 0;
								setAvailableToChoose(true);
							}}
						>
							Mark me present
						</button>
					</div>
				</>
			)}
			<p className="py-6 max-w opacity-50">It is safe to close this tab.</p>
		</div>
	);
}
