# Changelog

All notable changes to `@particle-academy/facebook-pages-ui`,
`@particle-academy/facebook-pages-js`, `particle-academy/facebook-pages-php` and
`fancy-facebook-pages`.

The four packages share one version, because they are generated from one
`provider/` definition and a version that meant something different in each
would be a version nobody could reason about.

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
