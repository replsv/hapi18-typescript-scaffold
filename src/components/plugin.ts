import * as Hapi from "@hapi/hapi";

export interface IPlugin {
  register(server: Hapi.Server, options?: any): Promise<void>;
  info(): IPluginInfo;
}

export interface IPluginInfo {
  name: string;
  version: string;
}
