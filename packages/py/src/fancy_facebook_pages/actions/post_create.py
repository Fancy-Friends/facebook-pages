# GENERATED FILE — do not edit.
#
# Emitted from provider/actions/post-create.json by weaver's generator.
# A hand-edit here is destroyed by the next protocol sync, which is worse than
# being rejected, because it works until it silently does not. Fix
# provider/actions/post-create.json (or weaver's template/) and regenerate:
#
# npm run provider -- facebook_pages

"""Publish a post to a Facebook Page.

POST /{pageId}/feed —
https://developers.facebook.com/docs/graph-api/reference/page/feed/#publish

This describes the request. `call` resolves the connection, picks the
estate, and either calls Facebook Pages or calls the faker.
"""

from __future__ import annotations

from typing import Any
from urllib.parse import quote

from .._runtime import CallResult, ConnectorConfigError, Mode, call
from ..service import descriptor

OPERATION = "post_create"
METHOD = "POST"
PATH = "/{pageId}/feed"
SIDE_EFFECTS = "unsafe-to-replay"


def body(config: dict[str, Any]) -> dict[str, Any]:
    """Build the JSON body for one call, failing loudly and specifically."""
    if config.get("pageId") is None or config.get("pageId") == "":
        raise ConnectorConfigError(
            "post_create: \"pageId\" is required (Page ID)."
        )

    if config.get("message") is None or config.get("message") == "":
        raise ConnectorConfigError(
            "post_create: \"message\" is required (Message)."
        )

    out: dict[str, Any] = {}
    _value = config.get("message")
    if _value is None or _value == "":
        raise ConnectorConfigError("post_create: \"message\" is required.")

    out["message"] = str(_value)
    _value = config.get("link")
    if _value is not None and _value != "":
        out["link"] = str(_value)
    _value = config.get("published")
    if _value is not None and _value != "":
        out["published"] = bool(_value)

    return out



def path(config: dict[str, Any]) -> str:
    """The request path, with each config value URL-ENCODED into it.

    `PATH` above is the TEMPLATE, which is what the descriptor advertises;
    this is what a caller sends. A value interpolated raw changes WHICH URL is
    called — a range like `Sheet1!A:B`, or a sheet named `Q1/Q2` — and the
    provider answers 404 about the document rather than about the encoding.
    """
    return (
        "/"
        + quote(str(config.get("pageId") or ""), safe="")
        + "/feed"
    )

def post_create(
    config: dict[str, Any],
    *,
    credentials: dict[str, str | None] | None = None,
    mode: Mode = "auto",
    connection_id: str | None = None,
    attempts: int = 3,
) -> CallResult:
    """Publish a post to a Facebook Page."""
    return call(
        descriptor(),
        operation=OPERATION,
        method=METHOD,
        path=PATH,
        json_body=body(config),
        config=config,
        credentials=credentials,
        mode=mode,
        connection_id=connection_id,
        attempts=attempts,
    )
