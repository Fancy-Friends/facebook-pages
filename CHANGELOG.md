# Changelog

All notable changes to `@particle-academy/facebook-pages-ui`,
`@particle-academy/facebook-pages-js`, `particle-academy/facebook-pages-php` and
`fancy-facebook-pages`.

The four packages share one version, because they are generated from one
`provider/` definition and a version that meant something different in each
would be a version nobody could reason about.

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
