import { useState, useMemo } from 'react'
import type { LLMModel } from '../data/staticModels'

function fmtCost(n: number) {
  if (n < 0.01) return '<$0.01'
  if (n < 1) return `$${n.toFixed(3)}`
  if (n < 1000) return `$${n.toFixed(2)}`
  return `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
}

function Slider({ label, value, min, max, step, onChange, unit }: {
  label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; unit: string
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">{label}</span>
        <span className="text-white font-mono font-medium">{value.toLocaleString()} {unit}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-gray-700 rounded-full appearance-none cursor-pointer accent-blue-500"
      />
      <div className="flex justify-between text-xs text-gray-600">
        <span>{min.toLocaleString()}</span>
        <span>{max.toLocaleString()}</span>
      </div>
    </div>
  )
}

export default function CostCalculator({ models }: { models: LLMModel[] }) {
  const [inputTokens, setInputTokens] = useState(1_000_000)
  const [outputTokens, setOutputTokens] = useState(500_000)

  const results = useMemo(() => {
    return [...models]
      .map(m => ({
        id: m.id,
        name: m.name,
        provider: m.provider,
        cost: (m.inputPricePer1M * inputTokens + m.outputPricePer1M * outputTokens) / 1_000_000,
      }))
      .sort((a, b) => a.cost - b.cost)
  }, [models, inputTokens, outputTokens])

  const cheapest = results[0]?.cost ?? 0
  const mostExpensive = results[results.length - 1]?.cost ?? 1

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white mb-1">Cost Calculator</h2>
        <p className="text-xs text-gray-500">Estimate your monthly API spend across models</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 bg-gray-800/50 rounded-lg p-4">
        <Slider
          label="Input tokens / month"
          value={inputTokens}
          min={0} max={10_000_000} step={100_000}
          onChange={setInputTokens}
          unit="tokens"
        />
        <Slider
          label="Output tokens / month"
          value={outputTokens}
          min={0} max={5_000_000} step={50_000}
          onChange={setOutputTokens}
          unit="tokens"
        />
      </div>

      <div className="space-y-2">
        {results.map((r, i) => {
          const pct = mostExpensive > 0 ? (r.cost / mostExpensive) * 100 : 0
          const isCheapest = i === 0
          return (
            <div key={r.id} className="flex items-center gap-3">
              <div className="w-32 sm:w-40 text-xs text-gray-300 truncate shrink-0">
                {isCheapest && <span className="text-emerald-400 mr-1">★</span>}
                {r.name}
              </div>
              <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.max(pct, 1)}%`,
                    background: isCheapest ? '#10b981' : `hsl(${220 - pct * 1.5}, 70%, 55%)`,
                  }}
                />
              </div>
              <div className={`w-20 text-right text-sm font-mono font-medium shrink-0 ${isCheapest ? 'text-emerald-400' : 'text-gray-300'}`}>
                {fmtCost(r.cost)}
              </div>
            </div>
          )
        })}
      </div>

      <p className="text-xs text-gray-600">
        Cheapest: <span className="text-emerald-400">{cheapest !== undefined ? fmtCost(cheapest) : '—'}</span>
        {' '}· Most expensive: <span className="text-gray-400">{fmtCost(mostExpensive)}</span> / month
      </p>
    </div>
  )
}
