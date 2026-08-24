/**
 * GENERATED FILE — do not edit.
 *
 * Emitted from provider/actions/ by weaver's generator.
 * A hand-edit here is destroyed by the next protocol sync, which is worse than
 * being rejected, because it works until it silently does not. Fix
 * provider/actions/ (or weaver's template/) and regenerate:
 *
 *     npm run provider -- facebook_pages
 */

/**
 * What Facebook Pages actually receives.
 *
 * Every assertion below is about the request rather than the response, and
 * none of it touches the network: the transport is a stub that records what it
 * was handed.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import type { PreparedRequest } from "@particle-academy/fancy-connector-core";

import { facebookPagesPostCreate } from "../src/actions/post-create.js";

/** Capture the prepared request instead of sending it. */
function capture() {
  const seen: PreparedRequest[] = [];

  return {
    seen,
    transport: async (request: PreparedRequest) => {
      seen.push(request);

      return { status: 200, body: JSON.stringify({ id: "captured" }), headers: {} };
    },
  };
}

const CREDENTIALS = {
  "clientId": "test_clientId",
  "clientSecret": "test_clientSecret",
  "appSecret": "test_appSecret",
  "pageAccessToken": "test_pageAccessToken"
};

test("post_create sends POST /{pageId}/feed", async () => {
  const { seen, transport } = capture();

  await facebookPagesPostCreate({
    config: {
      "pageId": "example-pageId",
      "message": "example-message",
      "link": "example-link",
      "published": true
    },
    credentials: CREDENTIALS,
    mode: "live",
    transport,
  });

  assert.equal(seen.length, 1);
  assert.equal(seen[0]!.method, "POST");
  assert.ok(new URL(seen[0]!.url).pathname.endsWith("/example-pageId/feed"), seen[0]!.url);

  assert.deepEqual(JSON.parse(String(seen[0]!.body ?? "{}")), {
    "message": "example-message",
    "link": "example-link",
    "published": true
  });
});

test("the credential is placed the way the provider wants it", async () => {
  const { seen, transport } = capture();

  await facebookPagesPostCreate({
    config: {
      "pageId": "example-pageId",
      "message": "example-message",
      "link": "example-link",
      "published": true
    },
    credentials: CREDENTIALS,
    mode: "live",
    transport,
  });

  assert.match(seen[0]!.url, new RegExp("access_token=test_pageAccessToken"));
});

test("a missing required field is refused BEFORE anything is sent", async () => {
  // Nothing was attempted, so there is nothing to classify — and the message names
  // the field, rather than letting the provider answer three frames later with
  // "invalid request".
  const { seen, transport } = capture();

  await assert.rejects(
    facebookPagesPostCreate({
      config: {
        "message": "example-message",
        "link": "example-link",
        "published": true
      },
      credentials: CREDENTIALS,
      mode: "live",
      transport,
    }),
    new RegExp("pageId"),
  );

  assert.equal(seen.length, 0, "the request must not have been sent");
});
