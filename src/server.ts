import * as Hapi from "@hapi/hapi";
import * as DotEnv from "dotenv";

DotEnv.config({
  path: `${process.cwd()}/.env`
});

import RegisterPlugins from "./plugins";
import Logger from "./utils/logger";

let instance: Hapi.Server;

const start = async (): Promise<Hapi.Server> => {
  try {
    instance = new Hapi.Server({
      port: process.env.PORT || 8080
    });
    await RegisterPlugins(instance);
    await instance.start();
    Logger.server.info("Started");
    return instance;
  } catch (error) {
    Logger.info(`Something went wrong: ${error}`);
    throw error;
  }
};

const stop = (): Promise<Error | void> => {
  Logger.server.info(`Stopped`);
  return instance.stop();
};

const recycle = async (): Promise<Hapi.Server> => {
  Logger.server.info(`Recycling`);
  await stop();
  return await start();
};

const inject = async (
  options: string | Hapi.ServerInjectOptions
): Promise<Hapi.ServerInjectResponse> => {
  return await instance.inject(options);
};

export default {
  start,
  stop,
  recycle,
  inject
};
