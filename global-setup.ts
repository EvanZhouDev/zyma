import { exec } from "child_process";
import type { FullConfig } from "@playwright/test";

export default async function globalSetup(_: FullConfig) {
	await new Promise<void>((resolve, reject) => {
		const childProcess = exec("supabase db reset", (error, stdout, _) => {
			if (error) {
				console.error(`Error: ${error.message}`);
				reject(error);
			} else {
				// console.log(`stdout: ${stdout}`);
				resolve();
			}
		});

		childProcess.on("error", (error) => {
			console.error(`Error: ${error.message}`);
			reject(error);
		});
	});
}
