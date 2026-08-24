/**
 * GENERATED FILE — do not edit.
 *
 * Emitted from provider/manifest.json by weaver's generator.
 * A hand-edit here is destroyed by the next protocol sync, which is worse than
 * being rejected, because it works until it silently does not. Fix
 * provider/manifest.json (or weaver's template/) and regenerate:
 *
 *     npm run provider -- facebook_pages
 */

/**
 * Facebook Pages, as one service descriptor shared by every Facebook Pages
 * operation.
 *
 * @particle-academy/fancy-connector-core carries what is true of ALL
 * connectors. This carries what is true of Facebook Pages: its base URL, its
 * auth scheme, its idempotency header, and its faker.
 *
 * ## The sandbox trap, written down where it is used
 *
 * Facebook has no sandbox for Pages. Anything this publishes appears on a real
 * Page to real followers, and deleting it afterwards does not un-notify them.
 * Point it at a Page you own and have muted before pointing it at anything
 * else.
 */

import type { ConnectorMode, PreparedRequest, ServiceDescriptor } from "@particle-academy/fancy-connector-core";

import { facebookPagesFaker } from "./faker.js";
import { createHmac } from "node:crypto";

/**
 * The connector API version this package was GENERATED against.
 *
 * A literal, never imported. An imported constant lets an upgrade rewrite the
 * very claim it exists to detect, after which the copy agrees with itself
 * forever.
 */
export const CONNECTOR_API_VERSION = 1;

export const FACEBOOK_PAGES_BASE_URLS = {
  "live": "https://graph.facebook.com/v21.0"
} as const;

/** Credential keys a remote call cannot proceed without. */
export const FACEBOOK_PAGES_REQUIRES = [
  "pageAccessToken",
  "appSecret",
  "clientId",
  "clientSecret"
] as const;

/**
 * Apply Facebook Pages's auth scheme to an outgoing request.
 *
 * Meta takes the token as a QUERY PARAMETER rather than a bearer header. It
 * accepts the header too, but the query form is what its own documentation and
 * every error message use, and appsecret_proof has to go in the query
 * regardless -- so putting both in one place keeps the request readable in a
 * log.
 *
 * The mode is passed in because for some providers auth and estate are the
 * same decision expressed in the URL; here it is unused, and saying so is
 * cheaper than wondering later whether it was forgotten.
 */
export function facebookPagesAuthorize(
  credentials: Record<string, string | undefined>,
  request: PreparedRequest,
  _mode: ConnectorMode,
): void {
  const url = new URL(request.url);

  url.searchParams.set("access_token", String(credentials.pageAccessToken ?? ""));

  const proof = createHmac("sha256", String(credentials.appSecret ?? ""))
    .update(String(credentials.pageAccessToken ?? ""))
    .digest("hex");

  url.searchParams.set("appsecret_proof", proof);
  request.url = url.toString();
}

/** The Facebook Pages service, for the TypeScript runtime. */
export const FACEBOOK_PAGES: ServiceDescriptor = {
  service: "facebook_pages",
  title: "Facebook Pages",
  sandbox: "none",
  baseUrls: { ...FACEBOOK_PAGES_BASE_URLS },
  requires: [...FACEBOOK_PAGES_REQUIRES],
  authorize: facebookPagesAuthorize,
  faker: facebookPagesFaker,
};
