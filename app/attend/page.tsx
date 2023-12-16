import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Excuse from "./components/Excuse";
import { v } from "@/utils";
async function getCodeFromUUID(uuid: string) {
	const cookieStore = cookies();
	const client = createClient(cookieStore);
	return v(await client.from("codes").select("id").eq("code", uuid))![0].id;
}
export default async function Page({
	searchParams,
}: { searchParams: { code: string } }) {
	const cookieStore = cookies();
	const client = createClient(cookieStore);
	const studentId = (await client.auth.getUser()).data?.user?.id;
	if (studentId == null) {
		return redirect("/");
	}

	const data = v(
		await client
			.from("attendance")
			.upsert({
				student: studentId,
				code_used: await getCodeFromUUID(searchParams.code),
			})
			.select("status"),
	)!;

	return (
		<div className="hero min-h-screen bg-neutral">
			<div className="hero-content text-center">
				<div className="max-w-md">
					<h1 className="text-5xl font-bold">You're all done.</h1>
					<p className="mt-5">
						Joined with code <br />"{searchParams.code}"
					</p>
					<Excuse
						code={searchParams.code}
						user={studentId}
						status={data[0].status}
					/>
				</div>
			</div>
		</div>
	);
}
