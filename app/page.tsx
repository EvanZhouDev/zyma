import MainHero from "@/components/MainHero";
import SignUp from "@/components/SignUp";
import { getServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { signIn, signUp } from "./actions";

export default async function Index({
	searchParams,
}: {
	searchParams: { message: string; redirectTo?: string };
}) {
	const client = getServerClient();

	if ((await client.auth.getUser()).data.user != null) {
		return redirect(searchParams.redirectTo ?? "/host/dashboard");
	}
	return (
		<MainHero>
			<p className="py-6 mb-5">Sign in to start attendance.</p>
			<div className="flex-1 flex flex-col px-8 min-w-[450px] text-left mb-10">
				<SignUp
					signIn={signIn.bind(null, searchParams.redirectTo)}
					signUp={signUp}
				/>
				{searchParams?.message && (
					<p className="mt-4 p-4 bg-foreground/10 text-foreground text-center rounded-lg">
						{searchParams.message}
					</p>
				)}
			</div>
		</MainHero>
	);
}
