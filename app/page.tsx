import SignUp from "@/components/SignUp";
import { createClient } from "@/utils/supabase/server";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

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
		<div className="hero min-h-screen bg-neutral">
			<div className="hero-content text-center">
				<div className="max-w-md">
					<h1 className="text-5xl font-bold">Hello there</h1>
					<p className="py-6">Sign in or sign up to start taking attendance.</p>
					<div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 text-left">
						<SignUp
							signIn={signIn}
							signUp={signUp}
							searchParams={searchParams}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
