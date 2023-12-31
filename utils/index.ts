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
