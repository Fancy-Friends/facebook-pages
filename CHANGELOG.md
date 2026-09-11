# Changelog

All notable changes to `@particle-academy/facebook-pages-ui`,
`@particle-academy/facebook-pages-js`, `particle-academy/facebook-pages-php` and
`fancy-facebook-pages`.

The four packages share one version, because they are generated from one
`provider/` definition and a version that meant something different in each
would be a version nobody could reason about.

## [0.4.2] — 2026-09-11

### Added

- **`fancy-flow-php` executors for every node.** `src/Flow/` carries one `#[FlowNode]` class per action and trigger, and `FacebookPagesFlow::EXECUTORS` lists them.

A Laravel host running fancy-flow-php could show this connector's nodes in its editor and could not run them: `particle-academy/facebook-pages-php` shipped the request builders and no executor. Each one is the PHP twin of the executor in `@particle-academy/facebook-pages-js` — the same kind, the same request, the same value on `out` — and an unsafe-to-replay action derives its idempotency key from the run and the node, so a retried durable run sends the key it sent the first time.

Register them by adding `vendor/particle-academy/facebook-pages-php/packages/php/src/Flow` to `config('fancy-flow.discover')`. `particle-academy/fancy-flow-php` is SUGGESTED, not required, and conflicts outside `>=0.51.0 <2.0`, the range the executors were tested under. Nothing outside `Flow\` needs it.

### Fixed

- **Fake mode through `ConnectorClient` threw.** `FacebookPages::descriptor()` handed the connector core its faker as `FacebookPagesFaker::respond(...)`, which takes `($operation, $request)`; the core calls a faker `($operation, $config, $fake, $input)`. So `$config` arrived as `$request` and every fake call died on "Call to a member function … on null". The descriptor now translates between the two. Calling `FacebookPagesFaker::respond()` directly — what this package's own tests do, which is why they never saw it — is unchanged.

## [0.4.1] — 2026-09-06

### Changed

- **Published through npm Trusted Publishing, so these packages now carry PROVENANCE.**

Every earlier release went out under a scope-wide npm token. This one is
published by an OIDC exchange from the release workflow itself, and npm records
which workflow in which repository built it.
`npm view @particle-academy/facebook-pages-ui@0.4.1` shows the attestation; releases before
this one have none.

What it buys a consumer: the tarball on the registry can be tied to a public
commit and a public workflow run, rather than to whoever held a token. What it
does not buy: nothing about the code changed, and the runtime behaviour of all
four packages is identical to 0.4.0.

- **`repository.directory` in the npm packages.**

`@particle-academy/facebook-pages-ui` and `@particle-academy/facebook-pages-js` live at
`packages/ui` and `packages/js` inside the provider repo. npm's `repository`
field now says so, which makes the "Repository" link on each package page point
at the package rather than at the repository root.

## [0.4.0] — 2026-09-04

### Changed

- **Pinned to Graph API v25.0. v21.0 retires on 21 January 2027.**

Meta supports each API version for about two years and then removes it. v21.0
was released 2 October 2024 and is withdrawn on 21 January 2027; after that
every call from this connector fails, and an UNVERSIONED call does not fall
back to something sensible — it silently gets the oldest version Meta still
supports, which is the same breaking change arriving without a decision.

v25.0 rather than v26.0, which is newer and lives a few months longer.
`facebook-lead-ads` and `instagram-business` already pin v25.0, and three Meta
connectors on one version is worth more than the extra runway: a difference
between them is exactly the kind nothing reports until one of them breaks
alone. v25.0 retires 29 July 2028.

**The version was in THREE places, not one** — the base URL, the OAuth
authorize dialog and the token endpoint. The first is the one anybody thinks
of; the other two are what a connection is created through, so missing them
would have left new authorisations pointed at a retired version while every
existing connection kept working.

Checked against Meta's v22, v23, v24 and v25 changelogs before moving: none of
them touches `POST /{page-id}/feed`, its `message` / `link` / `published`
fields, page access tokens, `appsecret_proof`, or any scope this connector
requests. The v25.0 deprecations are Insights metrics, the `metadata=1` query
parameter, webhook mTLS certificates and Marketing API campaign creation —
none of which this connector uses.

### Fixed

- **`pages_show_list` was missing from the requested OAuth scopes.**

Meta's permissions reference lists it as a dependency of `pages_manage_posts`,
alongside `pages_read_engagement` which was already there. It is also how a
user token is exchanged for the PER-PAGE token this connector authorises with,
so a grant without it cannot produce the credential the connector needs.

Nothing here could have reported it. The scope list is metadata a HOST acts on
when it builds the consent URL — the connector never reads it — so an omission
fails during authorisation, on somebody else's machine, with an error about
permissions rather than about this package. `facebook-lead-ads` already
requested it; this one did not, and the two were never compared.

No code changed. All four packages are re-released together because they share
one version, and the ui package's config schema carries the scope list a host
reads.

## [0.3.1] — 2026-08-24

### Fixed

- **`@particle-academy/facebook-pages-js` now accepts a RANGE of `@particle-academy/facebook-pages-ui`, not one exact version.**

It peer-depended on `@particle-academy/facebook-pages-ui` at exactly the release it shipped with. That is the
strict form of the thing the kit's own rule forbids — a first-party sibling gets
a range — and the same block applied the rule correctly to its other two
dependencies. It was this one pair that slipped.

What it cost: ship `@particle-academy/facebook-pages-ui` with a fixed help string and every consumer on the
previous `@particle-academy/facebook-pages-js` had an **unmet peer**, which npm 7+ errors on. A documentation
patch could not be delivered without a matching runtime release, and a routine
`npm update` that moved the ui package alone broke the install.

The coupling is real and is not being loosened away. The ui package emits the
config schema and the js package implements against it, so a ui that adds a
field to a js that ignores it is silently wrong. But a PATCH is non-additive by
definition and a MINOR is where a field can appear — so `>=0.3.1 <0.4.0` is the
coupling that actually exists rather than the strictest one expressible.

Nothing else changed. `particle-academy/facebook-pages-php` and `fancy-facebook-pages` are unaffected; neither has an
equivalent edge.

## [0.3.0] — 2026-08-24

### Added

- **The README now says how to SET THIS CONNECTOR UP**, in the package itself.

Until now it explained what the four packages are, what they cost and why the
repo is generated — and said nothing about credentials, scopes, sandboxes or
operations. Somebody who installed it could not learn from it which credentials
a connection needs, where a human GETS them, which scopes to request, or what
the connector can actually do. All of that was already in the definition; the
one document a consumer reads was the one that omitted everything actionable.

The new **Setting it up** section carries:

- every credential, with the text saying where the value comes from, whether it
  is **per installation** or **per connected account**, and whether it is secret;
- the OAuth authorize and token URLs and the exact scopes, verbatim;
- the access-token lifetime, and where refresh tokens ROTATE, the two things a
  host must not do — retry a failed refresh, or refresh concurrently — because a
  replay revokes the entire grant and nothing in the failure says why;
- the estate in this provider's own terms, including the cases where a
  successful-looking run reaches nobody, or reaches the real one;
- every action and trigger with its method, path, inputs, and whether it is safe
  to replay;
- a trigger's provider-side setup, which nobody can derive from anything else.

It is **generated from `provider/manifest.json`**, so it cannot drift from what
the packages do — which is the point at a few hundred providers, where a
hand-written setup section is a few hundred documents going quietly stale.

No code changed. This release exists because a registry and an installing agent
read the PUBLISHED artifact, and the artifact carried the old README.

## [0.2.0] — 2026-08-24

### Changed

- **`@particle-academy/facebook-pages-ui` is now an OPTIONAL PEER dependency of `@particle-academy/facebook-pages-js`, not a hard one.**

`./flow` needs it; nothing else does. It was a hard dependency, and because
`@particle-academy/facebook-pages-ui` itself peer-depends on `fancy-flow` — which npm 7+ installs
automatically — `npm install @particle-academy/facebook-pages-js` pulled the **entire flow engine**
onto disk for a consumer who only wanted to call the API. Roughly **18 MB
became 874 KB**, and the package works exactly as before:

```js
import { facebookPages… } from "@particle-academy/facebook-pages-js";
// an injected transport, no flow engine anywhere
```

**This is breaking if you use `@particle-academy/facebook-pages-js/flow`.** Add `@particle-academy/facebook-pages-ui` to your own
dependencies — it was always being installed for you, and now it is declared.
Everything importing only the main entry point is unaffected.

The fix is on this edge rather than on `@particle-academy/facebook-pages-ui` → `fancy-flow`: the ui package
genuinely requires fancy-flow, since it calls `defineConnectorKind`, and marking
that peer optional would be a lie about what it needs.

## [0.1.0] — 2026-08-23

First release. The first connector on Meta's Graph API.

### Added

- `post_create` — publish a post to a Page. `POST /{pageId}/feed`.
- A faker for it, so the node runs on a canvas without publishing anything.

### A credential that must be PROVEN with another credential

Every authorisation scheme before this one **presents** a credential — a bearer
token, a header, a query parameter, an AWS signature. Meta wants one more thing,
quoting its own documentation:

```
$appsecret_proof = hash_hmac('sha256', $access_token, $app_secret);
```

An HMAC **over the token**, **keyed by the app secret**, sent as a query
parameter beside the token it vouches for. The secret itself is never sent — it
keys the hash and stays in the process, which is the entire point.

**It is optional until it isn't.** Meta treats it as optional until an app
enables *App Settings → Advanced → Security → Require App Secret*, at which point
every call without it fails. A connector built without it would be correct only
for the *less secure* configuration and would break the day somebody hardened
the app — in the direction people are supposed to move.

**The argument order is the whole thing.** `hmac(token, key: secret)` and
`hmac(secret, key: token)` are one swap apart, both arguments are credentials,
and **both produce a plausible 64-character hex string**. Nothing about the
output says which you computed. So it is pinned against a known vector, and the
parity suite compares all three runtimes against it.

### The token is per PAGE, and that is not a detail

`pageAccessToken` is `account`-scoped — one per connected Page — while the app
secret and client pair are `provider`-scoped, one for the whole installation.
Getting that backwards is one Page's automation posting as another's.

### This flow issues no refresh token

A user token is exchanged for a long-lived **Page** token lasting about 60 days,
which is **re-authorised rather than refreshed**. The definition says
`refreshTokenCredential: null` — a considered answer, distinct from omitting the
field, which still fails. The generator previously assumed every
`authorization_code` flow mints a refresh token; Meta is the counter-example.

### The API version is a path segment

`/v21.0/…`, not a header. Meta supports a version for roughly two years and then
removes it, and an unversioned call silently gets the **oldest** still-supported
version — so pinning it is the difference between a breaking change we choose
and one we discover.

### No sandbox, and no idempotency

`sandbox` is `none` — **checked**. Meta has test apps and test users, but no test
estate for a real Page: a post is a post, visible to whoever follows it.

The Graph API offers no idempotency key on this edge. So it is
`unsafe-to-replay` with no way to make it safe: a retried durable run publishes a
**second post** and followers are notified twice. Deleting it afterwards does not
un-notify them.

[0.1.0]: https://github.com/Fancy-Friends/facebook-pages/releases/tag/v0.1.0
[0.2.0]: https://github.com/Fancy-Friends/facebook-pages/releases/tag/v0.2.0
[0.3.0]: https://github.com/Fancy-Friends/facebook-pages/releases/tag/v0.3.0
[0.3.1]: https://github.com/Fancy-Friends/facebook-pages/releases/tag/v0.3.1
