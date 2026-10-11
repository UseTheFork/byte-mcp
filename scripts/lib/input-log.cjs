const fs = require("node:fs");
const path = require("node:path");

// TODO: This needs to use an env var referencing the workspace.
const LOG_FILE = path.join(__dirname, "..", "command-guard.log");

function logInput(input) {
  try {
    fs.appendFileSync(LOG_FILE, `${new Date().toISOString()} ${input}\n`);
  } catch {
    // Logging must never block the guard.
  }
}

module.exports = { logInput };
