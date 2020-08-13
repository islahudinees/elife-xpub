/**
 * # xpub-api
 * A series of test helpers for the elife-xpub api. These will be (tested against/generated by
 * the graphql stuff).
 *
 * This'll export helper functions to connect to the various endpoints when in a dockerised
 * environment
 */

import { Option, Some } from "funfix";
import { UserIdentity, defaultTestUser } from "../services/user";

/**
 * An object with this type is passed into each test helper, meaning each helper has access to global values
 */
export interface ApiTestContext {
  state: TestState;
  /**
   * TODO: Create a user object
   */
  user: {};
}

export interface TestState {
  /**
   * This should come from the git version of the repo
   */
  api_version: string;
  connection: ConnectionInfo;

  /**
   * The user identity
   */
  user: UserIdentity;
}

export interface ConnectionInfo {
  /**
   * The base url of the application
   */
  graphql_url: string;

  /**
   * The `Authorization` header for the requests that are made
   * TODO: Move data related to the current user into a different provision method
   * TODO: make this overridable somehow
   */
  authorization: Option<string>;

  /**
   * Any other headers used for all requests
   */
  headers: object;

}

/**
 * A `GqlChunk` contains helper functions to call the mutations, queries and subscriptions
 * for a given module
 */
export interface GqlChunk {
  Query: { [key: string]: <T>(arg0: ApiTestContext, args?: any) => T};
  Mutation: { [key: string]: <T>(arg0: ApiTestContext, args?: any) => T};
  Subscription: { [key: string]: <T>(arg0: ApiTestContext, args?: any) => T};
}

/**
 * Gives the right config when running alongside the app in a local environment
 */
export const defaultConfig = (): ApiTestContext => ({
  state: {
    api_version: "0",
    user: defaultTestUser,
    connection: {
      graphql_url: "http://app:3000/graphql",
      authorization: Some("Bearer ").map((t) => t + defaultTestUser.token),
      headers: {},
    },
  },
  user: {},
});