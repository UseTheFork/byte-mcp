import { FastMCP } from "fastmcp";
import { CliGitRepository, registerGitTools } from "./domains/git/index.js";
import { ProcessCommandRunner, registerLintTools } from "./domains/lint/index.js";

export function createServer(): FastMCP {
  const server = new FastMCP({ name: "byte-mcp-server", version: "1.0.0" });

  registerGitTools(server, new CliGitRepository());
  // registerLintTools(server, new ProcessCommandRunner());

  return server;
}
