import MainHero from "@/components/MainHero";
import { getServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { signIn, signUp } from "./actions";
import SignUp from "./components/SignUp";

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
			<div className="flex-1 flex flex-col items-center px-8 min-w-[450px] text-left mb-10">
				{searchParams?.message ? (
					<p
						className={`alert ${
							searchParams.message.includes("Could not authenticate")
								? "alert-error"
								: "alert-info"
						} !h-15 !my-2 !mt-5 bg-foreground/10 text-foreground rounded-lg flex flex-col items-center`}
					>
						{searchParams.message}
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
