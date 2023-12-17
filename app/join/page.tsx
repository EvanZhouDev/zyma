import { v } from "@/utils";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Join({
	searchParams,
}: {
	searchParams: { class: number };
}) {
	const cookieStore = cookies();
	const client = createClient(cookieStore);
	const student = (await client.auth.getUser()).data?.user?.id;
	if (student == null) {
		return redirect("/");
	}

	const data = v(
		await client
			.from("students")
			.insert([{ student, class: searchParams.class }])
			.select(),
	);

	if (data == null) {
		return <p>An error has occured</p>;
	}

	return (
		<div className="hero min-h-screen bg-neutral">
			<div className="hero-content text-center">
				<div className="max-w-md">
					<h1 className="text-5xl font-bold">Joined class.</h1>
					<p className="py-6 max-w opacity-50">It is safe to close this tab.</p>
				</div>
			</div>
		</div>
	);
	// TODO: Mark type of attendence
	// return <p>You have successfully joined</p>;
}
