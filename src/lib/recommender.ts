import { modelMetadata, type LLMModel } from '../data/staticModels'

export interface Recommendation {
  model: LLMModel
  score: number
}

export function scoreModel(model: LLMModel, query: string): number {
  const meta = modelMetadata[model.id]
  if (!meta?.useCases?.length) return 0

  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  let score = 0

  for (const word of words) {
    for (const useCase of meta.useCases) {
      const normalizedUseCase = useCase.toLowerCase()
      if (normalizedUseCase.includes(word) || word.includes(normalizedUseCase)) {
        score += 2
      }
    }

    if (model.name.toLowerCase().includes(word)) score += 1
    if (model.provider.toLowerCase().includes(word)) score += 1
  }

  return score
}

export function recommendModels(
  models: LLMModel[],
  query: string,
  limit = 3
): Recommendation[] {
  if (!query.trim()) return []

  return models
    .map(model => ({ model, score: scoreModel(model, query) }))
    .filter(result => result.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return a.model.inputPricePer1M - b.model.inputPricePer1M
    })
    .slice(0, limit)
}

