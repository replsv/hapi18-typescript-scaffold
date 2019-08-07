import Server from "./server";
import Logger from "./utils/logger";

(async () => {
  await Server.start();
})();

// Global listeners
process
  .on("SIGINT", () => {
    Logger.info("Stopping server");
    Server.stop().then(err => {
      Logger.info(`Server stopped`);
      process.exit(err ? 1 : 0);
    });
  })
  .on("unhandledRejection", (reason, p) => {
    Logger.error("Unhandled Rejection at Promise", reason);
    Server.recycle().then(err => {
      Logger.info(`Server recycled`);
      process.exit(err ? 1 : 0);
    });
  })
  .on("uncaughtException", err => {
    Logger.error("Uncaught Exception thrown");
    process.exit(1);
  });
