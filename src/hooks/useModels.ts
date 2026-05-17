import { useState, useEffect } from 'react'
import { staticModels, type LLMModel } from '../data/staticModels'
import {
  mergeLiveAndStaticModels,
  parseOpenRouterResponse,
  type OpenRouterResponse,
} from '../lib/modelUtils'

export function useModels() {
  const [models, setModels] = useState<LLMModel[]>(staticModels)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [source, setSource] = useState<'live' | 'static'>('static')

  useEffect(() => {
    fetch('https://openrouter.ai/api/v1/models')
      .then(async r => {
        if (!r.ok) throw new Error(`OpenRouter returned HTTP ${r.status}`)
        return r.json() as Promise<OpenRouterResponse>
      })
      .then(data => {
        const liveModels = parseOpenRouterResponse(data)
        if (liveModels.length === 0) {
          throw new Error('OpenRouter returned no tracked models')
        }

        setModels(mergeLiveAndStaticModels(liveModels))
        setSource('live')
      })
      .catch(err => {
        console.error('OpenRouter fetch failed, using static data:', err)
        setError('Using cached pricing data')
        setModels(staticModels)
        setSource('static')
      })
      .finally(() => setLoading(false))
  }, [])

  return { models, loading, error, source }
}
