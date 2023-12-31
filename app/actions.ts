"use server";

import { convertRole } from "@/components/constants";
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

	const { data, error } = await client.auth.signInWithPassword({
		email,
		password,
	});

	if (error) {
		const redirectURL = new URL(headers().get("origin")!);
		redirectURL.searchParams.append("error", error.message);
		if (redirectTo) {
			redirectURL.searchParams.append("redirectTo", redirectTo);
		}

		return redirect(redirectURL.href);
	}
	const user = data.user;
	return redirect(
		redirectTo ?? user.user_metadata.role === 0
			? "/host/dashboard"
			: "/attendee",
	);
}
export async function signUp(formData: FormData, trial = 3): Promise<never> {
	const origin = headers().get("origin");
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;
	const name = formData.get("name") as string;
	const role = convertRole(formData.get("role") as string);

	const client = getServerClient();

	const { error } = await client.auth.signUp({
		email,
		password,
		options: {
			data: {
				name,
				role,
			},
			emailRedirectTo:
				role === 0 ? `${origin}/host/dashboard` : `${origin}/attendee`,
		},
	});
	if (error) {
		console.log(error, JSON.stringify(error));
		// Random glitch
		if (error.name === "AuthRetryableFetchError") {
			if (trial === 0) {
				console.log("OUT OF RETRIES");
				return redirect(
					`/?error=${encodeURIComponent(
						"AuthRetryableFetchError: Please try again later",
					)}`,
				);
			}
			return await signUp(formData, trial - 1);
		}
		return redirect(`/?error=${error.message}`);
	}
	return redirect("/?message=Check email to continue sign in process");
}
