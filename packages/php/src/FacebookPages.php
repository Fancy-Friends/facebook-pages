<?php

declare(strict_types=1);

namespace ParticleAcademy\FacebookPages;

use ParticleAcademy\Connectors\Mode;
use ParticleAcademy\Connectors\PreparedRequest;
use ParticleAcademy\Connectors\SandboxKind;
use ParticleAcademy\Connectors\ServiceDescriptor;

/*
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
 * The PHP twin of the js package's `src/service.ts`.
 *
 * ## The sandbox trap, written down where it is used
 *
 * Facebook has no sandbox for Pages. Anything this publishes appears on a real
 * Page to real followers, and deleting it afterwards does not un-notify them.
 * Point it at a Page you own and have muted before pointing it at anything
 * else.
 */
final class FacebookPages
{
    // The connector API version this package was GENERATED against. A
    // literal, never imported: an imported constant lets an upgrade rewrite
    // the very claim it exists to detect.
    public const CONNECTOR_API_VERSION = 1;

    public const SERVICE = 'facebook_pages';

    public const LIVE_URL = 'https://graph.facebook.com/v21.0';

    /** @var list<string> Credential keys a remote call cannot proceed without. */
    public const REQUIRES = [
        'pageAccessToken',
        'appSecret',
        'clientId',
        'clientSecret',
    ];

    public static function descriptor(): ServiceDescriptor
    {
        return new ServiceDescriptor(
            service: self::SERVICE,
            title: 'Facebook Pages',
            sandbox: SandboxKind::None,
            baseUrls: [
                Mode::Live->value => self::LIVE_URL,
            ],
            requires: self::REQUIRES,
            authorize: self::authorize(...),
            faker: FacebookPagesFaker::respond(...),
        );
    }

    /**
     * Apply Facebook Pages's auth scheme to an outgoing request.
     *
     * Meta takes the token as a QUERY PARAMETER rather than a bearer header. It
     * accepts the header too, but the query form is what its own documentation and
     * every error message use, and appsecret_proof has to go in the query
     * regardless -- so putting both in one place keeps the request readable in a
     * log.
     *
     * @param array<string,string> $credentials
     */
    public static function authorize(array $credentials, PreparedRequest $request, Mode $mode): void
    {
        $separator = str_contains($request->url, '?') ? '&' : '?';
        $request->url .= $separator.rawurlencode('access_token').'='.rawurlencode((string) ($credentials['pageAccessToken'] ?? ''));

        $proof = hash_hmac('sha256', (string) ($credentials['pageAccessToken'] ?? ''), (string) ($credentials['appSecret'] ?? ''));
        $request->url .= '&'.rawurlencode('appsecret_proof').'='.$proof;
    }
}
