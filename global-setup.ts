import type { FullConfig } from "@playwright/test";
import { exec } from "child_process";

export default async function globalSetup(config: FullConfig) {
  await new Promise<void>((resolve, reject) => {
    const childProcess = exec("supabase db reset", (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        reject(error);
      } else {
        console.log(`stdout: ${stdout}`);
        resolve();
      }
    });

    childProcess.on("error", (error) => {
      console.error(`Error: ${error.message}`);
      reject(error);
    });
  });
}
