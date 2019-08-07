import * as Hapi from "@hapi/hapi";

export interface IPlugin {
  /**
   * Package definition.
   */
  pkg: any;

  /**
   * Register method.
   * @param server
   * @param options
   */
  register(server: Hapi.Server, options?: any): Promise<void>;

  /**
   * Plugin info
   */
  info(): IPluginInfo;
}

export interface IPluginInfo {
  name: string;
  version: string;
}
