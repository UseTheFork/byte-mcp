import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import { initConfig } from "@/shared/config.js";
import { createServer } from "./server.js";

async function run() {
  const config = initConfig();
  const server = createServer();
  await server.connect(new StdioServerTransport());
  console.error(`Byte MCP Server running on stdio (workspace: ${config.workspaceDir})`);
}

run().catch((error) => {
  console.error("Fatal error starting server:", error);
  process.exit(1);
});
