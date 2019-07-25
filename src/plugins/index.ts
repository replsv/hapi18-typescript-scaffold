import * as Hapi from "@hapi/hapi";

import Config from "../config";
import Logger from "../utils/logger";

export default class Plugins {
  /**
   * Inits plugins
   * @param server
   * @returns init
   */
  public static async init(server: Hapi.Server): Promise<Error | any> {
    await Plugins.swagger(server);
  }

  /**
   * Registers plugins
   * @param server
   * @param plugin
   * @returns register
   */
  private static register(server: Hapi.Server, plugin: any): Promise<void> {
    Logger.debug(`[Plugins] Registering:${JSON.stringify(plugin)}`);
    return new Promise((resolve, reject) => {
      server.register(plugin);
      resolve();
    });
  }

  /**
   * Swagger UI.
   * @param server
   * @returns swagger
   */
  public static async swagger(server: Hapi.Server): Promise<Error | any> {
    try {
      Logger.info("[Plugins] Registering swagger-ui");

      await Plugins.register(server, [
        {
          options: Config.swagger.options,
          plugin: require("hapi-swagger")
        },
        require("@hapi/vision"), // no config
        require("@hapi/inert") // no config
      ]);
    } catch (error) {
      Logger.info(`[Plugins] Something went wrong: ${error}`);
    }
  }
}
