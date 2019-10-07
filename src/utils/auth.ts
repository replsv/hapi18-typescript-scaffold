import * as Hapi from "@hapi/hapi";
import * as Boom from "@hapi/boom";
import { isUndefined } from "lodash";
import Logger from "../utils/logger";
import Axios, { AxiosInstance, AxiosResponse } from "axios";
import { AuthCredentials } from "hapi";

const projectDef: any = require(`${process.cwd()}/package.json`);

// Headers to be checked -> determine context
const headers: { [key: string]: string[] } = {
  customer: ["x-jwt", "x-apikey"],
  service: ["x-ns-service"]
};

const config: Hapi.ServerAuthConfig = {
  mode: "required"
};

export const createHttpClient = (headers: any = {}): AxiosInstance => {
  return Axios.create({
    baseURL: process.env.AUTH_BASE_URL,
    headers: {
      ...headers,
      "User-Agent": `${projectDef.name}/${projectDef.version}`
    }
  });
};

export const signPayload = (payload: any): Promise<AxiosResponse> =>
  createHttpClient().post("/v1/jwt", payload);

const getCustomerByHeaders = (
  action: string,
  headers: [{ key: string; value: string }],
  request: Hapi.Request
): Promise<AxiosResponse> =>
  createHttpClient(headers).post("/v1/permissions/grant", {
    action,
    context: { query: request.query, params: request.params }
  });

const scheme = (
  server: Hapi.Server,
  options?: any
): Hapi.ServerAuthSchemeObject => {
  return {
    async authenticate(
      request: Hapi.Request,
      h: Hapi.ResponseToolkit
    ): Promise<Hapi.Lifecycle.ReturnValue> {
      try {
        const requestHeaders = request.headers;
        const context: { [key: string]: any } = {};
        const routeSettings: Hapi.RouteSettings = request.route.settings;
        const routePlugins: any = routeSettings.plugins;
        const authAttributes: any = !isUndefined(routePlugins["ns-auth"])
          ? routePlugins["ns-auth"].auth
          : null;
        if (!authAttributes) {
          return Boom.internal(
            `Route ${request.url} is badly configured - missing config for auth schema.`
          );
        }

        const action: string = authAttributes.action;
        const authHeaders: any = {};
        let credentials: AuthCredentials = {};

        // check context
        Object.keys(headers).forEach((contextId: string) => {
          const contextHeaders: string[] = headers[contextId];
          let found: boolean = false;
          contextHeaders.forEach(contextHeader => {
            found = found || !isUndefined(requestHeaders[contextHeader]);
            if (requestHeaders[contextHeader]) {
              authHeaders[contextHeader] = requestHeaders[contextHeader];
            }
          });
          if (found) {
            context["contextId"] = contextId;
          }
        });

        if (context.contextId === "service") {
          Logger.info(
            `Service ${requestHeaders["x-ns-service"]} authorized access to ${requestHeaders["x-customer-id"]} with ${action} action `
          );
          credentials = {
            user: {
              service: requestHeaders["x-ns-service"],
              customerId: requestHeaders["x-customer-id"],
              extra: {
                allowAll: true // each service has the allow-all policy
              }
            }
          };
        } else if (context.contextId === "customer") {
          const authRequest: AxiosResponse = await getCustomerByHeaders(
            action,
            authHeaders,
            request
          );
          if (!authRequest.data.granted) {
            Logger.info(
              authRequest.data.customerInfo
                ? `Customer ${authRequest.data.customerInfo.id} tried to access ${request.url} - insufficient permissions -> ${action}`
                : `Request with headers ${JSON.stringify(
                    authHeaders
                  )} tried to ${request.url} - cannot determine customer`
            );
            return Boom.unauthorized();
          }
          credentials.user = {
            ...authRequest.data.customerInfo,
            tokenInfo: authRequest.data.tokenInfo,
            extra: authRequest.data.extra
          };
        } else {
          throw new Error("Missing context");
        }

        return h.authenticated({ credentials });
      } catch (err) {
        if (err.isAxiosError && err.response) {
          switch (err.response.status) {
            case 404:
            case 403:
            case 401:
            case 500:
              return Boom.notFound(`Auth: ${err.message}`);
            default:
              return Boom.badRequest(`Auth: ${err.message}`);
          }
        } else {
          Logger.error(err.message);
        }
        return Boom.badRequest(`Auth: Something went wrong.`);
      }
    }
  };
};

export default async (server: Hapi.Server) => {
  // register auth scheme and strategy - im_auth
  server.auth.scheme("ns-auth", scheme);
  server.auth.strategy("ns-auth", "ns-auth", config);
};
