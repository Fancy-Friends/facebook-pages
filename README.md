# Facebook Pages

Facebook Pages for [fancy-flow][flow] — as **four imported, versioned packages**, one
per runtime. Not vendored source: a copy cannot be upgraded, and third-party APIs
change.

[flow]: https://github.com/Particle-Academy/fancy-flow

| Runtime | Package | Install |
|---|---|---|
| Authoring surface (every host) | `@particle-academy/facebook-pages-ui` | `npm install @particle-academy/facebook-pages-ui` |
| Node | `@particle-academy/facebook-pages-js` | `npm install @particle-academy/facebook-pages-js` |
| PHP 8.4+ | `particle-academy/facebook-pages-php` | `composer require particle-academy/facebook-pages-php` |
| Python 3.11+ | `fancy-facebook-pages` | `pip install fancy-facebook-pages` |

The `ui` package is the editor surface and is React on every host — a PHP or
Python project installs it *and* its own runtime package, and never the `js` one.

## What it costs you

One dependency: `@particle-academy/fancy-connector-core` (or
`particle-academy/fancy-connector-core` on Composer), which the `js` and `php`
packages pull in themselves. The Python package has **zero** runtime
dependencies.

**No Facebook Pages SDK.** Plain HTTP, deliberately: a vendor SDK is third-party code
subject to the kit's full approval bar, and one per provider is hundreds of
dependencies nobody is tracking.

## Setting it up

Everything below is generated from `provider/manifest.json`, so it cannot disagree with what the packages do.

### Credentials

A Facebook Pages connection holds 4 values.

**Two kinds of value, and mixing them up matters.** A `provider` credential is ONE value for the whole installation — an OAuth app's client secret serves every connected account. An `account` credential is one per connected account. A host that stores the second where it stores the first lets one account's credentials reach another's.

| Field | Scope | Secret | Where it comes from |
|---|---|---|---|
| **App ID** | per installation | not secret | From the Meta app dashboard. ONE value for the whole installation. |
| **App secret (OAuth)** | per installation | **secret** | The same app's client secret, used to exchange the authorization code. |
| **App secret (proof)** | per installation | **secret** | Keys the appsecret_proof HMAC. It is never sent -- it proves the token rather than accompanying it. For a standard Meta app this is the same value as the OAuth client secret; it is declared separately because they are different ROLES, and an app that rotates one without the other should not silently break the other. |
| **Page access token** | per connected account | **secret** | PER PAGE, not per user. Obtained by exchanging a user token for a page token; a long-lived one lasts about 60 days and is re-authorised rather than refreshed. |

### Authorising

Facebook Pages uses OAuth2 (authorization_code). The package DECLARES the exchange; the HOST performs it — a consent screen needs a browser, a redirect URI and somewhere to persist the result, and all three belong to the host.

- **Authorize URL** — https://www.facebook.com/v25.0/dialog/oauth
- **Token URL** — https://graph.facebook.com/v25.0/oauth/access_token
- **Scopes** — `pages_manage_posts`, `pages_read_engagement`, `pages_show_list`
- **Access token lifetime** — 5184000 seconds (60 days). A host that never refreshes works all afternoon and is broken by morning.

**This flow issues NO refresh token.** A connection is RE-AUTHORISED rather than refreshed when the access token expires — checked, not assumed.

### The estate

**Facebook Pages has no test estate, and somebody checked.** Everything this connector does is real. Use the faker to build against it.

> Facebook has no sandbox for Pages. Anything this publishes appears on a real Page to real followers, and deleting it afterwards does not un-notify them. Point it at a Page you own and have muted before pointing it at anything else.

## What it can do

### Actions

#### `post_create` — Facebook Page post

Publish a post to a Facebook Page.

`POST /{pageId}/feed` · **unsafe to replay** — a retried durable run does it TWICE

| Input | Required | What it is |
|---|---|---|
| `pageId` | yes | The numeric Page id. Find it under the Page's About section, or as the `id` on the /me/accounts response used to obtain the token. |
| `message` | yes | The post text. Required unless a link is given -- and this connector always sends one, so it is required here. |
| `link` | no | A URL to attach. Facebook fetches and renders its own preview, so the title and image come from the page's OpenGraph tags rather than from anything sent here. |
| `published` | no | Turn this off to create the post UNPUBLISHED, visible only to Page admins. Useful for review before it goes out. |

## Run it before you have credentials

Every operation ships a **faker**, whether or not Facebook Pages has a sandbox. Set a
node's mode to `fake` and it returns the shape Facebook Pages actually publishes — the
same field names, deterministically — so you can wire the downstream nodes before
touching an account, a key, or a network.

## This repository is generated

`provider/` is the source. Everything under `packages/` is emitted from it and
**must not be hand-edited** — CI regenerates and diffs on every push, and the
next protocol sync destroys anything it finds. See [`AGENTS.md`](AGENTS.md).

## Two namespaces, which do not match on purpose

The repo is `github.com/Fancy-Friends/facebook-pages`; the packages publish under
`particle-academy`. Nothing derives one from the other — the names come from
weaver's `friends.json` and nowhere else.

## Licence

MIT.
