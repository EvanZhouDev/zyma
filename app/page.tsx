import SignUp from "@/components/SignUp";
import { createClient } from "@/utils/supabase/server";
import { cookies, headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

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
		<div className="hero min-h-screen bg-neutral flex flex-col justify-center">
			<div className="hero-content text-center bg-base-100 p-[2.5vw] rounded-xl border border-base-300 login-page-box">
				<div className="max-w-md flex flex-col items-center mt-10">
					<h1 className="text-5xl font-bold">
						<Image src="/zyma.svg" width={250} height={1200} alt="Zyma Logo" />
					</h1>
					<p className="py-6 mb-5">Sign in to start attendance.</p>
					<div className="flex-1 flex flex-col px-8 min-w-[450px] text-left mb-10">
						<SignUp
							signIn={signIn}
							signUp={signUp}
							searchParams={searchParams}
						/>
					</div>
				</div>
			</div>
			<div className="text-md mt-8">
				<span>Zyma is proud to be free and open source.</span>
			</div>
			<div className="text-md mt-3 -mb-3">
				<a
					className="hover:text-primary transition-all"
					href="https://github.com/EvanZhouDev/zyma"
				>
					<MarkGithubIcon className="mr-1" />
					GitHub
				</a>
				<span className="mx-2">|</span>
				<a
					className="hover:text-primary transition-all"
					href="https://github.com/EvanZhouDev/zyma"
				>
					<InfoIcon className="mr-1" />
					About
				</a>
				<span className="mx-2">|</span>
				<a
					className="hover:text-primary transition-all"
					href="https://github.com/EvanZhouDev/zyma"
				>
					<HeartIcon className="mr-1" />
					Support
				</a>
			</div>
		</div>
	);
}
