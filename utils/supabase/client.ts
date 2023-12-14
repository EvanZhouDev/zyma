import { createBrowserClient } from "@supabase/ssr";

export const createClient = async () => {
	const client = createBrowserClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
	);
	await client.auth.getSession();
	return client;
};
