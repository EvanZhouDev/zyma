import MainHero from "@/components/MainHero";
import { getServerClient } from "@/utils/supabase/server";

export default async function ErrorPage() {
	const client = getServerClient();
	const user = (await client.auth.getUser()).data.user;

	return (
		<MainHero>
			<h1 className="text-7xl font-bold mt-5">403</h1>
			<p className="mt-2">Forbidden Path</p>
			<a
				href={user?.user_metadata.role === 0 ? "/host/dashboard" : "/attendee"}
				className="mt-5 opacity-50 underline"
			>
				Return Home
			</a>
		</MainHero>
	);
}
