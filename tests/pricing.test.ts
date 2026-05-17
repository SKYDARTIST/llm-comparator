import { describe, expect, it } from 'vitest'
import { estimateMonthlyCost, formatContextWindow, formatPrice, rankMonthlyCosts } from '../src/lib/pricing'
import type { LLMModel } from '../src/data/staticModels'

const models: LLMModel[] = [
  {
    id: 'cheap',
    name: 'Cheap Model',
    provider: 'Test',
    inputPricePer1M: 0.1,
    outputPricePer1M: 0.2,
    contextWindow: 128_000,
    releaseDate: '2026-01',
    description: '',
    capabilities: [],
    source: 'static',
  },
  {
    id: 'expensive',
    name: 'Expensive Model',
    provider: 'Test',
    inputPricePer1M: 5,
    outputPricePer1M: 20,
    contextWindow: 1_000_000,
    releaseDate: '2026-01',
    description: '',
    capabilities: [],
    source: 'static',
  },
]

describe('pricing helpers', () => {
  it('estimates blended monthly token cost', () => {
    expect(estimateMonthlyCost(models[0], 2_000_000, 1_000_000)).toBeCloseTo(0.4)
  })

  it('ranks models by total monthly cost', () => {
    expect(rankMonthlyCosts(models, 1_000_000, 1_000_000).map(m => m.id)).toEqual([
      'cheap',
      'expensive',
    ])
  })

  it('formats tiny prices with useful precision', () => {
    expect(formatPrice(0)).toBe('Free')
    expect(formatPrice(0.0123)).toBe('$0.0123')
    expect(formatPrice(1.5)).toBe('$1.50')
  })

  it('formats context windows for scanning', () => {
    expect(formatContextWindow(128_000)).toBe('128K')
    expect(formatContextWindow(1_000_000)).toBe('1M')
  })
})
