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
 * Facebook Page post — Publish a post to a Facebook Page.
 *
 * https://developers.facebook.com/docs/graph-api/reference/page/feed/#publish
 *
 * `unsafe-to-replay`.
 */

import type { NodeKindDefinition } from "@particle-academy/fancy-flow/engine";
import { defineConnectorKind, summarize, type OutputField } from "@particle-academy/fancy-flow/connectors";
import { facebookPagesMeta } from "../service.js";

export const FACEBOOK_PAGES_POST_KIND = "@particle-academy/facebook_pages_post";
export const FACEBOOK_PAGES_POST_OPERATION = "post_create";

export const FACEBOOK_PAGES_POST_META = facebookPagesMeta("action", "publish a post", "https://developers.facebook.com/docs/graph-api/reference/page/feed/#publish");

/**
 * What this node emits — the "ingredients" a downstream node can reference.
 *
 * fancy-flow reads `outputShape` off the kind and offers it in the variable
 * picker, so declaring it is the whole of the work: an author configuring the
 * next node picks `{{ $json.data.id }}` off a list instead of typing a path
 * and hoping.
 */
export const FACEBOOK_PAGES_POST_OUTPUT: OutputField[] = [
  {
    "path": "data.id",
    "type": "string",
    "description": "The post id, in the form `{page-id}_{post-id}`. Both halves are needed to address the post again -- the second half alone is not a valid id."
  }
];

export const facebookPagesPostKind: NodeKindDefinition = defineConnectorKind(FACEBOOK_PAGES_POST_META, {
  name: FACEBOOK_PAGES_POST_KIND,
  aliases: ["facebook_pages_post"],
  label: "Facebook Page post",
  description: "Publish a post to a Facebook Page.",
  inputs: [{ id: "in" }],
  outputs: [{ id: "out" }],
  sideEffects: "unsafe-to-replay",
  outputShape: FACEBOOK_PAGES_POST_OUTPUT,
  configSchema: [
    {
      "type": "text",
      "key": "pageId",
      "label": "Page ID",
      "required": true,
      "description": "The numeric Page id. Find it under the Page's About section, or as the `id` on the /me/accounts response used to obtain the token."
    },
    {
      "type": "textarea",
      "key": "message",
      "label": "Message",
      "required": true,
      "description": "The post text. Required unless a link is given -- and this connector always sends one, so it is required here."
    },
    {
      "type": "text",
      "key": "link",
      "label": "Link",
      "description": "A URL to attach. Facebook fetches and renders its own preview, so the title and image come from the page's OpenGraph tags rather than from anything sent here."
    },
    {
      "type": "switch",
      "key": "published",
      "label": "Publish immediately",
      "default": true,
      "description": "Turn this off to create the post UNPUBLISHED, visible only to Page admins. Useful for review before it goes out."
    }
  ],
  defaultConfig: {
    "mode": "auto"
  },
  renderBody: ({ config }) =>
    summarize(FACEBOOK_PAGES_POST_META, config as Record<string, unknown>, "publish a post"),
});
