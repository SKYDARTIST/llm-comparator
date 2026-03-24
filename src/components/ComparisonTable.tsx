import { useState, useMemo } from 'react'
import { ChevronUp, ChevronDown, Search } from 'lucide-react'
import type { LLMModel } from '../data/staticModels'

type SortKey = 'name' | 'provider' | 'inputPricePer1M' | 'outputPricePer1M' | 'contextWindow'

function fmtPrice(p: number) {
  if (p === 0) return 'Free'
  if (p < 0.1) return `$${p.toFixed(4)}`
  return `$${p.toFixed(2)}`
}

function fmtContext(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return `${n}`
}

const PROVIDER_COLORS: Record<string, string> = {
  OpenAI: 'bg-emerald-900 text-emerald-300',
  Anthropic: 'bg-orange-900 text-orange-300',
  Google: 'bg-blue-900 text-blue-300',
  xAI: 'bg-gray-700 text-gray-300',
  Meta: 'bg-indigo-900 text-indigo-300',
  Mistral: 'bg-purple-900 text-purple-300',
  DeepSeek: 'bg-cyan-900 text-cyan-300',
  Cohere: 'bg-pink-900 text-pink-300',
}

export default function ComparisonTable({ models }: { models: LLMModel[] }) {
  const [sortKey, setSortKey] = useState<SortKey>('inputPricePer1M')
  const [sortAsc, setSortAsc] = useState(true)
  const [search, setSearch] = useState('')
  const [providerFilter, setProviderFilter] = useState('All')

  const providers = useMemo(() => ['All', ...Array.from(new Set(models.map(m => m.provider))).sort()], [models])

  const minInput = useMemo(() => Math.min(...models.map(m => m.inputPricePer1M)), [models])

  const sorted = useMemo(() => {
    return [...models]
      .filter(m => {
        const matchSearch = m.name.toLowerCase().includes(search.toLowerCase())
        const matchProvider = providerFilter === 'All' || m.provider === providerFilter
        return matchSearch && matchProvider
      })
      .sort((a, b) => {
        const av = a[sortKey]
        const bv = b[sortKey]
        const cmp = typeof av === 'string' ? av.localeCompare(bv as string) : (av as number) - (bv as number)
        return sortAsc ? cmp : -cmp
      })
  }, [models, sortKey, sortAsc, search, providerFilter])

  function handleSort(key: SortKey) {
    if (key === sortKey) setSortAsc(p => !p)
    else { setSortKey(key); setSortAsc(true) }
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronDown className="w-3 h-3 opacity-30" />
    return sortAsc ? <ChevronUp className="w-3 h-3 text-blue-400" /> : <ChevronDown className="w-3 h-3 text-blue-400" />
  }

  const th = 'px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white select-none'
  const td = 'px-4 py-3 text-sm text-gray-200'

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
          <input
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
            placeholder="Search models..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
          value={providerFilter}
          onChange={e => setProviderFilter(e.target.value)}
        >
          {providers.map(p => <option key={p}>{p}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="w-full min-w-[700px]">
          <thead className="bg-gray-800/60">
            <tr>
              <th className={th} onClick={() => handleSort('name')}>
                <span className="flex items-center gap-1">Model <SortIcon col="name" /></span>
              </th>
              <th className={th} onClick={() => handleSort('provider')}>
                <span className="flex items-center gap-1">Provider <SortIcon col="provider" /></span>
              </th>
              <th className={th} onClick={() => handleSort('inputPricePer1M')}>
                <span className="flex items-center gap-1">Input / 1M <SortIcon col="inputPricePer1M" /></span>
              </th>
              <th className={th} onClick={() => handleSort('outputPricePer1M')}>
                <span className="flex items-center gap-1">Output / 1M <SortIcon col="outputPricePer1M" /></span>
              </th>
              <th className={th} onClick={() => handleSort('contextWindow')}>
                <span className="flex items-center gap-1">Context <SortIcon col="contextWindow" /></span>
              </th>
              <th className={`${th} cursor-default`}>Released</th>
              <th className={`${th} cursor-default`}>Capabilities</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {sorted.map(m => (
              <tr key={m.id} className="hover:bg-gray-800/40 transition-colors">
                <td className={td}>
                  <div className="font-medium text-white">{m.name}</div>
                  {m.source === 'openrouter' && (
                    <div className="text-xs text-blue-400 mt-0.5">Live pricing</div>
                  )}
                </td>
                <td className={td}>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${PROVIDER_COLORS[m.provider] ?? 'bg-gray-700 text-gray-300'}`}>
                    {m.provider}
                  </span>
                </td>
                <td className={td}>
                  <span className={m.inputPricePer1M === minInput ? 'text-emerald-400 font-semibold' : ''}>
                    {fmtPrice(m.inputPricePer1M)}
                  </span>
                </td>
                <td className={td}>{fmtPrice(m.outputPricePer1M)}</td>
                <td className={td}>
                  <span className="font-mono text-gray-300">{fmtContext(m.contextWindow)}</span>
                </td>
                <td className={td}>
                  <span className="text-gray-400 text-xs">{m.releaseDate || '—'}</span>
                </td>
                <td className={td}>
                  <div className="flex flex-wrap gap-1">
                    {m.capabilities.slice(0, 3).map(c => (
                      <span key={c} className="px-1.5 py-0.5 bg-gray-700 text-gray-400 text-xs rounded">
                        {c}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {sorted.length === 0 && (
          <div className="text-center py-12 text-gray-500">No models match your filters.</div>
        )}
      </div>
      <div className="text-xs text-gray-600 text-right">{sorted.length} of {models.length} models</div>
    </div>
  )
}
