import { useState, useEffect } from 'react'
import { staticModels, modelMetadata, type LLMModel } from '../data/staticModels'

interface OpenRouterModel {
  id: string
  name: string
  pricing: { prompt: string; completion: string }
  context_length: number
  description?: string
}

// Providers we care about — maps OpenRouter prefix → display name
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

// Top 20 flagship models — one or two per provider, latest only
const PRIORITY_IDS = new Set([
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

function toProviderName(id: string): string {
  const prefix = id.split('/')[0]
  return PROVIDER_MAP[prefix] ?? prefix
}

// Strip "Provider: " prefix that OpenRouter adds (e.g. "Anthropic: Claude 3 Haiku" → "Claude 3 Haiku")
function cleanName(name: string): string {
  return name.includes(': ') ? name.split(': ').slice(1).join(': ') : name
}

function normalizeForDedup(name: string): string {
  return cleanName(name).toLowerCase().replace(/[^a-z0-9]/g, '')
}

export function useModels() {
  const [models, setModels] = useState<LLMModel[]>(staticModels)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [source, setSource] = useState<'live' | 'static'>('static')

  useEffect(() => {
    fetch('https://openrouter.ai/api/v1/models')
      .then(r => r.json())
      .then((data: { data: OpenRouterModel[] }) => {
        const liveModels: LLMModel[] = data.data
          .filter(m => PRIORITY_IDS.has(m.id) && m.pricing?.prompt && m.pricing?.completion)
          .map(m => {
            const meta = modelMetadata[m.id]
            return {
              id: m.id,
              name: cleanName(m.name),
              provider: toProviderName(m.id),
              inputPricePer1M: parseFloat(m.pricing.prompt) * 1_000_000,
              outputPricePer1M: parseFloat(m.pricing.completion) * 1_000_000,
              contextWindow: m.context_length,
              releaseDate: meta?.releaseDate ?? '',
              description: m.description ?? '',
              capabilities: meta?.capabilities ?? [],
              source: 'openrouter' as const,
            }
          })

        // Dedup: remove static models already covered by live data (match by normalized name)
        const liveNormalized = new Set(liveModels.map(m => normalizeForDedup(m.name)))
        const staticFallback = staticModels.filter(
          m => !liveNormalized.has(normalizeForDedup(m.name))
        )

        const merged = [...liveModels, ...staticFallback]
          .sort((a, b) => a.inputPricePer1M - b.inputPricePer1M)

        setModels(merged)
        setSource('live')
      })
      .catch(err => {
        console.error('OpenRouter fetch failed, using static data:', err)
        setError('Using cached pricing data')
      })
      .finally(() => setLoading(false))
  }, [])

  return { models, loading, error, source }
}
