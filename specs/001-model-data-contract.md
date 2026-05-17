# Spec: Model Data Contract

## Goal

Provide one normalized model shape to every UI component, regardless of whether the data came from OpenRouter or the static fallback.

## Contract

Each model must satisfy `LLMModel`:

- `id`: provider/model identifier, usually OpenRouter-compatible.
- `name`: human-readable display name without provider prefix.
- `provider`: normalized provider label.
- `inputPricePer1M`: USD per 1M input tokens.
- `outputPricePer1M`: USD per 1M output tokens.
- `contextWindow`: token context length.
- `releaseDate`: readable release month/date when available.
- `description`: short model summary.
- `capabilities`: display tags.
- `source`: `openrouter` or `static`.

## Acceptance Criteria

- Invalid live models are filtered before UI rendering.
- Live prices are converted from per-token to per-million-token units.
- Static fallback fills missing tracked models.
- Duplicate model names are deduped after provider-prefix cleanup.
- Malformed API responses throw a clear error and trigger fallback behavior.
