import { initConfig } from "@/shared/config.js";
import { createServer } from "./server.js";

async function run() {
  initConfig();
  const server = createServer();
  server.start({
    transportType: "stdio",
  });
}

run().catch((error) => {
  console.error("Fatal error starting server:", error);
  process.exit(1);
});
