import { getRelativeTime } from "@/utils";
import { useEffect, useState } from "react";

export default function TimeElapsed({ time }: { time?: string }) {
	if (time === undefined) return <span>--</span>;
	const [relativeTime, setRelativeTime] = useState<string>(
		getRelativeTime(time, new Date().toISOString()),
	);

	useEffect(() => {
		const interval = setInterval(() => {
			setRelativeTime(getRelativeTime(time, new Date().toISOString()));
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	}, [time]);

	return <span>{relativeTime}</span>;
}
