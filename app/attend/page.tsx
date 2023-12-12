import Icon from "@/components/Icon";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Excuse from "./components/Excuse";

export default async function Page({ searchParams }) {
	const cookieStore = cookies();
	const client = createClient(cookieStore);
	if ((await client.auth.getUser()).data?.user?.id == null) {
		return redirect("/");
	}
	const studentId = (await client.auth.getUser()).data?.user?.id;

	const { data, error } = await client
		.from("attendance")
		.insert([
			{
				student: studentId,
				code_used: searchParams.code,
			},
		])
		.select("status");
	console.log(data, error);

	return (
		<div className="hero min-h-screen bg-neutral">
			<div className="hero-content text-center">
				<div className="max-w-md">
					<h1 className="text-5xl font-bold">You're all done.</h1>
					<p className="mt-5">Joined with code "{searchParams.code}"</p>
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
