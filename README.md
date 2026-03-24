# LLM Comparator

A production-quality web app for comparing Large Language Models by pricing, context window, capabilities, and monthly cost.

---

## Features

- **Comparison Table** — Sort and filter 16+ models by input price, output price, context window, or provider
- **Price Chart** — Horizontal bar chart comparing input vs output costs, sorted cheapest first
- **Cost Calculator** — Sliders for monthly token volume → ranked cost estimate per model
- **Live pricing badge** — Shows whether data is from OpenRouter live API or static fallback

---

## Data Sources & Methodology

### Primary: OpenRouter Public API
```
GET https://openrouter.ai/api/v1/models
```
No authentication required. Returns model metadata including `pricing.prompt` and `pricing.completion` in USD per token. Multiplied by 1,000,000 for per-1M-token display. Fetched on page load, cached in React state.

### Secondary: Static fallback (`src/data/staticModels.ts`)
Hardcoded pricing for models not available on OpenRouter or to ensure coverage of key providers. Sources:

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

Static data last verified: March 2026.

### Merge Strategy
OpenRouter live data takes priority. Static models fill in gaps for any model ID not returned by OpenRouter. The UI shows a "Live" or "Cached" badge.

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
│   └── staticModels.ts     # LLMModel interface + 16 hardcoded models
├── hooks/
│   └── useModels.ts        # Fetches OpenRouter, merges with static
├── components/
│   ├── ComparisonTable.tsx # Sortable/filterable table
│   ├── PriceChart.tsx      # Recharts horizontal bar chart
│   └── CostCalculator.tsx  # Token sliders → monthly cost ranking
├── App.tsx                 # Layout, stats bar, section composition
└── index.css               # Tailwind import + base styles
```

---

## Running Locally

```bash
git clone https://github.com/AakashBuild/llm-comparator
cd llm-comparator
npm install
npm run dev
# Open http://localhost:5173
```

---

## Models Covered (16)

| Model | Provider |
|-------|----------|
| GPT-4o, GPT-4o Mini, o3-mini | OpenAI |
| Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku | Anthropic |
| Gemini 1.5 Pro, Gemini 1.5 Flash | Google |
| Grok 2 | xAI |
| Llama 3.1 405B, Llama 3.1 70B | Meta |
| Mistral Large, Mistral 7B | Mistral |
| DeepSeek V3, DeepSeek R1 | DeepSeek |
| Command R+ | Cohere |

---

## Built With
- Claude Code (Anthropic) — primary development agent
- Claude Desktop — architecture planning and iteration
