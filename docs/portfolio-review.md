# Portfolio Review Notes

## What This Project Shows

- React + TypeScript product implementation.
- API integration with a graceful static fallback.
- Cost modeling for token-based AI products.
- Data normalization and validation.
- Deterministic recommendation logic instead of hidden paid inference.
- Unit tests and CI for the highest-risk logic.
- Clear documentation for architecture, data sources, and tradeoffs.

## What Was Improved

- Extracted pricing math into `src/lib/pricing.ts`.
- Extracted OpenRouter parsing and fallback merging into `src/lib/modelUtils.ts`.
- Extracted recommendation scoring into `src/lib/recommender.ts`.
- Added fallback model snapshots so the app still works without live metadata.
- Added unit tests for pricing, model parsing, fallback behavior, and recommendations.
- Added GitHub Actions CI for lint, tests, build, and high-severity audit checks.
- Added docs/specs to explain how the product works and why it avoids paid AI calls.

## Files That Should Stay Out Of Commits

- `.env`, `.env.local`, `.env.production`
- `node_modules/`
- `dist/`
- `.vercel/`
- local browser profiles, screenshots, and temporary exports
- API keys, provider tokens, billing IDs, service-role keys, and private test data

## Cost Positioning

This repo should stay a no-key comparison tool. Calling OpenAI, Anthropic, Gemini, or OpenRouter generation endpoints would create real API cost and would also require abuse controls. For a portfolio project, public metadata plus deterministic local logic is the better tradeoff.
