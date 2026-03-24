import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import type { LLMModel } from '../data/staticModels'

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

function shortName(name: string) {
  // Strip provider prefix (e.g. "Anthropic: Claude 3 Haiku" → "Claude 3 Haiku")
  const stripped = name.includes(': ') ? name.split(': ')[1] : name
  return stripped
    .replace('Claude ', 'C.')
    .replace('Gemini ', 'G.')
    .replace('Llama ', 'L.')
    .replace('Mistral ', 'M.')
    .replace(' Instruct', '')
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm shadow-xl">
      <p className="text-white font-medium mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: ${p.value.toFixed(4)} / 1M tokens
        </p>
      ))}
    </div>
  )
}

export default function PriceChart({ models, isDark = true }: { models: LLMModel[]; isDark?: boolean }) {
  const data = [...models]
    .sort((a, b) => a.inputPricePer1M - b.inputPricePer1M)
    .map(m => ({
      name: shortName(m.name),
      provider: m.provider,
      Input: m.inputPricePer1M,
      Output: m.outputPricePer1M,
    }))

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
      <h2 className="text-lg font-semibold text-white mb-1">Price Comparison</h2>
      <p className="text-xs text-gray-500 mb-6">USD per 1M tokens · sorted cheapest first</p>
      <ResponsiveContainer width="100%" height={Math.max(420, data.length * 50)}>
        <BarChart data={data} layout="vertical" margin={{ left: 16, right: 24, top: 0, bottom: 0 }}>
          <XAxis
            type="number"
            tickFormatter={v => `$${v}`}
            tick={{ fill: isDark ? '#6b7280' : '#4b5563', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={110}
            tick={{ fill: isDark ? '#d1d5db' : '#111827', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
          <Legend
            wrapperStyle={{ color: '#9ca3af', fontSize: 12, paddingTop: 16 }}
          />
          <Bar dataKey="Input" radius={[0, 4, 4, 0]} maxBarSize={18} fill="#38bdf8">
            {data.map(d => (
              <Cell key={d.name} fill={PROVIDER_COLORS[d.provider] ?? '#6b7280'} opacity={0.9} />
            ))}
          </Bar>
          <Bar dataKey="Output" radius={[0, 4, 4, 0]} maxBarSize={18} fill="#7c3aed" opacity={0.7} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
