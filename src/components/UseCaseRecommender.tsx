import { useState, useMemo } from 'react'
import { Search, Zap, DollarSign, Brain } from 'lucide-react'
import type { LLMModel } from '../data/staticModels'
import { modelMetadata } from '../data/staticModels'

const QUICK_PICKS = [
  { label: 'Coding', query: 'coding' },
  { label: 'Cheap & Fast', query: 'cheap fast' },
  { label: 'Long Documents', query: 'long documents PDF' },
  { label: 'Math / Reasoning', query: 'math reasoning' },
  { label: 'Privacy / Open Source', query: 'open-source privacy' },
  { label: 'Multilingual', query: 'multilingual' },
  { label: 'RAG / Search', query: 'RAG search retrieval' },
  { label: 'Current Events', query: 'realtime news' },
]

function scoreModel(model: LLMModel, query: string): number {
  const meta = modelMetadata[model.id]
  if (!meta?.useCases?.length) return 0
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  let score = 0
  for (const word of words) {
    for (const uc of meta.useCases) {
      if (uc.toLowerCase().includes(word) || word.includes(uc.toLowerCase())) score += 2
    }
    if (model.name.toLowerCase().includes(word)) score += 1
    if (model.provider.toLowerCase().includes(word)) score += 1
  }
  return score
}

const PROVIDER_COLORS: Record<string, string> = {
  OpenAI: 'border-emerald-700 bg-emerald-950/30',
  Anthropic: 'border-orange-700 bg-orange-950/30',
  Google: 'border-blue-700 bg-blue-950/30',
  xAI: 'border-gray-600 bg-gray-900/30',
  Meta: 'border-indigo-700 bg-indigo-950/30',
  Mistral: 'border-purple-700 bg-purple-950/30',
  DeepSeek: 'border-cyan-700 bg-cyan-950/30',
  Cohere: 'border-pink-700 bg-pink-950/30',
}

const RANK_LABELS = ['#1 Best Match', '#2', '#3']
const RANK_STYLES = ['text-yellow-400', 'text-gray-400', 'text-amber-700']

export default function UseCaseRecommender({ models }: { models: LLMModel[] }) {
  const [query, setQuery] = useState('')

  const defaultPicks = useMemo(() => {
    // Default: show GPT-4o, Claude Sonnet 4.6, DeepSeek V3 as starter recommendations
    const preferred = ['anthropic/claude-sonnet-4.6', 'openai/gpt-4o', 'deepseek/deepseek-chat-v3-0324']
    return preferred.map(id => models.find(m => m.id === id)).filter(Boolean) as LLMModel[]
  }, [models])

  const results = useMemo(() => {
    if (!query.trim()) return []
    return [...models]
      .map(m => ({ model: m, score: scoreModel(m, query) }))
      .filter(r => r.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score
        return a.model.inputPricePer1M - b.model.inputPricePer1M
      })
      .slice(0, 3)
  }, [models, query])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white mb-1">Use Case Recommender</h2>
        <p className="text-xs text-gray-500">Describe what you want to build — get the best model for the job</p>
      </div>

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
        <input
          className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
          placeholder='e.g. "I need to analyze large PDFs cheaply" or "coding assistant"'
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      {/* Quick picks */}
      <div className="flex flex-wrap gap-2">
        {QUICK_PICKS.map(p => (
          <button
            key={p.label}
            onClick={() => setQuery(p.query)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              query === p.query
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white hover:border-gray-500'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {query.trim() && results.length === 0 && (
        <div className="text-center py-10 text-gray-500 text-sm">
          No strong match found. Try different keywords.
        </div>
      )}

      {results.length > 0 && (
        <div className="grid sm:grid-cols-3 gap-4">
          {results.map(({ model, score }, i) => {
            const meta = modelMetadata[model.id]
            return (
              <div
                key={model.id}
                className={`rounded-xl border p-5 space-y-3 ${PROVIDER_COLORS[model.provider] ?? 'border-gray-700 bg-gray-900/30'}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-xs font-bold ${RANK_STYLES[i]}`}>{RANK_LABELS[i]}</span>
                  <span className="text-xs text-gray-500">{score} match pts</span>
                </div>

                <div>
                  <div className="font-semibold text-white text-sm">{model.name}</div>
                  <div className="text-xs text-gray-500">{model.provider}</div>
                </div>

                {meta?.useCaseReason && (
                  <p className="text-xs text-gray-300 leading-relaxed">{meta.useCaseReason}</p>
                )}

                <div className="space-y-1 pt-1 border-t border-gray-700/50">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <DollarSign className="w-3 h-3" />
                    <span>Input: <span className="text-white">${model.inputPricePer1M.toFixed(2)}</span> / 1M tokens</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Zap className="w-3 h-3" />
                    <span>Context: <span className="text-white">{model.contextWindow >= 1_000_000 ? `${model.contextWindow/1_000_000}M` : `${model.contextWindow/1_000}K`}</span></span>
                  </div>
                  {meta?.capabilities?.includes('reasoning') && (
                    <div className="flex items-center gap-1.5 text-xs text-blue-400">
                      <Brain className="w-3 h-3" />
                      <span>Reasoning model</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {!query.trim() && defaultPicks.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs text-gray-500">Popular starting points</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {defaultPicks.map((model) => {
              const meta = modelMetadata[model.id]
              return (
                <div key={model.id} className={`rounded-xl border p-5 space-y-3 ${PROVIDER_COLORS[model.provider] ?? 'border-gray-700 bg-gray-900/30'}`}>
                  <div className="font-semibold text-white text-sm">{model.name}</div>
                  <p className="text-xs text-gray-300 leading-relaxed">{meta?.useCaseReason}</p>
                  <div className="text-xs text-gray-400 pt-1 border-t border-gray-700/50">
                    <span className="text-white">${model.inputPricePer1M.toFixed(2)}</span> input · <span className="text-white">${model.outputPricePer1M.toFixed(2)}</span> output / 1M
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
