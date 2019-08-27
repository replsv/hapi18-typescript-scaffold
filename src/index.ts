import Server from "./server";
import Logger from "./utils/logger";

(async () => {
  await Server.start();
})();

// Global listeners
process
  .on("SIGINT", () => {
    Logger.server.info("Stopping server");
    Server.stop().then(err => {
      Logger.process.info(`Server stopped`);
      process.exit(err ? 1 : 0);
    });
  })
  // setTimeout -> for Sentry logging otherwise nada gets logged
  .on("unhandledRejection", err => {
    Logger.process.error("Unhandled Rejection at Promise", { err });
    setTimeout(() => {
      process.exit(1);
    }, 3000);
  })
  .on("uncaughtException", err => {
    Logger.process.crit("Uncaught Exception thrown", { err });
    setTimeout(() => {
      process.exit(1);
    }, 3000);
  });
