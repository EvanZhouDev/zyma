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
