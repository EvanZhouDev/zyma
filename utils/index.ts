import { GetResult } from "@supabase/postgrest-js/src/select-query-parser";
import { Database } from "./supabase/types";
import { GenericTable } from "@supabase/supabase-js/dist/module/lib/types";
import { GenericSchema } from "@supabase/postgrest-js/dist/module/types";

export function v<T, E>({
	data,
	error,
}: { data: T; error: null } | { data: null; error: E }): T {
	if (error !== null) {
		console.log(error);
		throw error;
	}
	return data!;
}
export function generateCode() {
	return crypto.randomUUID();
}
export function isValidCode(code: string) {
	// for now, validate that it is a uuid using regex
	return /^[\da-f]{8}-([\da-f]{4}-){3}[\da-f]{12}$/i.test(code);
}

type SchemaKeyType = keyof Database;
type TableKeyType = keyof Database[keyof Database]["Tables"];
export type RawSelect<
	SchemaName extends SchemaKeyType,
	TableName extends TableKeyType,
	Query extends string = "*",
	Schema extends GenericSchema = Database[SchemaName],
	Table extends GenericTable = Schema["Tables"][TableName],
	Relationships = Table extends { Relationships: infer R } ? R : unknown,
> = GetResult<Schema, Table["Row"], TableName, Relationships, Query>;

export type SelectPublic<
	Table extends TableKeyType,
	Query extends string = "*",
> = RawSelect<"public", Table, Query>;
