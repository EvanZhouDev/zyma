import MainHero from "@/components/MainHero";
import { createClient } from "@/utils/supabase/server";
import { AlertIcon } from "@primer/octicons-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Excuse from "./components/Excuse";

export default async function Page({
	searchParams,
}: {
	searchParams: { code?: string };
}) {
	const cookieStore = cookies();
	const client = createClient(cookieStore);
	const attendeeId = (await client.auth.getUser()).data?.user?.id;
	if (attendeeId == null) {
		return redirect("/");
	}
	if (searchParams.code === undefined) {
		return (
			<MainHero padding={10}>
				<div className="mt-5">Could not Attend this group.</div>
				<div role="alert" className="alert alert-error mt-10 mb-10">
					<AlertIcon size="medium" />
					<span>No code provided.</span>
				</div>
				Please try again, ensuring you entered the code correctly.
			</MainHero>
		);
	}
	const { data, error } = await client
		.from("attendance")
		.upsert({
			attendee: attendeeId,
			code_used: searchParams.code,
		})
		.select("status");

	if (error != null || data === null) {
		console.assert(error.code === "23503", JSON.stringify(error));
		return (
			<MainHero padding={10}>
				<div className="mt-5">Could not Attend this group.</div>
				<div role="alert" className="alert alert-error mt-10 mb-10">
					<AlertIcon size="medium" />
					<span>
						Code <b>{searchParams.code}</b> not found.
					</span>
				</div>
				Please try again, ensuring you entered the code correctly.
			</MainHero>
		);
	}

	return (
		<MainHero padding={10}>
			<div className="flex flex-col w-full border-opacity-50">
				<div className="grid card">
					<p className="mt-10">
						Attended with code <br />
						<b>{searchParams.code}</b>
					</p>
				</div>
				<div className="divider !m-0 !mt-10" />
				<div className="grid card">
					<Excuse
						code={searchParams.code}
						user={attendeeId}
						status={data[0].status}
					/>
				</div>
			</div>
		</MainHero>
	);
}
