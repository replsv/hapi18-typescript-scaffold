import * as Winston from "winston";

export class Logger {
  /**
   * Init logger
   * @returns init
   */
  public static init(): Winston.Logger {
    // @todo maybe read from dotenv properties?
    return Winston.createLogger({
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
  }
}

export default Logger.init();
