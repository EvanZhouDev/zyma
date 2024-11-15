import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Database } from "./types";

export async function getServerClient() {
	const cookieStore = await cookies();
	const client = createClient(cookieStore);
	return client;
}
export type ServerClient = Awaited<ReturnType<typeof getServerClient>>;
export async function getServerClientWithRedirect(currentRoute: string) {
	const client = await getServerClient();
	const user = (await client.auth.getUser()).data?.user;
	if (user == null) {
		redirect(`/?redirectTo=${encodeURIComponent(currentRoute)}`);
	}
	const attendeeId = user.id;
	const role = user.user_metadata.role;
	if (!currentRoute.startsWith(`/${role === 0 ? "host" : "attendee"}`)) {
		redirect("/403");
	}
	return { client, attendeeId, user };
}
export const createClient = (
	cookieStore: Awaited<ReturnType<typeof cookies>>,
) => {
	return createServerClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				get(name: string) {
					return cookieStore.get(name)?.value;
				},
				set(name: string, value: string, options: CookieOptions) {
					try {
						cookieStore.set({ name, value, ...options });
					} catch (_) {
						// The `set` method was called from a Server Component.
						// This can be ignored if you have middleware refreshing
						// user sessions.
					}
				},
				remove(name: string, options: CookieOptions) {
					try {
						cookieStore.set({ name, value: "", ...options });
					} catch (_) {
						// The `delete` method was called from a Server Component.
						// This can be ignored if you have middleware refreshing
						// user sessions.
					}
				},
			},
		},
	);
};
