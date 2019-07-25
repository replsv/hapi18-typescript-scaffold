import * as Hapi from "hapi";

export default interface IService {
  init(server?: Hapi.Server): Promise<any>;
}
