import { GetResult } from "@supabase/postgrest-js/src/select-query-parser";
import { Database } from "./supabase/types";
import {
	GenericSchema,
	GenericTable,
} from "@supabase/supabase-js/dist/module/lib/types";

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
type ViewKeyType = keyof Database[keyof Database]["Views"];
export type RawSelect<
	SchemaName extends SchemaKeyType,
	TableName extends TableKeyType | ViewKeyType,
	Query extends string = "*",
	Schema extends GenericSchema = Database[SchemaName],
	Table extends Pick<GenericTable, "Row"> = TableName extends TableKeyType
		? Schema["Tables"][TableName]
		: Schema["Views"][TableName],
	Relationships = Table extends { Relationships: infer R } ? R : unknown,
> = GetResult<Schema, Table["Row"], TableName, Relationships, Query>;

export type SelectPublic<
	Table extends TableKeyType | ViewKeyType,
	Query extends string = "*",
> = RawSelect<"public", Table, Query>;

// export function getClosestDate(dates: Date[], target: Date) {
// 	return dates.reduce((prev, curr) => {
// 		return Math.abs(curr.getTime() - target.getTime()) <
// 			Math.abs(prev.getTime() - target.getTime())
// 			? curr
// 			: prev;
// 	});
// }
export function getLatestDate(dates: Date[]) {
	return new Date(Math.max(...dates.map((d) => d.getTime())));
}
export function toISOStringWithoutMilliseconds(date: Date) {
	return `${date.toISOString().split(".")[0]}Z`;
}
