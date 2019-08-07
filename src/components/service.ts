import * as Hapi from "@hapi/hapi";

export default interface IService {
  init(server?: Hapi.Server): Promise<any>;
}
