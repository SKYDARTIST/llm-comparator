import { describe, expect, it } from 'vitest'
import {
  cleanName,
  isUsableOpenRouterModel,
  mergeLiveAndStaticModels,
  normalizeForDedup,
  openRouterToLLMModel,
  parseOpenRouterResponse,
  toProviderName,
} from '../src/lib/modelUtils'

describe('model utilities', () => {
  it('normalizes provider and model names from OpenRouter data', () => {
    expect(toProviderName('anthropic/claude-opus-4.6')).toBe('Anthropic')
    expect(cleanName('OpenAI: GPT-4o')).toBe('GPT-4o')
    expect(normalizeForDedup('GPT-4o Mini')).toBe('gpt4omini')
  })

  it('rejects untracked or incomplete live models', () => {
    expect(isUsableOpenRouterModel({
      id: 'unknown/model',
      name: 'Unknown',
      pricing: { prompt: '1', completion: '1' },
      context_length: 128_000,
    })).toBe(false)

    expect(isUsableOpenRouterModel({
      id: 'openai/gpt-4o',
      name: 'GPT-4o',
      pricing: { prompt: '0.0000025' },
      context_length: 128_000,
    })).toBe(false)
  })

  it('converts OpenRouter per-token prices into per-million prices', () => {
    const model = openRouterToLLMModel({
      id: 'openai/gpt-4o',
      name: 'OpenAI: GPT-4o',
      pricing: { prompt: '0.0000025', completion: '0.00001' },
      context_length: 128_000,
      description: 'Flagship model',
    })

    expect(model.name).toBe('GPT-4o')
    expect(model.inputPricePer1M).toBeCloseTo(2.5)
    expect(model.outputPricePer1M).toBeCloseTo(10)
    expect(model.source).toBe('openrouter')
  })

  it('throws on malformed OpenRouter responses', () => {
    expect(() => parseOpenRouterResponse({})).toThrow(/data array/)
  })

  it('keeps static fallback models when live data is partial', () => {
    const live = openRouterToLLMModel({
      id: 'openai/gpt-4o',
      name: 'GPT-4o',
      pricing: { prompt: '0.0000025', completion: '0.00001' },
      context_length: 128_000,
    })

    const merged = mergeLiveAndStaticModels([live])

    expect(merged.find(m => m.id === 'openai/gpt-4o')?.source).toBe('openrouter')
    expect(merged.length).toBeGreaterThan(1)
  })
})
