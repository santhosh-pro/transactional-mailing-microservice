import config from "config";
import { Server } from "http";
import { app } from "./app";

const port = config.get("app.serverPort");

async function main() {
  const server = app.listen(port, () =>
    console.log(`App listening on port ${port}`)
  );

  process.on("SIGINT", shutdown.bind(null, server));
  process.on("SIGTERM", shutdown.bind(null, server));
}

function shutdown(server: Server) {
  console.log("Received kill signal, shutting down gracefully");
  server.close(() => {
    console.debug("HTTP server closed");
    process.exit(0);
  });

  setTimeout(() => {
    console.error(
      "Could not close connections in time, forcefully shutting down"
    );
    process.exit(1);
  }, 30000);
}

main().catch((e) => {
  console.error(e);
  process.exit();
});
