"use server";

import { getServerClient } from "@/utils/supabase/server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function signIn(
	redirectTo: string | undefined,
	formData: FormData,
) {
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;
	const client = getServerClient();

	const { error } = await client.auth.signInWithPassword({
		email,
		password,
	});

	if (error) {
		return redirect(`/?message=${error}`);
	}
	return redirect(redirectTo ?? "/host/dashboard");
}
export async function signUp(formData: FormData) {
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
		return redirect(`/?message=${error}`);
	}

	return redirect("/?message=Check email to continue sign in process");
}
