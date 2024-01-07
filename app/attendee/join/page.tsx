import CodeNotFound from "@/components/CodeNotFound";
import MainHero from "@/components/MainHero";
import NoCodeProvided from "@/components/NoCodeProvided";
import { v } from "@/utils";
import { getServerClientWithRedirect } from "@/utils/supabase/server";
import { InfoIcon } from "@primer/octicons-react";
export default async function Join({
	searchParams,
}: {
	searchParams: { code?: string };
}) {
	const { client, attendeeId } = await getServerClientWithRedirect(
		`/attendee/join${
			searchParams.code !== undefined
				? `?code=${encodeURIComponent(searchParams.code)}`
				: ""
		}`,
	);
	if (searchParams.code === undefined) {
		return <NoCodeProvided action="Join" />;
	}
	const { error } = await client.from("attendees").insert({
		attendee: attendeeId,
		with_code: searchParams.code,
	});
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
		// Group not found or the group isn't joinable.
		// Either way it's an RLS violation
		// console.log(error);
		console.assert(error.code === "42501"); // "42501" is the error code for RLS violations
		return (
			<CodeNotFound
				code={searchParams.code}
				action="Join"
				footer="The Code may have expired."
			/>
		);
	}
	const data = v(
		await client.from("groups").select("name").eq("code", searchParams.code),
	);
	return (
		<MainHero>
			<h1 className="my-5 text-xl">
				Successfully joined <b>{data[0]!.name}</b>
			</h1>
			<p className="max-w opacity-50">It is safe to close this tab.</p>
		</MainHero>
	);
}
