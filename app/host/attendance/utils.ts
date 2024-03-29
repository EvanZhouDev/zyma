"use client";

import { SelectPublic } from "@/utils";

export type AttendeeInAttendance = SelectPublic<
	"attendance",
	"profiles (username), attendee, status, created_at"
>;
export function getRelativeMinuteTime(time1: string, time2: string) {
	// Convert both times to Date objects
	const date1 = new Date(time1);
	const date2 = new Date(time2);

	// Calculate the difference in milliseconds
	const diff = date2.getTime() - date1.getTime();

	// Convert the difference to minutes
	const minutes = Math.floor(diff / 60000);
	const seconds = parseInt(((diff % 60000) / 1000).toFixed(0));
	if (minutes === 0) {
		return `${seconds} second${seconds === 1 ? "" : "s"}`;
	}

	// Return the difference as a string
	return `${minutes} minute${minutes === 1 ? "" : "s"}`;
}
