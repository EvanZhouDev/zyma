import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Excuse from "./components/Excuse";
import { v } from "@/utils";

export default async function Page({
	searchParams,
}: { searchParams: { code: string } }) {
	const cookieStore = cookies();
	const client = createClient(cookieStore);
	const studentId = (await client.auth.getUser()).data?.user?.id;
	if (studentId == null) {
		return redirect("/");
	}

	const { data, error } = await client
		.from("attendance")
		.upsert({
			student: studentId,
			code_used: searchParams.code,
		})
		.select("status");
	if (error != null || data === null) {
		if (error.code === "23502") {
			return (
				<div className="hero min-h-screen bg-neutral">
					<div className="hero-content text-center">
						<div role="alert" className="alert alert-error">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="stroke-current shrink-0 h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<span>No code provided</span>
						</div>
					</div>
				</div>
			);
		}
		console.assert(error.code === "23503", JSON.stringify(error));
		return (
			<div className="hero min-h-screen bg-neutral">
				<div className="hero-content text-center">
					<div role="alert" className="alert alert-error">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="stroke-current shrink-0 h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<span>Code not found</span>
					</div>
				</div>
			</div>
		);
	}

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
