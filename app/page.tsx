import MainHero from "@/components/MainHero";
import SignUp from "@/components/SignUp";
import { getServerClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Index({
	searchParams,
}: {
	searchParams: { message: string; redirectTo?: string };
}) {
	const client = getServerClient();

	if ((await client.auth.getUser()).data.user != null) {
		return redirect(searchParams.redirectTo ?? "/host/dashboard");
	}
	const signIn = async (redirectTo: string | undefined, formData: FormData) => {
		"use server";

		const email = formData.get("email") as string;
		const password = formData.get("password") as string;
		const client = getServerClient();

		const { error } = await client.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			return redirect("/?message=Could not authenticate user");
		}
		return redirect(redirectTo ?? "/host/dashboard");
	};

	const signUp = async (formData: FormData) => {
		"use server";

		const origin = headers().get("origin");
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;
		const name = formData.get("name") as string;

		const client = getServerClient();

		const { error } = await client.auth.signUp({
			email,
			password,
			options: {
				data: {
					name: name,
				},
				emailRedirectTo: `${origin}/host/dashboard`,
			},
		});

		if (error) {
			return redirect("/?message=Could not authenticate user");
		}

		return redirect("/?message=Check email to continue sign in process");
	};
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
