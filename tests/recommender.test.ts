import { describe, expect, it } from 'vitest'
import { recommendModels, scoreModel } from '../src/lib/recommender'
import type { LLMModel } from '../src/data/staticModels'

const base = {
  provider: 'OpenAI',
  contextWindow: 128_000,
  releaseDate: '2026-01',
  description: '',
  capabilities: [],
  source: 'static' as const,
}

const models: LLMModel[] = [
  {
    ...base,
    id: 'openai/gpt-4o-mini',
    name: 'GPT-4o Mini',
    inputPricePer1M: 0.15,
    outputPricePer1M: 0.6,
  },
  {
    ...base,
    id: 'openai/gpt-5',
    name: 'GPT-5',
    inputPricePer1M: 1.25,
    outputPricePer1M: 10,
  },
]

describe('recommender', () => {
  it('scores by curated use cases and visible model metadata', () => {
    expect(scoreModel(models[0], 'cheap email support')).toBeGreaterThan(0)
  })

  it('returns empty recommendations for empty input', () => {
    expect(recommendModels(models, '')).toEqual([])
  })

  it('sorts matching models by score and then price', () => {
    const result = recommendModels(models, 'fast cheap automation', 2)

    expect(result.length).toBeGreaterThan(0)
    expect(result[0].model.inputPricePer1M).toBeLessThanOrEqual(result.at(-1)!.model.inputPricePer1M)
  })
})
