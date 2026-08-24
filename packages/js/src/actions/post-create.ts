/**
 * GENERATED FILE — do not edit.
 *
 * Emitted from provider/actions/post-create.json by weaver's generator.
 * A hand-edit here is destroyed by the next protocol sync, which is worse than
 * being rejected, because it works until it silently does not. Fix
 * provider/actions/post-create.json (or weaver's template/) and regenerate:
 *
 *     npm run provider -- facebook_pages
 */

/**
 * Publish a post to a Facebook Page.
 *
 * POST /{pageId}/feed —
 * https://developers.facebook.com/docs/graph-api/reference/page/feed/#publish
 *
 * Notice what is NOT here: no key, no base URL, no mode check, no retry loop,
 * no fake/real branch. This describes the request; callConnector resolves the
 * connection, picks the estate, and either calls Facebook Pages or calls the
 * faker.
 *
 * sideEffects: unsafe-to-replay.
 */

import {
  callConnector,
  type ConnectorResult,
  type RequestedMode,
  type Transport,
} from "@particle-academy/fancy-connector-core";
import { FACEBOOK_PAGES } from "../service.js";

export const POST_CREATE_OPERATION = "post_create";

export type PostCreateOptions = {
  /** The node's resolved config. Keys: pageId, message, link, published. */
  config: Record<string, unknown>;
  credentials?: Record<string, string | undefined>;
  mode?: RequestedMode;
  connectionId?: string | null;
  input?: unknown;
  attempts?: number;
  /** Override the transport. The only way to exercise this without a network. */
  transport?: Transport;
};

export async function facebookPagesPostCreate(options: PostCreateOptions): Promise<ConnectorResult> {
  const config = options.config ?? {};

  if (config.pageId === undefined || config.pageId === null || config.pageId === "") {
    throw new Error(`post_create: "pageId" is required (Page ID).`);
  }

  if (config.message === undefined || config.message === null || config.message === "") {
    throw new Error(`post_create: "message" is required (Message).`);
  }

  return callConnector(FACEBOOK_PAGES, {
    operation: POST_CREATE_OPERATION,
    config,
    input: options.input,
    ...(options.credentials === undefined ? {} : { credentials: options.credentials }),
    ...(options.mode === undefined ? {} : { mode: options.mode }),
    ...(options.connectionId === undefined ? {} : { connectionId: options.connectionId }),
    ...(options.attempts === undefined ? {} : { attempts: options.attempts }),
    ...(options.transport === undefined ? {} : { transport: options.transport }),
    request: {
      method: "POST",
      path: `/${encodeURIComponent(String(config.pageId))}/feed`,
      json: {
        "message": String(config.message),
        ...(config.link !== undefined && config.link !== null && config.link !== "" ? { "link": String(config.link) } : {}),
        ...(config.published !== undefined && config.published !== null && config.published !== "" ? { "published": Boolean(config.published) } : {}),
      },
    },
  });
}
