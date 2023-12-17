"use client";

import { useEffect, useState } from "react";

export default function TimeElapsed({
	time,
	getRelativeTime: getR,
}: {
	time?: string;
	getRelativeTime?: (time1: string, time2: string) => string;
}) {
	const getRelativeTime =
		getR ??
		((time1: string, time2: string) => {
			// Convert both times to Date objects
			const date1 = new Date(time1);
			const date2 = new Date(time2);

			// Calculate the difference in milliseconds
			const diff = date2.getTime() - date1.getTime();

			// Convert the difference to minutes
			const minutes = Math.floor(diff / 60000);

			// Convert the remaining difference to seconds
			const seconds = parseInt(((diff % 60000) / 1000).toFixed(0));

			// Return the difference as a string
			return `${minutes} minute${minutes === 1 ? "" : "s"} and ${
				seconds < 10 ? "0" : ""
			}${seconds} second${seconds === 1 ? "" : "s"} ago`;
		});

	if (time === undefined) return <span>--</span>;

	const [relativeTime, setRelativeTime] = useState<string>("-- --");

	// biome-ignore lint/correctness/useExhaustiveDependencies: We need to run this effect only once
	useEffect(() => {
		setRelativeTime(getRelativeTime(time, new Date().toISOString()));

		const interval = setInterval(() => {
			setRelativeTime(getRelativeTime(time, new Date().toISOString()));
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	}, []);

	return <>{relativeTime}</>;
}
