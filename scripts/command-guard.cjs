const { deny, allow } = require("./lib/hook-response.cjs");

function tokenize(command) {
  const tokens = [];
  let token = "";
  let quote = null;
  let escaped = false;
  let tokenStarted = false;

  for (const character of command) {
    if (character === "\n" || character === "\r") {
      return null;
    }

    if (escaped) {
      if (quote === '"' && (character === "$" || character === "`")) {
        return null;
      }

      token += character;
      escaped = false;
      tokenStarted = true;
      continue;
    }

    if (quote === "'") {
      if (character === "'") {
        quote = null;
      } else {
        token += character;
      }

      continue;
    }

    if (quote === '"') {
      if (character === '"') {
        quote = null;
      } else if (character === "\\") {
        escaped = true;
      } else if (character === "$" || character === "`") {
        return null;
      } else {
        token += character;
      }

      continue;
    }

    if (/\s/.test(character)) {
      if (tokenStarted) {
        tokens.push(token);
        token = "";
        tokenStarted = false;
      }

      continue;
    }

    if (character === "'" || character === '"') {
      quote = character;
      tokenStarted = true;
      continue;
    }

    if (character === "\\") {
      escaped = true;
      tokenStarted = true;
      continue;
    }

    if (/[;&|<>`()$`]/.test(character)) {
      return null;
    }

    token += character;
    tokenStarted = true;
  }

  if (quote !== null || escaped) {
    return null;
  }

  if (tokenStarted) {
    tokens.push(token);
  }

  return tokens;
}

function parseAllowedCommands(value) {
  if (typeof value !== "string") {
    return [];
  }

  return value
    .split(",")
    .map((entry) => tokenize(entry.trim()))
    .filter((tokens) => tokens !== null && tokens.length > 0);
}

const allowedCommands = parseAllowedCommands(process.env.ALLOWED_COMMANDS);
const allowedCommandsDescription =
  allowedCommands.map((tokens) => tokens.join(" ")).join(", ") || "none configured";

function isAllowedCommand(command) {
  const tokens = tokenize(command);

  if (!tokens || tokens.length === 0) {
    return false;
  }

  return allowedCommands.some((allowedTokens) =>
    allowedTokens.every((token, index) => tokens[index] === token),
  );
}

let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  input += chunk;
});
process.stdin.on("end", () => {
  try {
    const event = JSON.parse(input);
    const command = event.tool_input?.command;

    if (event.tool_name !== "execute/runInTerminal") {
      allow();
      return;
    }

    if (!isAllowedCommand(command)) {
      deny(
        "PreToolUse",
        `This agent only permits these commands: ${allowedCommandsDescription}. Please check your command and try again.`,
      );
    } else {
      allow();
    }
  } catch {
    deny("PreToolUse", "The command could not be validated by this agent, so it was blocked.");
  }
});
