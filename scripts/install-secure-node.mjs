import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";

const archives = {
    arm64: "f7a1e486dbc8b286847815b477d4fb5e9fb963ed4489c3e1588853d685f589f9",
    x64: "b8492284c76a54baf58d61668dd0e41ee0fc98adabf9503d30f05d08f55b4406",
};
if (process.platform !== "linux" || !archives[process.arch]) {
    throw new Error(`No verified Node bootstrap for ${process.platform}/${process.arch}`);
}
const destination = process.argv[2] || "/tmp/zyma-secure-node";
const archive = join(destination, "node.tar.gz");
const response = await fetch(`https://nodejs.org/dist/v22.23.4/node-v22.23.4-linux-${process.arch}.tar.gz`);
if (!response.ok) throw new Error(`Node download failed: HTTP ${response.status}`);
const data = Buffer.from(await response.arrayBuffer());
// The pinned digest authenticates this bootstrap even before the host runtime is patched.
if (createHash("sha256").update(data).digest("hex") !== archives[process.arch]) {
    throw new Error("Node archive SHA256 mismatch");
}
await mkdir(destination, { recursive: true });
await writeFile(archive, data);
execFileSync("tar", ["-xzf", archive, "--strip-components=1", "-C", destination]);
await rm(archive);
const executable = join(destination, "bin", "node");
if (execFileSync(executable, ["--version"], { encoding: "utf8" }).trim() !== "v22.23.4") {
    throw new Error("Unexpected Node version");
}
console.log(`Verified Node 22.23.4 installed at ${executable}`);
