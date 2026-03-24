# LLM Comparator

A production-quality web app for comparing Large Language Models by pricing, context window, capabilities, and monthly cost.

**Live:** https://llm-comparator.vercel.app

---

## Features

- **Comparison Table** — Sort and filter 20 models by input price, output price, context window, or provider
- **Price Chart** — Horizontal bar chart comparing input vs output costs, sorted cheapest first
- **Cost Calculator** — Sliders for monthly token volume → ranked cost estimate per model
- **Use Case Recommender** — Describe your use case, get the best model match with reasoning
- **Side-by-Side Comparison** — Compare GPT-4o, Gemini 2.5 Pro, and Claude Opus 4.6 head-to-head with real benchmark data
- **Benchmark Visualization** — Radar chart + table with real scores (MMLU, HumanEval, GPQA Diamond, SWE-bench, MATH, HLE, ARC-AGI 2, Terminal-Bench)
- **Dark / Light Mode** — Toggle between themes
- **Live pricing badge** — Shows whether data is from OpenRouter live API or static fallback

---

## Data Sources & Methodology

### Primary: OpenRouter Public API
```
GET https://openrouter.ai/api/v1/models
```
No authentication required. Returns model metadata including `pricing.prompt` and `pricing.completion` in USD per token. Multiplied by 1,000,000 for per-1M-token display. Fetched on page load, cached in React state.

### Secondary: Static metadata (`src/data/staticModels.ts`)
Release dates sourced from OpenRouter `created` Unix timestamps. Capabilities and use case data manually curated per model. Static data last verified: March 2026.

| Provider | Source |
|----------|--------|
| OpenAI | platform.openai.com/docs/models |
| Anthropic | anthropic.com/pricing |
| Google | ai.google.dev/pricing |
| xAI (Grok) | x.ai/api |
| Meta (Llama) | llama.meta.com |
| Mistral | mistral.ai/technology |
| DeepSeek | platform.deepseek.com/api-docs/pricing |
| Cohere | cohere.com/pricing |

### Benchmark Data (`src/data/benchmarks.ts`)
Real scores only — no estimates or interpolated values. Missing data shown as `—`.

| Model | Source |
|-------|--------|
| GPT-4o | anotherwrapper.com/llm-pricing (March 2026) |
| Gemini 2.5 Pro | anotherwrapper.com/llm-pricing (March 2026) |
| Claude Opus 4.6 | anthropic.com/news/claude-opus-4-6 (March 2026) |

### Merge Strategy
OpenRouter live data takes priority. Static metadata (release dates, capabilities) injected from `modelMetadata` lookup. Exactly 20 flagship models tracked via `PRIORITY_IDS` whitelist. The UI shows a "Live" or "Cached" badge.

> LLM providers do not offer official pricing APIs. OpenRouter + documented static fallback is the most reliable approach available — combining real-time data where possible with authoritative sources where not.

---

## Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | Vite + React + TypeScript | Fast iteration, strong typing |
| Styling | Tailwind CSS v4 | Utility-first, no CSS files needed |
| Charts | Recharts | Composable, works well with React state |
| Icons | lucide-react | Lightweight, consistent |
| Data | OpenRouter API + static JSON | Live where available, documented fallback |

---

## Architecture

```
src/
├── data/
│   ├── staticModels.ts     # LLMModel interface + modelMetadata (20 models)
│   └── benchmarks.ts       # Real benchmark scores for 3 models
├── hooks/
│   └── useModels.ts        # Fetches OpenRouter, filters by PRIORITY_IDS, injects metadata
├── components/
│   ├── ComparisonTable.tsx # Sortable/filterable table
│   ├── PriceChart.tsx      # Recharts horizontal bar chart
│   ├── CostCalculator.tsx  # Token sliders → monthly cost ranking
│   ├── UseCaseRecommender.tsx # Keyword matching → model recommendations
│   └── SideBySide.tsx      # Head-to-head comparison + radar chart
├── App.tsx                 # Layout, tab navigation, stats bar, dark mode toggle
└── index.css               # Tailwind import + light theme overrides
```

---

## Running Locally

```bash
git clone https://github.com/SKYDARTIST/llm-comparator
cd llm-comparator
npm install
npm run dev
# Open http://localhost:5173
```

---

## Models Covered (20)

| Model | Provider |
|-------|----------|
| GPT-5, GPT-4o, GPT-4o Mini, o4-mini, o3 | OpenAI |
| Claude Opus 4.6, Claude Sonnet 4.6, Claude Haiku 4.5 | Anthropic |
| Gemini 2.5 Pro, Gemini 2.5 Flash, Gemini 2.0 Flash | Google |
| Grok 4, Grok 3 Mini | xAI |
| Llama 4 Maverick, Llama 4 Scout, Llama 3.3 70B | Meta |
| Mistral Large, Mistral Small | Mistral |
| DeepSeek V3, DeepSeek R1 | DeepSeek |

---

## Built With
- Claude Code (Anthropic) — primary development agent
- Claude Desktop — architecture planning and iteration
