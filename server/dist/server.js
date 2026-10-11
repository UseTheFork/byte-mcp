import { FastMCP } from "fastmcp";
import { CliGitRepository, registerGitTools } from "./domains/git/index.js";
import { ProcessCommandRunner, registerLintTools } from "./domains/lint/index.js";
export function createServer() {
    const server = new FastMCP({ name: "byte-mcp-server", version: "0.0.1" });
    registerGitTools(server, new CliGitRepository());
    registerLintTools(server, new ProcessCommandRunner());
    return server;
}
