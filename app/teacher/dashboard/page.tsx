import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Dashboard from "./components/Dashboard";

// import { useEffect } from "react";

export default async function Page() {
	const cookieStore = cookies();
	const client = createClient(cookieStore);
	if ((await client.auth.getUser()).data?.user?.id == null) {
		return redirect("/");
	}
	const { data: classes, error } = await client
		.from("classes")
		.select("name, id")
		.eq("admin", (await client.auth.getUser()).data.user!.id);
	if (error) {
		console.log(error);
		return <p>An error occured</p>;
	}
	return <Dashboard classes={classes} />;
}
