import { useState } from 'react'
import { useModels } from './hooks/useModels'
import ComparisonTable from './components/ComparisonTable'
import PriceChart from './components/PriceChart'
import CostCalculator from './components/CostCalculator'
import UseCaseRecommender from './components/UseCaseRecommender'
import './index.css'

const TABS = [
  { id: 'compare', label: 'Compare' },
  { id: 'chart', label: 'Price Chart' },
  { id: 'calculator', label: 'Cost Calculator' },
  { id: 'recommender', label: 'Use Case Recommender' },
]

export default function App() {
  const { models, loading, error, source } = useModels()
  const [activeTab, setActiveTab] = useState('compare')

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">LLM Comparator</h1>
            <p className="text-xs text-gray-500 mt-0.5">Real-time pricing · {models.length} models</p>
          </div>
          <div className="flex items-center gap-2">
            {loading && <span className="text-xs text-gray-500 animate-pulse">Fetching live prices...</span>}
            {!loading && (
              <span className={`text-xs px-2 py-1 rounded-full ${source === 'live' ? 'bg-emerald-900/50 text-emerald-400' : 'bg-gray-800 text-gray-400'}`}>
                {source === 'live' ? '● Live' : '● Cached'}
              </span>
            )}
            {error && <span className="text-xs text-yellow-500">{error}</span>}
          </div>
        </div>

        {/* Scrollable tab bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex overflow-x-auto scrollbar-hide border-t border-gray-800 -mb-px gap-0">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats bar — always visible */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Models tracked', value: models.length },
            { label: 'Providers', value: new Set(models.map(m => m.provider)).size },
            { label: 'Cheapest input', value: models.length ? `$${Math.min(...models.map(m => m.inputPricePer1M)).toFixed(4)}` : '—' },
            { label: 'Largest context', value: models.length ? `${(Math.max(...models.map(m => m.contextWindow)) / 1_000_000).toFixed(0)}M` : '—' },
          ].map(s => (
            <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tab content */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          {activeTab === 'compare' && <ComparisonTable models={models} />}
          {activeTab === 'chart' && <PriceChart models={models} />}
          {activeTab === 'calculator' && <CostCalculator models={models} />}
          {activeTab === 'recommender' && <UseCaseRecommender models={models} />}
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-800 mt-8 pt-6 pb-4 text-center space-y-1">
          <p className="text-xs text-gray-600">
            Pricing: <a href="https://openrouter.ai/api/v1/models" className="text-gray-500 hover:text-gray-400">OpenRouter API</a> (live) + official provider pages (static fallback).
          </p>
          <p className="text-xs text-gray-700">Always verify on official provider pages before production use.</p>
        </footer>
      </main>
    </div>
  )
}
