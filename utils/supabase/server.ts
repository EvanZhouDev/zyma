import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Database } from "./types";

export function getServerClient() {
	const cookieStore = cookies();
	const client = createClient(cookieStore);
	return client;
}
export async function getServerClientWithRedirect(currentRoute: string) {
	const client = getServerClient();
	const attendeeId = (await client.auth.getUser()).data?.user?.id;
	if (attendeeId == null) {
		redirect(`/?redirectTo=${currentRoute}`);
	}
	return { client, attendeeId };
}
export const createClient = (cookieStore: ReturnType<typeof cookies>) => {
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
