import SignUp from "@/components/SignUp";
import { createClient } from "@/utils/supabase/server";
import { cookies, headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
import MainHero from "@/components/MainHero";

import { MarkGithubIcon, InfoIcon, HeartIcon } from "@primer/octicons-react";

export default async function Index({
	searchParams,
}: {
	searchParams: { message: string };
}) {
	const cookieStore = cookies();
	const client = createClient(cookieStore);

	if ((await client.auth.getUser()).data.user != null) {
		return redirect("/teacher/dashboard");
	}

	const signIn = async (formData: FormData) => {
		"use server";

		const email = formData.get("email") as string;
		const password = formData.get("password") as string;
		const cookieStore = cookies();
		const supabase = createClient(cookieStore);

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			return redirect("/?message=Could not authenticate user");
		}

		return redirect("/teacher/dashboard");
	};

	const signUp = async (formData: FormData) => {
		"use server";

		const origin = headers().get("origin");
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;
		const name = formData.get("name") as string;

		const cookieStore = cookies();
		const supabase = createClient(cookieStore);

		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					name: name,
				},
				emailRedirectTo: `${origin}/teacher/dashboard`,
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
				<SignUp signIn={signIn} signUp={signUp} />
				{searchParams?.message && (
					<p className="mt-4 p-4 bg-foreground/10 text-foreground text-center rounded-lg">
						{searchParams.message}
					</p>
				)}
			</div>
		</MainHero>
	);
}
