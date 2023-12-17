export function v<T, E>({ data, error }: { data: T; error?: E }): T {
	if (error !== null) {
		console.log(error);
		throw error;
	}
	return data;
}
