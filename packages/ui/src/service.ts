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
 * Facebook Pages's identity on the authoring surface, shared by every Facebook
 * Pages node.
 *
 * This file must import nothing from the js package: a PHP or Python project
 * installs the ui package and never that one, and the import would be a
 * dangling module the moment it did.
 *
 * ## The sandbox trap
 *
 * Facebook has no sandbox for Pages. Anything this publishes appears on a real
 * Page to real followers, and deleting it afterwards does not un-notify them.
 * Point it at a Page you own and have muted before pointing it at anything
 * else.
 */

import type { ConnectorMeta } from "@particle-academy/fancy-flow/connectors";

/**
 * The connector API version this package was GENERATED against.
 *
 * A literal, never imported — an imported constant lets an upgrade rewrite the
 * very claim it exists to detect.
 */
export const CONNECTOR_API_VERSION = 1;

/** The parts of a connector's identity that belong to the SERVICE, not the node. */
export const FACEBOOK_PAGES_SERVICE = {
  service: "facebook_pages",
  serviceTitle: "Facebook Pages",
  domain: "marketing",
  sandbox: "none",
} as const satisfies Pick<ConnectorMeta, "service" | "serviceTitle" | "domain" | "sandbox">;

/** The credentials a Facebook Pages connection holds. */
export const FACEBOOK_PAGES_CREDENTIALS = [
  {
    "key": "clientId",
    "label": "App ID",
    "scope": "provider",
    "secret": false,
    "help": "From the Meta app dashboard. ONE value for the whole installation."
  },
  {
    "key": "clientSecret",
    "label": "App secret (OAuth)",
    "scope": "provider",
    "secret": true,
    "help": "The same app's client secret, used to exchange the authorization code."
  },
  {
    "key": "appSecret",
    "label": "App secret (proof)",
    "scope": "provider",
    "secret": true,
    "help": "Keys the appsecret_proof HMAC. It is never sent -- it proves the token rather than accompanying it. For a standard Meta app this is the same value as the OAuth client secret; it is declared separately because they are different ROLES, and an app that rotates one without the other should not silently break the other."
  },
  {
    "key": "pageAccessToken",
    "label": "Page access token",
    "scope": "account",
    "secret": true,
    "help": "PER PAGE, not per user. Obtained by exchanging a user token for a page token; a long-lived one lasts about 60 days and is re-authorised rather than refreshed."
  }
] as const;

/**
 * The OAuth2 exchange Facebook Pages requires — DECLARED here, performed by
 * the host.
 *
 * A consent screen needs a browser, a redirect URI and somewhere to persist
 * the result, and all three belong to the host; a package that ran the dance
 * itself would have to own a web server. So this says precisely enough for a
 * host to do it.
 *
 * The access token lasts 5184000 seconds. A host that never refreshes will
 * work all afternoon and be broken by morning, which is why the lifetime is
 * stated rather than left to be discovered.
 */
export const FACEBOOK_PAGES_OAUTH = {
  "flow": "authorization_code",
  "authorizeUrl": "https://www.facebook.com/v21.0/dialog/oauth",
  "tokenUrl": "https://graph.facebook.com/v21.0/oauth/access_token",
  "scopes": [
    "pages_manage_posts",
    "pages_read_engagement"
  ],
  "accessTokenCredential": "pageAccessToken",
  "refreshTokenCredential": null,
  "accessTokenTtlSeconds": 5184000
} as const;

/** Build a Facebook Pages node's connector metadata from the operation it performs. */
export function facebookPagesMeta(
  role: ConnectorMeta["role"],
  operation: string,
  docs: string,
): ConnectorMeta {
  return { ...FACEBOOK_PAGES_SERVICE, role, operation, docs };
}
