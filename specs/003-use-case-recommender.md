# Spec: Use-Case Recommender

## Goal

Suggest models for a user-entered use case using deterministic local scoring.

## Scoring

- Curated use-case match: `+2`
- Model name match: `+1`
- Provider match: `+1`
- Tie-breaker: lower input price first

## Acceptance Criteria

- Empty queries return no recommendations.
- Models with no score are hidden.
- Results are deterministic for the same input.
- The recommender must not call paid LLM APIs.

## Why Not Use A Live LLM

For this portfolio project, a live LLM recommender would create real API cost and require rate limiting, abuse prevention, and secret management. The local scorer is cheaper, faster, auditable, and enough to demonstrate the product workflow.
