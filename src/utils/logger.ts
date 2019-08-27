import * as Winston from "winston";
import Sentry from "./sentry";

const logger = Winston.createLogger({
  transports: [
    new Winston.transports.Console({
      format: Winston.format.combine(
        Winston.format.colorize(),
        Winston.format.timestamp(),
        Winston.format.printf(info => {
          const { timestamp, level, message, ...args } = info;
          const ts = timestamp.slice(0, 19).replace("T", " ");
          return `${ts} [${level}]: ${message} ${
            Object.keys(args).length ? JSON.stringify(args, null, 2) : ""
          }`;
        })
      )
    })
  ]
});

const createLoggingHelper = (channel?: string) => {
  const prefix = channel ? `[${channel}] ` : "";
  return {
    debug(message: string, ...meta: any[]) {
      if (process.env.NODE_ENV !== "production") {
        logger.debug(`${prefix}${message}`, ...meta);
      }
    },
    info(message: string, ...meta: any[]) {
      logger.info(`${prefix}${message}`, ...meta);
    },
    warn(message: string, ...meta: any[]) {
      logger.warn(`${prefix}${message} `, ...meta);
    },
    error(message: string, ...meta: any[]) {
      logger.error(`${prefix}${message}`, ...meta);
      Sentry.captureEvent({
        message,
        extra: { ...meta, level: "error", channel }
      });
    },
    crit(message: string, ...meta: any[]) {
      logger.crit(`${prefix}${message}`, ...meta);
      Sentry.captureEvent({
        message,
        extra: { ...meta, level: "critical", channel }
      });
    }
  };
};

export default {
  process: createLoggingHelper("PROCESS"),
  server: createLoggingHelper("SERVER"),
  plugin: createLoggingHelper("PLUGIN"),
  ...createLoggingHelper()
};
