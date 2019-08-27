import * as Hapi from "@hapi/hapi";

import Config from "../config";
import Logger from "../utils/logger";

import * as HapiSwaggerPlugin from "hapi-swagger";

/**
 * Init all plugins.
 * @param server
 */
const init = async (server: Hapi.Server): Promise<Error | any> => {
  await registerSwagger(server);
};

/**
 * Register Swagger-UI
 * @param server
 */
const registerSwagger = async (server: Hapi.Server): Promise<Error | any> => {
  try {
    Logger.plugin.info("Registering swagger-ui");

    await register(server, [
      {
        options: Config.swagger.options,
        plugin: HapiSwaggerPlugin
      },
      require("@hapi/inert"),
      require("@hapi/vision")
    ]);
  } catch (error) {
    Logger.info(`Something went wrong: ${error}`);
  }
};

/**
 * Register plugin.
 * @param server
 * @param plugin
 */
const register = (server: Hapi.Server, plugin: any): Promise<void> => {
  Logger.plugin.debug(`Registering: ${JSON.stringify(plugin)}`);
  return new Promise((resolve, reject) => {
    server.register(plugin);
    resolve();
  });
};

export default init;
