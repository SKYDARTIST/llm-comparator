# Spec: Cost Calculator

## Goal

Estimate monthly model spend from input and output token volume without making paid API calls.

## Formula

```text
monthly_cost =
  ((input_price_per_1m * input_tokens) +
   (output_price_per_1m * output_tokens)) / 1_000_000
```

## Acceptance Criteria

- Rankings sort cheapest to most expensive.
- Input and output token prices are handled separately.
- Zero-price models render as `Free`.
- Small prices retain enough precision to be useful.
- The UI must make clear that results are estimates.

## Cost Note

This feature models cost locally. It does not call OpenAI, Anthropic, Google, or OpenRouter generation APIs.
