import * as Hapi from "@hapi/hapi";

export default interface IService {
  /**
   * Expose on server flag.
   */
  shouldExpose: boolean;

  /**
   * Init service.
   * @param server
   * @param options
   */
  init(server?: Hapi.Server, options?: any): Promise<any>;
}
