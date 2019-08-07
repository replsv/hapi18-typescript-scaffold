import * as Hapi from "@hapi/hapi";

export default interface IRouter {
  /**
   * Register router methods.
   * @param server
   */
  register(server: Hapi.Server): Promise<any>;
}
