import CodeNotFound from "@/components/CodeNotFound";
import MainHero from "@/components/MainHero";
import NoCodeProvided from "@/components/NoCodeProvided";
import { v } from "@/utils";
import {
	ServerClient,
	getServerClientWithRedirect,
} from "@/utils/supabase/server";
import { InfoIcon } from "@primer/octicons-react";
async function getGroup(client: ServerClient, code: string) {
	// What if user-passed code is null?
	return v(await client.from("groups").select("id, name").eq("code", code))[0];
}
export default async function Join({
	searchParams,
}: {
	searchParams: { code?: string };
}) {
	const { client, attendeeId } = await getServerClientWithRedirect(
		`/join${
			searchParams.code !== undefined
				? `?code=${encodeURIComponent(searchParams.code)}`
				: ""
		}`,
	);
	if (searchParams.code === undefined) {
		return <NoCodeProvided action="Join" />;
	}
	const group = await getGroup(client, searchParams.code);
	const { error } = await client.from("attendees").insert([
		{
			attendee: attendeeId,
			group: group.id,
		},
	]);
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
		return <CodeNotFound code={searchParams.code} />;
	}
	return (
		<MainHero>
			<h1 className="my-5 text-xl">
				Successfully joined <b>{group.name}</b>
			</h1>
			<p className="max-w opacity-50">It is safe to close this tab.</p>
		</MainHero>
	);
}
