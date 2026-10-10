import { McpServer } from "@modelcontextprotocol/server";
import { CliGitRepository, registerGitTools } from "./domains/git/index.js";

export function createServer(): McpServer {
  const server = new McpServer(
    { name: "byte-mcp-server", version: "1.0.0" },
    { capabilities: { tools: {} } },
  );

  registerGitTools(server, new CliGitRepository());

  return server;
}
