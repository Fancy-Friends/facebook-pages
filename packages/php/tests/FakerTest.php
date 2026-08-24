<?php

declare(strict_types=1);

use ParticleAcademy\FacebookPages\FacebookPagesFaker;
use ParticleAcademy\Connectors\FakeValues;

/*
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
 * The golden fixtures — the SAME values the TypeScript and Python packages
 * assert.
 *
 * Bit-for-bit identical is the claim, and this is what checks it.
 * Cross-runtime drift does not fail loudly on its own: it completes, down one
 * path, with no error.
 */

it('post_create fakes the shape Facebook Pages publishes', function () {
    $config = [];
    $fake = new FakeValues(FakeValues::seedForCall('facebook_pages', 'post_create', $config));

    $faked = FacebookPagesFaker::respond('post_create', ['config' => $config, 'fake' => $fake]);

    expect($faked)->toBe([
        'id' => '88156160920104173966308337598763',
    ]);
});

it('throws for an operation with no fixture rather than inventing a shape', function () {
    $fake = new FakeValues(FakeValues::seedForCall('facebook_pages', 'no_such_operation', []));

    expect(fn () => FacebookPagesFaker::respond('no_such_operation', ['config' => [], 'fake' => $fake]))
        ->toThrow(InvalidArgumentException::class);
});
