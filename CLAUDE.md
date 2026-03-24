# CLAUDE.md — LLM Comparator

## Project Goal
Production-quality web app comparing the top LLMs by pricing, specs, and capabilities.
Built with Vite + React + TypeScript + Tailwind CSS + Recharts.

## Data Strategy
- **Primary**: Fetch live from OpenRouter public API (`https://openrouter.ai/api/v1/models`)
- **Supplement**: Hardcoded `src/data/staticModels.ts` for models not on OpenRouter (Grok, etc.)
- Prices are in USD per token from OpenRouter — multiply by 1,000,000 for per-1M display
- Data source documented in README.md

## Models to Always Include (supplement static data if missing from OpenRouter)
- GPT-4o, GPT-4o-mini, GPT-4-turbo (OpenAI)
- Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku (Anthropic)
- Gemini 1.5 Pro, Gemini 1.5 Flash (Google)
- Grok-1, Grok-2 (xAI)
- Llama 3.1 405B, Llama 3.1 70B (Meta)
- Mistral Large, Mistral 7B
- DeepSeek V3, DeepSeek R1
- Command R+ (Cohere)

## Data Shape (LLMModel interface)
```ts
interface LLMModel {
  id: string
  name: string
  provider: string
  inputPricePer1M: number   // USD
  outputPricePer1M: number  // USD
  contextWindow: number     // tokens
  releaseDate?: string
  description?: string
  capabilities?: string[]   // e.g. ['vision', 'function-calling', 'json-mode']
  source: 'openrouter' | 'static'
}
```

## Component Architecture
```
src/
  data/
    staticModels.ts       — fallback/supplement data
    useModels.ts          — hook: fetches OpenRouter + merges static
  components/
    ComparisonTable.tsx   — sortable, filterable table
    PriceChart.tsx        — horizontal bar chart (Recharts)
    CostCalculator.tsx    — token slider → monthly cost per model
    ModelDetail.tsx       — side-by-side comparison modal
  App.tsx
```

## Coding Rules
- TypeScript strict — no `any`
- Tailwind for all styling — no inline styles, no CSS modules
- Functional components + hooks only
- Fetch once on mount, cache in state — no re-fetching
- Mobile-first responsive (sm: md: lg: breakpoints)
- Dark theme by default (bg-gray-900 / gray-800 palette)

## Priority Order (ship in this order)
1. Data hook (OpenRouter fetch + static merge) ✅
2. ComparisonTable with sort + filter
3. PriceChart (bar chart)
4. CostCalculator
5. Side-by-side comparison
6. Dark mode toggle (if time)

## Running
```bash
npm install
npm run dev
```
