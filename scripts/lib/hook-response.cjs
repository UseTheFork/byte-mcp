// Common Properties in hookSpecificOutput
// ---
// Property: permissionDecision
// Used In Events: PreToolUse
// Description: Controls whether to allow or deny a tool call (e.g., "deny" with a permissionDecisionReason).
//
// Property: updatedToolOutput
// Used In Events: PostToolUse
// Description: Replaces or truncates the tool output seen by the model or transcript.
//
// Property: displayContent
// Used In Events: MessageDisplay
// Description: Transforms or hides assistant message text on the screen without altering what the model actually sees.
//
// Property: additionalContext
// Used In Events: SessionStart, PreToolUse, etc.
// Description: Injects extra context or notes directly into the agent's prompt stream.
//
// Property: decision
// Used In Events: PermissionRequest
// Description: Automatically answers permission prompts (e.g., {"behavior": "allow"}).

function deny(hookEventName, reason) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName,
        permissionDecision: "deny",
        permissionDecisionReason: reason,
      },
    }),
  );
}

function allow() {
  process.stdout.write(JSON.stringify({ continue: true }));
}

function sendContext(hookEventName, additionalContext) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName,
        additionalContext,
      },
    }),
  );
}

module.exports = { deny, allow, sendContext };
