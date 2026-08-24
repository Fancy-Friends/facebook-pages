<?php

declare(strict_types=1);

namespace ParticleAcademy\FacebookPages\Actions;

use ParticleAcademy\FacebookPages\FacebookPages;
use ParticleAcademy\Connectors\ConnectorConfigException;

/*
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
 * This describes the request. The connector client resolves the connection,
 * picks the estate, and either calls Facebook Pages or calls the faker.
 */
final class PostCreate
{
    public const OPERATION = 'post_create';
    public const METHOD = 'POST';
    public const PATH = '/{pageId}/feed';
    public const SIDE_EFFECTS = 'unsafe-to-replay';

    /**
     * Build the JSON body for one call.
     *
     * Validation fails loudly and specifically here, rather than three frames
     * later as an "invalid request" from Facebook Pages.
     *
     * @param array<string,mixed> $config
     * @return array<string,scalar>
     */
    public static function body(array $config): array
    {
        if (($config['pageId'] ?? null) === null || ($config['pageId'] ?? null) === '') {
            throw new ConnectorConfigException('post_create: "pageId" is required (Page ID).');
        }

        if (($config['message'] ?? null) === null || ($config['message'] ?? null) === '') {
            throw new ConnectorConfigException('post_create: "message" is required (Message).');
        }

        $body = [];

        $value = $config['message'] ?? null;
        $body['message'] = (string) $value;

        $value = $config['link'] ?? null;
        if ($value !== null && $value !== '') {
            $body['link'] = (string) $value;
        }

        $value = $config['published'] ?? null;
        if ($value !== null && $value !== '') {
            $body['published'] = (bool) $value;
        }

        return $body;
    }

    /**
     * The request path, with each config value URL-ENCODED into it.
     *
     * `PATH` above is the TEMPLATE, which is what the descriptor advertises;
     * this is what a caller sends. A value interpolated raw changes which URL
     * is called — a range like `Sheet1!A:B` or a sheet named `Q1/Q2` — and the
     * provider answers 404 about the document rather than about the encoding.
     *
     * @param array<string,mixed> $config
     */
    public static function path(array $config): string
    {
        return '/'.rawurlencode((string) ($config['pageId'] ?? '')).'/feed';
    }
}
