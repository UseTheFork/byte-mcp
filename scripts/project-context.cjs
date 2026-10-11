const packageJson = require("../../package.json");
const { sendContext } = require("./lib/hook-response.cjs");

sendContext("SessionStart", `Project: ${packageJson.name} ${packageJson.version}`);
