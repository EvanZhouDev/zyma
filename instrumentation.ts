export async function register() {
	if (process.env.NEXT_RUNTIME === "nodejs") {
		const { installEmudhraDistrust } = await import("./utils/emudhra-default-ca.mjs");
		installEmudhraDistrust();
	}
}
