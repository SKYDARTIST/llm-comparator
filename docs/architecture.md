# Architecture

LLM Comparator is a client-side React application that compares flagship AI models without requiring user accounts, API keys, or paid inference calls.

## Runtime Flow

1. `src/hooks/useModels.ts` requests OpenRouter's public model metadata endpoint.
2. `src/lib/modelUtils.ts` validates the response, keeps only tracked flagship models, converts per-token prices into per-million-token prices, and merges missing entries from the static fallback dataset.
3. UI components receive a normalized `LLMModel[]` and stay presentation-focused.
4. If the public metadata request fails, the app falls back to static model snapshots so the portfolio demo still works.

## Why This Shape

- API cost: The app does not call OpenAI, Anthropic, Gemini, or any paid generation endpoint.
- Reliability: Static snapshots keep the experience useful when OpenRouter is blocked, rate-limited, or offline.
- Maintainability: Pricing, recommendation, and normalization logic live in small testable modules instead of being buried in components.
- Portfolio signal: The repository shows product thinking, data methodology, tests, CI, and security posture instead of only a UI demo.

## Key Modules

| Path | Responsibility |
| --- | --- |
| `src/data/staticModels.ts` | Static model snapshots and curated metadata |
| `src/data/benchmarks.ts` | Verified benchmark values used by side-by-side comparison |
| `src/hooks/useModels.ts` | Live metadata fetch and fallback orchestration |
| `src/lib/modelUtils.ts` | OpenRouter parsing, validation, normalization, and merge logic |
| `src/lib/pricing.ts` | Monthly cost math and formatting helpers |
| `src/lib/recommender.ts` | Lightweight use-case scoring |
| `tests/` | Unit coverage for pricing, recommendations, and model normalization |

## Tradeoffs

- Live prices depend on OpenRouter metadata, not official provider pricing APIs. Providers usually do not expose stable public pricing APIs.
- The recommender is intentionally heuristic. It is deterministic, free, and explainable, but not a replacement for real evaluation.
- Benchmarks are shown only where a source is documented. Missing values are rendered as unavailable rather than inferred.
