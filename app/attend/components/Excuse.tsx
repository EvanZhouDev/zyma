"use client";
import Icon from "@/components/Icon";
import { useState } from "react";
import { updateExcuse } from "../actions";

export default function Excuse({ code, user, status }) {
	const [excuse, setExcuse] = useState(status);
	return (
		<div className="flex flex-col justify-stretch">
			{status === excuse ? (
				<>
					<p className="py-6 max-w">
						Not actually here? Select a reason and change your status.
					</p>
					<select
						className="select select-bordered w-full"
						value={excuse}
						onChange={(event) => {
							setExcuse(event.target.value);
						}}
					>
						<option disabled defaultValue={status}>
							Pick a reason for absence...
						</option>
						<option value={1}>Doctor's Appointment</option>
						<option value={2}>Family Issues</option>
						<option value={3}>Busy With Other Clubs</option>
						<option value={4}>Homework</option>
						<option value={5}>Other</option>
					</select>
					<form action={updateExcuse.bind(null, code, user, excuse)}>
						<button
							onClick={() => {
								setAvailableToChoose(false);
							}}
							className="ml-2 mt-5 btn btn-filled"
							disabled={excuse === status}
						>
							<Icon.Outlined name="ArrowRightOnRectangle" />
							Mark me as absent
						</button>
					</form>
				</>
			) : (
				<div className="mt-10 bg-secondary py-5 rounded">
					Successfully marked your absence.
				</div>
			)}
			<p className="py-6 max-w opacity-50">It is safe to close this tab.</p>
		</div>
	);
}
