export function v<T, E>({ data, error }: { data: T; error?: E }): T {
	if (error !== null) {
		console.log(error);
		throw error;
	}
	return data;
}
export function getRelativeTime(time1: string, time2: string) {
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
}
