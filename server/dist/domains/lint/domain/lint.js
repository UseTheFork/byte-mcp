import { languageOf } from "./language.js";
const FILES_PLACEHOLDER = "{files}";
// An argument equal to "{files}" is replaced by the file list; otherwise files are appended.
export function buildArgv(command, files) {
    if (!command.includes(FILES_PLACEHOLDER))
        return [...command, ...files];
    return command.flatMap((arg) => (arg === FILES_PLACEHOLDER ? files : [arg]));
}
function handles(command, file) {
    if (command.languages.length === 0)
        return true;
    const language = languageOf(file);
    return language !== undefined && command.languages.some((l) => l.toLowerCase() === language);
}
export function planLintRuns(commands, files) {
    const covered = new Set();
    const plans = [];
    for (const command of commands) {
        const matching = files.filter((file) => handles(command, file));
        if (!matching.length)
            continue;
        matching.forEach((file) => covered.add(file));
        plans.push({ argv: buildArgv(command.command, matching), files: matching });
    }
    return { plans, unmatched: files.filter((file) => !covered.has(file)) };
}
