import MainHero from "@/components/MainHero";
import { getServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { signIn, signUp } from "./actions";
import SignUp from "./components/SignUp";

export default async function Index({
	searchParams,
}: {
	searchParams: { message?: string; error?: string; redirectTo?: string };
}) {
	const client = getServerClient();
	const user = (await client.auth.getUser()).data.user;

	if (user != null) {
		return redirect(
			searchParams.redirectTo ?? user.user_metadata.role === 0
				? "/host/dashboard"
				: "/attendee",
		);
	}
	return (
		<MainHero>
			<div className="flex-1 flex flex-col items-center px-8 min-w-[25vw] text-left mb-10">
				{searchParams?.message ? (
					<p className="alert alert-info !h-15 !my-2 !mt-5 bg-foreground/10 text-foreground rounded-lg flex flex-col items-center">
						{searchParams.message}
					</p>
				) : searchParams?.error ? (
					<p className="alert alert-error !h-15 !my-2 !mt-5 bg-foreground/10 text-foreground rounded-lg flex flex-col items-center">
						{searchParams.error}
					</p>
				) : (
					<p className="alert h-15 my-2 mt-5 bg-base-100 border-none flex flex-col items-center">
						Sign in to start attendance.
					</p>
				)}

				<SignUp
					signIn={signIn.bind(null, searchParams.redirectTo)}
					signUp={signUp}
				/>
			</div>
		</MainHero>
	);
}
