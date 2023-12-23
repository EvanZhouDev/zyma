import { v } from "@/utils";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import MainHero from "@/components/MainHero";
import { AlertIcon } from "@primer/octicons-react";

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

	if (searchParams.class === undefined) {
		return (
			<MainHero padding={10}>
				<div className="mt-5">Could not Join this group.</div>
				<div role="alert" className="alert alert-error mt-10 mb-10">
					<AlertIcon size="medium" />
					<span>No code provided.</span>
				</div>
				Please try again, ensuring you entered the code correctly.
			</MainHero>
		);
	}

	// code not working
	const codeNotWorking = true;

	if (codeNotWorking) {
		return (
			<MainHero padding={10}>
				<div className="mt-5">Could not Attend this group.</div>
				<div role="alert" className="alert alert-error mt-10 mb-10">
					<AlertIcon size="medium" />
					<span>
						Code <b>{searchParams.class}</b> not found.
					</span>
				</div>
				Please try again, ensuring you entered the code correctly.
			</MainHero>
		);
	}

	return (
		<MainHero>
			<h1 className="mt-5 text-xl">
				Joined class with ID: {searchParams.class}
			</h1>
			<p className="mt-10 py-6 max-w opacity-50">
				It is safe to close this tab.
			</p>
		</MainHero>
	);
}
