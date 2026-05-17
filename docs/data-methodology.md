# Data Methodology

This project compares model pricing and capabilities for portfolio/demo use. It avoids paid inference APIs and documents how each data class is handled.

## Pricing

Primary pricing comes from:

```text
GET https://openrouter.ai/api/v1/models
```

OpenRouter returns prompt and completion prices as USD per token. The app multiplies those values by `1_000_000` to show USD per 1M tokens.

When live metadata is unavailable, the app uses `src/data/staticModels.ts`. Static values are snapshots and should be reviewed before any business-critical use.

## Model Selection

The app tracks a curated whitelist of 20 flagship or commonly compared models. This avoids flooding the UI with hundreds of variants and keeps comparisons readable.

Tracked model IDs live in `src/lib/modelUtils.ts` as `PRIORITY_IDS`.

## Benchmarks

Benchmark values live in `src/data/benchmarks.ts`.

Rules:

- Use documented numbers only.
- Do not interpolate missing values.
- Show unavailable data as `—`.
- Prefer adding a source note over pretending the dataset is complete.

## Recommendation Logic

The recommender is a deterministic keyword scorer:

- curated use-case match: `+2`
- model name match: `+1`
- provider match: `+1`

Ties are sorted by lower input price. This keeps the feature explainable and free to run.

## Update Checklist

When adding or changing a model:

1. Add the model ID to `PRIORITY_IDS`.
2. Add curated metadata to `modelMetadata`.
3. Add or update the fallback snapshot in `staticModels`.
4. Add benchmark data only when a reliable source is available.
5. Run `npm run check`.
