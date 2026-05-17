import { modelMetadata, staticModels, type LLMModel } from '../data/staticModels'

export interface OpenRouterModel {
  id: string
  name: string
  pricing?: { prompt?: string; completion?: string }
  context_length?: number
  description?: string
}

export interface OpenRouterResponse {
  data?: OpenRouterModel[]
}

const PROVIDER_MAP: Record<string, string> = {
  openai: 'OpenAI',
  anthropic: 'Anthropic',
  google: 'Google',
  'x-ai': 'xAI',
  'meta-llama': 'Meta',
  mistralai: 'Mistral',
  deepseek: 'DeepSeek',
  cohere: 'Cohere',
}

export const PRIORITY_IDS = new Set([
  'openai/gpt-5',
  'openai/gpt-4o',
  'openai/gpt-4o-mini',
  'openai/o4-mini',
  'anthropic/claude-opus-4.6',
  'anthropic/claude-sonnet-4.6',
  'anthropic/claude-haiku-4.5',
  'google/gemini-2.5-pro',
  'google/gemini-2.5-flash',
  'x-ai/grok-4',
  'x-ai/grok-3-mini',
  'meta-llama/llama-4-maverick',
  'meta-llama/llama-4-scout',
  'mistralai/mistral-large-2512',
  'mistralai/mistral-small-3.1-24b-instruct',
  'deepseek/deepseek-chat-v3-0324',
  'deepseek/deepseek-r1-0528',
  'cohere/command-r-plus-08-2024',
  'openai/o3',
  'google/gemini-2.0-flash-001',
])

export function toProviderName(id: string): string {
  const prefix = id.split('/')[0]
  return PROVIDER_MAP[prefix] ?? prefix
}

export function cleanName(name: string): string {
  return name.includes(': ') ? name.split(': ').slice(1).join(': ') : name
}

export function normalizeForDedup(name: string): string {
  return cleanName(name).toLowerCase().replace(/[^a-z0-9]/g, '')
}

export function isUsableOpenRouterModel(model: OpenRouterModel): boolean {
  const prompt = Number(model.pricing?.prompt)
  const completion = Number(model.pricing?.completion)
  return (
    PRIORITY_IDS.has(model.id) &&
    Number.isFinite(prompt) &&
    Number.isFinite(completion) &&
    prompt >= 0 &&
    completion >= 0 &&
    Number.isFinite(model.context_length)
  )
}

export function openRouterToLLMModel(model: OpenRouterModel): LLMModel {
  const meta = modelMetadata[model.id]

  return {
    id: model.id,
    name: cleanName(model.name),
    provider: toProviderName(model.id),
    inputPricePer1M: Number(model.pricing?.prompt) * 1_000_000,
    outputPricePer1M: Number(model.pricing?.completion) * 1_000_000,
    contextWindow: model.context_length ?? 0,
    releaseDate: meta?.releaseDate ?? '',
    description: model.description ?? '',
    capabilities: meta?.capabilities ?? [],
    source: 'openrouter',
  }
}

export function mergeLiveAndStaticModels(liveModels: LLMModel[]): LLMModel[] {
  const liveNormalized = new Set(liveModels.map(m => normalizeForDedup(m.name)))
  const staticFallback = staticModels.filter(
    m => !liveNormalized.has(normalizeForDedup(m.name))
  )

  return [...liveModels, ...staticFallback].sort(
    (a, b) => a.inputPricePer1M - b.inputPricePer1M
  )
}

export function parseOpenRouterResponse(payload: OpenRouterResponse): LLMModel[] {
  if (!Array.isArray(payload.data)) {
    throw new Error('OpenRouter response did not include a data array')
  }

  return payload.data
    .filter(isUsableOpenRouterModel)
    .map(openRouterToLLMModel)
}

