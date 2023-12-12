import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export default async function TeacherLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const cookieStore = cookies();
	const client = createClient(cookieStore);
	if ((await client.auth.getUser()).data.user?.id == null) {
		return redirect("/");
	}
	return <>{children}</>;
}
