# CLAUDE.md — LLM Comparator

## Project Goal
Production-quality web app comparing the top 20 LLMs by pricing, specs, benchmarks, and capabilities.
Built with Vite + React + TypeScript + Tailwind CSS v4 + Recharts.
Live at: https://llm-comparator.vercel.app

## Data Strategy
- **Primary**: Fetch live from OpenRouter public API (`https://openrouter.ai/api/v1/models`) — no auth required
- Prices come as USD per token — multiply by 1,000,000 for per-1M display
- Exactly 20 models tracked via `PRIORITY_IDS` whitelist in `useModels.ts`
- Release dates, capabilities, use cases injected from `modelMetadata` in `staticModels.ts`
- Benchmark scores in `benchmarks.ts` — real data only, null for missing (shown as —)

## Models Tracked (20)
- GPT-5, GPT-4o, GPT-4o Mini, o4-mini, o3 (OpenAI)
- Claude Opus 4.6, Claude Sonnet 4.6, Claude Haiku 4.5 (Anthropic)
- Gemini 2.5 Pro, Gemini 2.5 Flash, Gemini 2.0 Flash (Google)
- Grok 4, Grok 3 Mini (xAI)
- Llama 4 Maverick, Llama 4 Scout, Llama 3.3 70B (Meta)
- Mistral Large, Mistral Small (Mistral)
- DeepSeek V3, DeepSeek R1 (DeepSeek)

## Data Shape (LLMModel interface)
```ts
interface LLMModel {
  id: string
  name: string
  provider: string
  inputPricePer1M: number   // USD per 1M tokens
  outputPricePer1M: number  // USD per 1M tokens
  contextWindow: number     // tokens
  releaseDate?: string      // 'YYYY-MM' format
  description?: string
  capabilities: string[]    // e.g. ['vision', 'function-calling', 'json-mode']
  useCases: string[]        // keywords for recommender matching
  useCaseReason: string     // human-readable reason shown in recommender
  source: 'openrouter' | 'static'
}
```

## Component Architecture
```
src/
  data/
    staticModels.ts         — LLMModel interface + modelMetadata (release dates, capabilities, use cases)
    benchmarks.ts           — Real benchmark scores (MMLU, HumanEval, SWE-bench, etc.) for 3 models
  hooks/
    useModels.ts            — Fetches OpenRouter, filters by PRIORITY_IDS, injects metadata
  components/
    ComparisonTable.tsx     — Sortable/filterable table (by price, context, provider)
    PriceChart.tsx          — Horizontal bar chart, provider-colored, sorted cheapest first
    CostCalculator.tsx      — Token sliders → monthly cost ranking per model
    UseCaseRecommender.tsx  — Keyword matching → top 3 model recommendations with reasoning
    SideBySide.tsx          — Head-to-head: specs table + benchmark rows + radar chart
  App.tsx                   — Tab navigation, stats bar, dark/light mode toggle
  index.css                 — Tailwind import + .light-theme CSS overrides
```

## Coding Rules
- TypeScript strict — avoid `any`
- Tailwind for all styling — no CSS modules, minimal inline styles
- Functional components + hooks only
- Fetch once on mount, cache in React state — no re-fetching
- Dark theme default (bg-gray-950 / gray-900 / gray-800 palette)
- Light mode via `.light-theme` class on `<html>` — CSS overrides in index.css

## Adding a New Model
1. Add its OpenRouter ID to `PRIORITY_IDS` in `useModels.ts`
2. Add its metadata entry in `modelMetadata` in `staticModels.ts`
3. Optionally add benchmark scores in `benchmarks.ts` (real data only)

## Adding Benchmark Data
Only add verified scores from official provider pages or trusted aggregators.
Format in `benchmarks.ts`:
```ts
'provider/model-id': [
  { name: 'MMLU', description: 'General knowledge', score: 88.7, unit: '%' },
  { name: 'SWE-bench', description: 'Real-world coding', score: null, unit: '%' }, // null = no data
]
```

## Running
```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build
```
