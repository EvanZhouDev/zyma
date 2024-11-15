import CodeNotFound from "@/components/CodeNotFound";
import MainHero from "@/components/MainHero";
import NoCodeProvided from "@/components/NoCodeProvided";
import { getServerClientWithRedirect } from "@/utils/supabase/server";
import Excuse from "./components/Excuse";
import { STATUS_TO_NUMBER } from "@/components/constants";

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<{ code?: string }>;
}) {
	const { code } = await searchParams;
	const { client, attendeeId } = await getServerClientWithRedirect(
		`/attendee/attend${
			code !== undefined ? `?code=${encodeURIComponent(code)}` : ""
		}`,
	);
	if (code === undefined) {
		return <NoCodeProvided action="Attend" />;
	}
	const { data, error } = await client
		.from("attendance")
		.upsert({
			attendee: attendeeId,
			code_used: code,
			status: STATUS_TO_NUMBER.Present,
		})
		.select("status");

	if (error != null || data === null) {
		console.assert(error.code === "23503", JSON.stringify(error));
		return (
			<CodeNotFound
				code={code}
				action="Attend"
				footer="The Attendance Session may have ended."
			/>
		);
	}

	return (
		<MainHero padding={10}>
			<div className="flex flex-col w-full border-opacity-50">
				<div className="grid card">
					<p className="mt-10">
						Attended with code <br />
						<b>{code}</b>
					</p>
				</div>
				<div className="divider !m-0 !mt-10" />
				<div className="grid card">
					<Excuse code={code} user={attendeeId} status={data[0].status} />
				</div>
			</div>
		</MainHero>
	);
}
