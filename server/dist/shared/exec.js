import { execFile } from "node:child_process";
// execFile (no shell) so arguments are never interpreted as shell syntax.
export function run(command, args, cwd) {
    return new Promise((resolve, reject) => {
        execFile(command, args, { cwd, encoding: "utf8" }, (error, stdout, stderr) => {
            if (error && typeof error.code !== "number") {
                reject(error);
                return;
            }
            resolve({ stdout, stderr, exitCode: typeof error?.code === "number" ? error.code : 0 });
        });
    });
}
