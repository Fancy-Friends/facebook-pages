<?php

declare(strict_types=1);

namespace ParticleAcademy\FacebookPages\Flow;

use FancyFlow\Attributes\FlowNode;
use FancyFlow\Contracts\NodeExecutor;
use FancyFlow\Runtime\ExecutionContext;
use FancyFlow\Runtime\Port;
use FancyFlow\Runtime\RunEvent;
use ParticleAcademy\Connectors\ConnectorClient;
use ParticleAcademy\FacebookPages\Actions\PostCreate;
use ParticleAcademy\FacebookPages\FacebookPages;

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
 * Facebook Page post, run on a fancy-flow-php host.
 *
 * The PHP twin of `facebookPagesPostExecutor` in
 * @particle-academy/facebook-pages-js: the same request, built from the node's
 * config by the same `Actions\PostCreate` a host would call directly, and the
 * same value on `out` — the client's `{data, mode, connection}`.
 *
 * The client resolves the connection and the estate from the config. With
 * nothing configured that is FAKE, so a node dropped on a canvas runs against
 * the faker rather than Facebook Pages. To reach a real estate, pass a
 * `ConnectorClient` that knows the host's connections — or bind one in the
 * container, which resolves the constructor by type.
 */
#[FlowNode(
    name: '@particle-academy/facebook_pages_post',
    aliases: [
        'facebook_pages_post',
    ],
    category: 'io',
    label: 'Facebook Page post',
    description: 'Publish a post to a Facebook Page.',
    inputs: [
        [
            'id' => 'in',
        ],
    ],
    outputs: [
        [
            'id' => 'out',
        ],
    ],
    sideEffects: 'unsafe-to-replay',
    outputShape: [
        [
            'path' => 'data.id',
            'type' => 'string',
            'description' => 'The post id, in the form `{page-id}_{post-id}`. Both halves are needed to address the post again -- the second half alone is not a valid id.',
        ],
    ],
)]
final class PostExecutor implements NodeExecutor
{
    public function __construct(private readonly ?ConnectorClient $client = null) {}

    public function execute(ExecutionContext $ctx): mixed
    {
        $config = $ctx->config();

        $result = ($this->client ?? new ConnectorClient)->call(
            FacebookPages::descriptor(),
            PostCreate::OPERATION,
            $config,
            [
                'method' => PostCreate::METHOD,
                'path' => PostCreate::path($config),
                'json' => PostCreate::body($config),
            ],
            $ctx->input('in'),
        );

        $id = is_array($result->data) ? ($result->data['id'] ?? null) : null;
        $ctx->emit(RunEvent::log(
            'info',
            'facebook_pages post_create'.(is_scalar($id) ? ' '.$id : '').' ('.$result->mode->value.')',
            $ctx->node->id,
        ));

        return Port::only('out', $result->toArray());
    }
}
