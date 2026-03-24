import { useState } from 'react'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts'
import type { LLMModel } from '../data/staticModels'
import { benchmarkData, ALL_BENCHMARKS } from '../data/benchmarks'

const PROVIDER_COLORS: Record<string, string> = {
  OpenAI: '#10b981',
  Anthropic: '#f97316',
  Google: '#3b82f6',
  xAI: '#9ca3af',
  Meta: '#818cf8',
  Mistral: '#a855f7',
  DeepSeek: '#06b6d4',
  Cohere: '#ec4899',
}

const CHART_COLORS = ['#3b82f6', '#f97316', '#10b981']

function fmtCtx(n: number) {
  if (n >= 1_000_000) return `${n / 1_000_000}M`
  return `${n / 1_000}K`
}

const BENCHMARK_MODEL_IDS = ['openai/gpt-4o', 'google/gemini-2.5-pro', 'anthropic/claude-opus-4.6']

export default function SideBySide({ models }: { models: LLMModel[] }) {
  const [selected, setSelected] = useState<string[]>(BENCHMARK_MODEL_IDS)

  const benchmarkModels = models.filter(m => BENCHMARK_MODEL_IDS.includes(m.id))

  const toggle = (id: string) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : prev.length < 3
        ? [...prev, id]
        : prev
    )
  }

  const chosen = selected.map(id => benchmarkModels.find(m => m.id === id)).filter(Boolean) as LLMModel[]

  // Radar chart data — only benchmarks where at least one model has data
  const radarData = ALL_BENCHMARKS
    .map(b => {
      const entry: Record<string, any> = { benchmark: b.name }
      chosen.forEach(m => {
        const scores = benchmarkData[m.id]
        const s = scores?.find(x => x.name === b.name)
        entry[m.name] = s?.score ?? null
      })
      return entry
    })
    .filter(row => chosen.some(m => row[m.name] !== null))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white mb-1">Side-by-Side Comparison</h2>
        <p className="text-xs text-gray-500">Select up to 3 models to compare head-to-head</p>
      </div>

      {/* Model picker */}
      <div className="flex flex-wrap gap-2">
        {benchmarkModels.map(m => (
          <button
            key={m.id}
            onClick={() => toggle(m.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              selected.includes(m.id)
                ? 'bg-blue-600 border-blue-500 text-white'
                : selected.length >= 3
                ? 'bg-gray-800 border-gray-700 text-gray-600 cursor-not-allowed'
                : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white hover:border-gray-500'
            }`}
          >
            {m.name}
          </button>
        ))}
      </div>

      {chosen.length === 0 && (
        <div className="text-center py-12 text-gray-600 text-sm">
          Select 2 or 3 models above to compare
        </div>
      )}

      {chosen.length >= 2 && (
        <div className="space-y-8">
          {/* Specs table */}
          <div className="overflow-x-auto rounded-xl border border-gray-800">
            <table className="w-full">
              <thead className="bg-gray-800/60">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Metric</th>
                  {chosen.map((m, i) => (
                    <th key={m.id} className="px-4 py-3 text-left text-xs font-semibold uppercase" style={{ color: CHART_COLORS[i] }}>
                      {m.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {[
                  { label: 'Provider', fn: (m: LLMModel) => (
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{ background: PROVIDER_COLORS[m.provider] + '22', color: PROVIDER_COLORS[m.provider] }}>
                      {m.provider}
                    </span>
                  )},
                  { label: 'Input / 1M tokens', fn: (m: LLMModel) => `$${m.inputPricePer1M.toFixed(2)}` },
                  { label: 'Output / 1M tokens', fn: (m: LLMModel) => `$${m.outputPricePer1M.toFixed(2)}` },
                  { label: 'Context Window', fn: (m: LLMModel) => fmtCtx(m.contextWindow) },
                  { label: 'Released', fn: (m: LLMModel) => m.releaseDate || '—' },
                  { label: 'Capabilities', fn: (m: LLMModel) => (
                    <div className="flex flex-wrap gap-1">
                      {m.capabilities.length ? m.capabilities.slice(0, 3).map(c => (
                        <span key={c} className="px-1.5 py-0.5 bg-gray-700 text-gray-400 text-xs rounded">{c}</span>
                      )) : <span className="text-gray-600">—</span>}
                    </div>
                  )},
                ].map(row => (
                  <tr key={row.label} className="hover:bg-gray-800/30">
                    <td className="px-4 py-3 text-xs text-gray-400">{row.label}</td>
                    {chosen.map(m => (
                      <td key={m.id} className="px-4 py-3 text-sm text-gray-200">{row.fn(m)}</td>
                    ))}
                  </tr>
                ))}

                {/* Benchmark rows */}
                <tr className="bg-gray-800/20">
                  <td colSpan={chosen.length + 1} className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Benchmarks
                  </td>
                </tr>
                {ALL_BENCHMARKS.map(b => {
                  const scores = chosen.map(m => benchmarkData[m.id]?.find(x => x.name === b.name)?.score ?? null)
                  if (scores.every(s => s === null)) return null
                  const maxScore = Math.max(...scores.filter(s => s !== null) as number[])
                  return (
                    <tr key={b.name} className="hover:bg-gray-800/30">
                      <td className="px-4 py-3 text-xs text-gray-400">
                        <div>{b.name}</div>
                        <div className="text-gray-600 text-xs">{b.description}</div>
                      </td>
                      {scores.map((score, i) => (
                        <td key={i} className="px-4 py-3 text-sm">
                          {score === null
                            ? <span className="text-gray-700">—</span>
                            : <span className={score === maxScore ? 'text-emerald-400 font-semibold' : 'text-gray-300'}>
                                {score}%
                              </span>
                          }
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Radar chart — only if at least one model has benchmark data */}
          {radarData.length > 0 && (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <h3 className="text-sm font-semibold text-white mb-1">Benchmark Radar</h3>
              <p className="text-xs text-gray-500 mb-4">Only shows benchmarks with available data · — means no data</p>
              <ResponsiveContainer width="100%" height={320}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="benchmark" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8 }}
                    labelStyle={{ color: '#fff' }}
                    formatter={(val: any) => val === null ? '—' : `${val}%`}
                  />
                  {chosen.map((m, i) => (
                    <Radar
                      key={m.id}
                      name={m.name}
                      dataKey={m.name}
                      stroke={CHART_COLORS[i]}
                      fill={CHART_COLORS[i]}
                      fillOpacity={0.15}
                      strokeWidth={2}
                    />
                  ))}
                </RadarChart>
              </ResponsiveContainer>
              <div className="flex gap-4 justify-center mt-2">
                {chosen.map((m, i) => (
                  <div key={m.id} className="flex items-center gap-1.5 text-xs" style={{ color: CHART_COLORS[i] }}>
                    <div className="w-3 h-0.5 rounded" style={{ background: CHART_COLORS[i] }} />
                    {m.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-gray-700">
            Benchmark sources: anotherwrapper.com (GPT-4o, Gemini 2.5 Pro) · anthropic.com (Claude Opus 4.6) · — = no verified data available
          </p>
        </div>
      )}
    </div>
  )
}
