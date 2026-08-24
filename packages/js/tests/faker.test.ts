/**
 * GENERATED FILE — do not edit.
 *
 * Emitted from provider/fixtures/ by weaver's generator.
 * A hand-edit here is destroyed by the next protocol sync, which is worse than
 * being rejected, because it works until it silently does not. Fix
 * provider/fixtures/ (or weaver's template/) and regenerate:
 *
 *     npm run provider -- facebook_pages
 */

/**
 * The golden fixtures.
 *
 * Deterministic on purpose: the same seed produces the same bytes in
 * TypeScript, PHP and Python, so this file and its twins in the other packages
 * assert the SAME values. That turns the faker into a parity test rather than
 * a convenience — which matters, because cross-runtime drift does not fail
 * loudly. It completes, down one path, with no error.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { fakeRequest } from "@particle-academy/fancy-connector-core";

import { facebookPagesFaker } from "../src/faker.js";

test("post_create fakes the shape Facebook Pages publishes", () => {
  const config = {};

  const faked = facebookPagesFaker("post_create", fakeRequest("facebook_pages", "post_create", config));

  assert.deepEqual(faked, {
    "id": "88156160920104173966308337598763"
  });
});

test("an operation with no fixture throws rather than inventing a shape", () => {
  assert.throws(() => facebookPagesFaker("no_such_operation", fakeRequest("facebook_pages", "no_such_operation", {})), /no fake response/);
});
