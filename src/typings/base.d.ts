interface IPlugin<T> {
  /**
   * Package definition.
   */
  pkg: any;

  /**
   * Register method.
   * @param server
   * @param options
   */
  register(server: T, options?: any): Promise<void>;

  /**
   * Plugin info
   */
  info(): IPluginInfo;
}

interface IPluginInfo {
  name: string;
  version: string;
}

interface IRouter<T> {
  /**
   * Register router methods.
   * @param server
   */
  register(server: T): Promise<any>;
}

interface IService<T> {
  /**
   * Expose on server flag.
   */
  shouldExpose: boolean;

  /**
   * Init service.
   * @param server
   * @param options
   */
  init(server: T, options?: any): Promise<any>;
}
