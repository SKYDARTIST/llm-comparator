export interface LLMModel {
  id: string
  name: string
  provider: string
  inputPricePer1M: number
  outputPricePer1M: number
  contextWindow: number
  releaseDate: string
  description: string
  capabilities: string[]
  source: 'openrouter' | 'static'
}

// Metadata for the 20 flagship models — release dates + capabilities
// Pricing is overridden by live OpenRouter data (see useModels.ts)
// Sources: official provider pages (March 2026)
export const modelMetadata: Record<string, { releaseDate: string; capabilities: string[] }> = {
  // Dates sourced from OpenRouter `created` timestamps (verified March 2026)
  'openai/gpt-5':                              { releaseDate: '2025-08', capabilities: ['vision', 'function-calling', 'json-mode', 'streaming'] },
  'openai/gpt-4o':                             { releaseDate: '2024-05', capabilities: ['vision', 'function-calling', 'json-mode', 'streaming'] },
  'openai/gpt-4o-mini':                        { releaseDate: '2024-07', capabilities: ['vision', 'function-calling', 'json-mode', 'streaming'] },
  'openai/o4-mini':                            { releaseDate: '2025-04', capabilities: ['reasoning', 'function-calling', 'streaming'] },
  'openai/o3':                                 { releaseDate: '2025-04', capabilities: ['reasoning', 'function-calling', 'streaming'] },
  'anthropic/claude-opus-4.6':                 { releaseDate: '2026-02', capabilities: ['vision', 'function-calling', 'json-mode', 'streaming'] },
  'anthropic/claude-sonnet-4.6':               { releaseDate: '2026-02', capabilities: ['vision', 'function-calling', 'json-mode', 'streaming'] },
  'anthropic/claude-haiku-4.5':                { releaseDate: '2025-10', capabilities: ['vision', 'function-calling', 'json-mode', 'streaming'] },
  'google/gemini-2.5-pro':                     { releaseDate: '2025-03', capabilities: ['vision', 'function-calling', 'json-mode', 'streaming'] },
  'google/gemini-2.5-flash':                   { releaseDate: '2025-03', capabilities: ['vision', 'function-calling', 'json-mode', 'streaming'] },
  'google/gemini-2.0-flash-001':               { releaseDate: '2025-02', capabilities: ['vision', 'function-calling', 'json-mode', 'streaming'] },
  'x-ai/grok-4':                               { releaseDate: '2025-07', capabilities: ['vision', 'function-calling', 'json-mode', 'streaming'] },
  'x-ai/grok-3-mini':                          { releaseDate: '2025-02', capabilities: ['reasoning', 'function-calling', 'streaming'] },
  'meta-llama/llama-4-maverick':               { releaseDate: '2025-04', capabilities: ['vision', 'function-calling', 'json-mode', 'streaming'] },
  'meta-llama/llama-4-scout':                  { releaseDate: '2025-04', capabilities: ['vision', 'function-calling', 'streaming'] },
  'meta-llama/llama-3.3-70b-instruct':         { releaseDate: '2024-12', capabilities: ['function-calling', 'json-mode', 'streaming'] },
  'mistralai/mistral-large-2512':              { releaseDate: '2024-12', capabilities: ['function-calling', 'json-mode', 'streaming'] },
  'mistralai/mistral-small-3.1-24b-instruct':  { releaseDate: '2025-03', capabilities: ['vision', 'function-calling', 'streaming'] },
  'deepseek/deepseek-chat-v3-0324':            { releaseDate: '2025-03', capabilities: ['function-calling', 'json-mode', 'streaming'] },
  'deepseek/deepseek-r1-0528':                 { releaseDate: '2025-05', capabilities: ['reasoning', 'streaming'] },
  'cohere/command-r-plus-08-2024':             { releaseDate: '2024-08', capabilities: ['function-calling', 'json-mode', 'streaming', 'rag'] },
}

// Empty — all data comes live from OpenRouter, metadata injected from modelMetadata above
export const staticModels: LLMModel[] = []
