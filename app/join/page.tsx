import MainHero from "@/components/MainHero";
import { v } from "@/utils";
import { createClient } from "@/utils/supabase/server";
import { AlertIcon, InfoIcon } from "@primer/octicons-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Join({
	searchParams,
}: {
	searchParams: { group?: number };
}) {
	const cookieStore = cookies();
	const client = createClient(cookieStore);
	const attendee = (await client.auth.getUser()).data?.user?.id;
	if (attendee == null) {
		return redirect("/");
	}
	if (searchParams.group === undefined) {
		return (
			<MainHero padding={10}>
				<div className="mt-5">Could not Join this group.</div>
				<div role="alert" className="alert alert-error mt-10 mb-10">
					<AlertIcon size="medium" />
					<span>No code provided.</span>
				</div>
				Please try again, ensuring you entered the code correctly.
			</MainHero>
		);
	}
	const { error } = await client
		.from("students")
		.insert([{ attendee, group: searchParams.group }]);
	if (error !== null) {
		if (error.code === "23505") {
			return (
				<MainHero>
					{/* <div className="mt-5">Could not Attend this group.</div> */}
					<div role="alert" className="alert alert-info my-5">
						<InfoIcon size="medium" />
						<span>You already joined this group</span>
					</div>
					<p className="max-w opacity-50">It is safe to close this tab.</p>
				</MainHero>
			);
		}
		// Group not found
		console.assert(error.code === "23503");
		return (
			<MainHero padding={10}>
				<div className="mt-5">Could not Attend this group.</div>
				<div role="alert" className="alert alert-error my-10">
					<AlertIcon size="medium" />
					<span>
						Group <b>{searchParams.group}</b> not found.
					</span>
				</div>
				Please try again, ensuring you entered the code correctly.
			</MainHero>
		);
	}
	const data = v(
		await client.from("groups").select("name").eq("id", searchParams.group),
	)[0].name;
	return (
		<MainHero>
			<h1 className="my-5 text-xl">
				Successfully joined <b>{data}</b>
			</h1>
			<p className="max-w opacity-50">It is safe to close this tab.</p>
		</MainHero>
	);
}
