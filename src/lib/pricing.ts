import type { LLMModel } from '../data/staticModels'

export interface MonthlyCostEstimate {
  id: string
  name: string
  provider: string
  cost: number
}

export function estimateMonthlyCost(
  model: Pick<LLMModel, 'inputPricePer1M' | 'outputPricePer1M'>,
  inputTokens: number,
  outputTokens: number
): number {
  return (
    model.inputPricePer1M * inputTokens +
    model.outputPricePer1M * outputTokens
  ) / 1_000_000
}

export function rankMonthlyCosts(
  models: LLMModel[],
  inputTokens: number,
  outputTokens: number
): MonthlyCostEstimate[] {
  return models
    .map(m => ({
      id: m.id,
      name: m.name,
      provider: m.provider,
      cost: estimateMonthlyCost(m, inputTokens, outputTokens),
    }))
    .sort((a, b) => a.cost - b.cost)
}

export function formatPrice(pricePer1M: number): string {
  if (pricePer1M === 0) return 'Free'
  if (pricePer1M < 0.1) return `$${pricePer1M.toFixed(4)}`
  return `$${pricePer1M.toFixed(2)}`
}

export function formatContextWindow(tokens: number): string {
  if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(0)}M`
  if (tokens >= 1_000) return `${(tokens / 1_000).toFixed(0)}K`
  return `${tokens}`
}

