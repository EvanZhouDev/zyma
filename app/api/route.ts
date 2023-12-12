import { createClient } from "@/utils/supabase/middleware";
import { NextRequest } from "next/server";
import { getStudentData } from "../teacher/dashboard/actions";

export async function GET(request: NextRequest) {
	const { supabase, response } = createClient(request);
	return Response.json({
		data: getStudentData(request.nextUrl.searchParams.get("id")!),
	});
}
