import * as Hapi from "@hapi/hapi";
import * as DotEnv from "dotenv";

import Plugin from "./plugins";
import Logger from "./utils/logger";

export default class Server {
  /**
   * Instance  of server
   */
  private static _instance: Hapi.Server;

  /**
   * Starts server
   * @returns start
   */
  public static async start(): Promise<Hapi.Server> {
    try {
      DotEnv.config({
        path: `${process.cwd()}/.env`
      });
      Server._instance = new Hapi.Server({
        port: process.env.PORT || 8080
      });
      await Plugin.init(Server._instance);
      await Server._instance.start();

      Logger.info("[Server] Started");

      return Server._instance;
    } catch (error) {
      Logger.info(`[Server] Something went wrong: ${error}`);
      throw error;
    }
  }

  /**
   * Stops server
   * @returns stop
   */
  public static stop(): Promise<Error | void> {
    Logger.info(`[Server] Stopped`);
    return Server._instance.stop();
  }

  /**
   * Recycles server
   * @returns recycle
   */
  public static async recycle(): Promise<Hapi.Server> {
    Logger.info(`[Server] Recycling`);
    await Server.stop();
    return await Server.start();
  }

  /**
   * Get server instance
   * @returns instance
   */
  public static instance(): Hapi.Server {
    return Server._instance;
  }

  /**
   * Injects server
   * @param options
   * @returns inject
   */
  public static async inject(
    options: string | Hapi.ServerInjectOptions
  ): Promise<Hapi.ServerInjectResponse> {
    return await Server._instance.inject(options);
  }
}
