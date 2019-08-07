import * as Hapi from "@hapi/hapi";

export default interface IRouter {
  register(server: Hapi.Server): Promise<any>;
}
