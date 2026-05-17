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

export interface ModelMeta {
  releaseDate: string
  capabilities: string[]
  useCases: string[]  // keywords matched against user input
  useCaseReason: string  // shown in recommender — why this model fits
}

// Metadata for the 20 flagship models
// Dates: sourced from OpenRouter `created` timestamps (verified March 2026)
// Use cases: based on known model strengths — only added where confident
export const modelMetadata: Record<string, ModelMeta> = {
  'openai/gpt-5': {
    releaseDate: '2025-08',
    capabilities: ['vision', 'function-calling', 'json-mode', 'streaming'],
    useCases: ['general', 'coding', 'writing', 'analysis', 'research', 'multimodal', 'image', 'complex'],
    useCaseReason: 'OpenAI\'s most capable model. Excellent across all tasks.',
  },
  'openai/gpt-4o': {
    releaseDate: '2024-05',
    capabilities: ['vision', 'function-calling', 'json-mode', 'streaming'],
    useCases: ['general', 'coding', 'vision', 'image', 'multimodal', 'chatbot', 'writing', 'analysis'],
    useCaseReason: 'Best all-round model for general use, vision, and coding.',
  },
  'openai/gpt-4o-mini': {
    releaseDate: '2024-07',
    capabilities: ['vision', 'function-calling', 'json-mode', 'streaming'],
    useCases: ['budget', 'cheap', 'simple', 'chatbot', 'high-volume', 'classification', 'summarization'],
    useCaseReason: 'Best budget OpenAI model for simple, high-volume tasks.',
  },
  'openai/o4-mini': {
    releaseDate: '2025-04',
    capabilities: ['reasoning', 'function-calling', 'streaming'],
    useCases: ['reasoning', 'math', 'science', 'coding', 'STEM', 'logic', 'problem-solving', 'cheap'],
    useCaseReason: 'Fast reasoning model. Best for math, science, and logic at lower cost.',
  },
  'openai/o3': {
    releaseDate: '2025-04',
    capabilities: ['reasoning', 'function-calling', 'streaming'],
    useCases: ['reasoning', 'math', 'science', 'STEM', 'research', 'complex', 'logic', 'hard'],
    useCaseReason: 'Top reasoning model for the hardest math, science, and research problems.',
  },
  'anthropic/claude-opus-4.6': {
    releaseDate: '2026-02',
    capabilities: ['vision', 'function-calling', 'json-mode', 'streaming'],
    useCases: ['complex', 'research', 'analysis', 'writing', 'reasoning', 'hard', 'nuanced', 'long'],
    useCaseReason: 'Anthropic\'s most powerful model. Best for complex reasoning and deep analysis.',
  },
  'anthropic/claude-sonnet-4.6': {
    releaseDate: '2026-02',
    capabilities: ['vision', 'function-calling', 'json-mode', 'streaming'],
    useCases: ['coding', 'writing', 'analysis', 'general', 'long-context', 'documents', 'research', 'agentic'],
    useCaseReason: 'Best balance of intelligence and speed. Excellent for coding and writing.',
  },
  'anthropic/claude-haiku-4.5': {
    releaseDate: '2025-10',
    capabilities: ['vision', 'function-calling', 'json-mode', 'streaming'],
    useCases: ['fast', 'cheap', 'budget', 'high-volume', 'simple', 'chatbot', 'summarization', 'classification'],
    useCaseReason: 'Fastest Claude model. Ideal for real-time, high-volume, budget-sensitive tasks.',
  },
  'google/gemini-2.5-pro': {
    releaseDate: '2025-03',
    capabilities: ['vision', 'function-calling', 'json-mode', 'streaming'],
    useCases: ['long-context', 'documents', 'PDF', 'research', 'analysis', 'coding', 'multimodal', 'video'],
    useCaseReason: 'Massive context window. Best for analyzing large documents, codebases, or videos.',
  },
  'google/gemini-2.5-flash': {
    releaseDate: '2025-03',
    capabilities: ['vision', 'function-calling', 'json-mode', 'streaming'],
    useCases: ['fast', 'cheap', 'long-context', 'documents', 'summarization', 'multimodal', 'high-volume'],
    useCaseReason: 'Fast and cheap with huge context. Great for document processing at scale.',
  },
  'google/gemini-2.0-flash-001': {
    releaseDate: '2025-02',
    capabilities: ['vision', 'function-calling', 'json-mode', 'streaming'],
    useCases: ['fast', 'cheap', 'multimodal', 'high-volume', 'simple', 'chatbot'],
    useCaseReason: 'Reliable and fast Google model for everyday multimodal tasks.',
  },
  'x-ai/grok-4': {
    releaseDate: '2025-07',
    capabilities: ['vision', 'function-calling', 'json-mode', 'streaming'],
    useCases: ['realtime', 'news', 'current events', 'twitter', 'X', 'social media', 'research', 'web'],
    useCaseReason: 'Access to real-time X/Twitter data. Best for current events and social media analysis.',
  },
  'x-ai/grok-3-mini': {
    releaseDate: '2025-02',
    capabilities: ['reasoning', 'function-calling', 'streaming'],
    useCases: ['cheap', 'reasoning', 'budget', 'math', 'logic', 'fast'],
    useCaseReason: 'Affordable reasoning model with access to real-time X data.',
  },
  'meta-llama/llama-4-maverick': {
    releaseDate: '2025-04',
    capabilities: ['vision', 'function-calling', 'json-mode', 'streaming'],
    useCases: ['open-source', 'privacy', 'self-hosting', 'general', 'coding', 'multimodal', 'budget'],
    useCaseReason: 'Best open-source model. Ideal when data privacy or self-hosting matters.',
  },
  'meta-llama/llama-4-scout': {
    releaseDate: '2025-04',
    capabilities: ['vision', 'function-calling', 'streaming'],
    useCases: ['cheap', 'open-source', 'privacy', 'fast', 'simple', 'budget', 'self-hosting'],
    useCaseReason: 'Lightweight open model. Best for cheap, private, simple use cases.',
  },
  'meta-llama/llama-3.3-70b-instruct': {
    releaseDate: '2024-12',
    capabilities: ['function-calling', 'json-mode', 'streaming'],
    useCases: ['open-source', 'privacy', 'cheap', 'general', 'coding', 'self-hosting'],
    useCaseReason: 'Proven open-source model. Solid performance at very low cost.',
  },
  'mistralai/mistral-large-2512': {
    releaseDate: '2024-12',
    capabilities: ['function-calling', 'json-mode', 'streaming'],
    useCases: ['multilingual', 'european', 'compliance', 'coding', 'general', 'GDPR', 'enterprise'],
    useCaseReason: 'Best for multilingual tasks and European data compliance (GDPR).',
  },
  'mistralai/mistral-small-3.1-24b-instruct': {
    releaseDate: '2025-03',
    capabilities: ['vision', 'function-calling', 'streaming'],
    useCases: ['cheap', 'budget', 'multilingual', 'fast', 'simple', 'vision'],
    useCaseReason: 'Affordable Mistral model with vision support and multilingual capability.',
  },
  'deepseek/deepseek-chat-v3-0324': {
    releaseDate: '2025-03',
    capabilities: ['function-calling', 'json-mode', 'streaming'],
    useCases: ['coding', 'cheap', 'budget', 'general', 'analysis', 'fast'],
    useCaseReason: 'Exceptional coding performance at a fraction of GPT-4o cost.',
  },
  'deepseek/deepseek-r1-0528': {
    releaseDate: '2025-05',
    capabilities: ['reasoning', 'streaming'],
    useCases: ['reasoning', 'math', 'coding', 'science', 'STEM', 'cheap', 'logic', 'research'],
    useCaseReason: 'Best value reasoning model. Matches frontier quality at very low cost.',
  },
  'cohere/command-r-plus-08-2024': {
    releaseDate: '2024-08',
    capabilities: ['function-calling', 'json-mode', 'streaming', 'rag'],
    useCases: ['RAG', 'search', 'retrieval', 'enterprise', 'documents', 'knowledge base', 'grounding'],
    useCaseReason: 'Purpose-built for RAG and enterprise search. Best retrieval-augmented generation.',
  },
}

function snapshotModel(
  id: keyof typeof modelMetadata,
  name: string,
  provider: string,
  inputPricePer1M: number,
  outputPricePer1M: number,
  contextWindow: number,
  description: string
): LLMModel {
  const meta = modelMetadata[id]
  return {
    id,
    name,
    provider,
    inputPricePer1M,
    outputPricePer1M,
    contextWindow,
    releaseDate: meta.releaseDate,
    description,
    capabilities: meta.capabilities,
    source: 'static',
  }
}

// Curated fallback snapshot.
// Used when OpenRouter is unavailable, rate-limited, or returns no tracked models.
// Values are intended for portfolio/demo resilience, not billing authority.
export const staticModels: LLMModel[] = [
  snapshotModel('openai/gpt-5', 'GPT-5', 'OpenAI', 5, 30, 400_000, 'Frontier general-purpose model snapshot.'),
  snapshotModel('openai/gpt-4o', 'GPT-4o', 'OpenAI', 2.5, 10, 128_000, 'Balanced multimodal model.'),
  snapshotModel('openai/gpt-4o-mini', 'GPT-4o Mini', 'OpenAI', 0.15, 0.6, 128_000, 'Low-cost high-volume model.'),
  snapshotModel('openai/o4-mini', 'o4-mini', 'OpenAI', 1.1, 4.4, 200_000, 'Compact reasoning model.'),
  snapshotModel('openai/o3', 'o3', 'OpenAI', 2, 8, 200_000, 'Reasoning-focused model.'),
  snapshotModel('anthropic/claude-opus-4.6', 'Claude Opus 4.6', 'Anthropic', 15, 75, 200_000, 'Deep analysis and complex reasoning model.'),
  snapshotModel('anthropic/claude-sonnet-4.6', 'Claude Sonnet 4.6', 'Anthropic', 3, 15, 200_000, 'Balanced coding and writing model.'),
  snapshotModel('anthropic/claude-haiku-4.5', 'Claude Haiku 4.5', 'Anthropic', 1, 5, 200_000, 'Fast Claude family model.'),
  snapshotModel('google/gemini-2.5-pro', 'Gemini 2.5 Pro', 'Google', 1.25, 10, 1_000_000, 'Large-context multimodal model.'),
  snapshotModel('google/gemini-2.5-flash', 'Gemini 2.5 Flash', 'Google', 0.3, 2.5, 1_000_000, 'Fast large-context model.'),
  snapshotModel('google/gemini-2.0-flash-001', 'Gemini 2.0 Flash', 'Google', 0.1, 0.4, 1_000_000, 'Fast everyday multimodal model.'),
  snapshotModel('x-ai/grok-4', 'Grok 4', 'xAI', 3, 15, 1_000_000, 'Current-events and social analysis model.'),
  snapshotModel('x-ai/grok-3-mini', 'Grok 3 Mini', 'xAI', 0.3, 0.5, 128_000, 'Lower-cost reasoning model.'),
  snapshotModel('meta-llama/llama-4-maverick', 'Llama 4 Maverick', 'Meta', 0.18, 0.6, 1_000_000, 'Open model for privacy-sensitive use cases.'),
  snapshotModel('meta-llama/llama-4-scout', 'Llama 4 Scout', 'Meta', 0.08, 0.3, 1_000_000, 'Lightweight open model.'),
  snapshotModel('mistralai/mistral-large-2512', 'Mistral Large', 'Mistral', 2, 6, 128_000, 'Multilingual and enterprise-friendly model.'),
  snapshotModel('mistralai/mistral-small-3.1-24b-instruct', 'Mistral Small 3.1', 'Mistral', 0.1, 0.3, 128_000, 'Fast multilingual model.'),
  snapshotModel('deepseek/deepseek-chat-v3-0324', 'DeepSeek V3', 'DeepSeek', 0.27, 1.1, 128_000, 'Low-cost coding and general model.'),
  snapshotModel('deepseek/deepseek-r1-0528', 'DeepSeek R1', 'DeepSeek', 0.55, 2.19, 128_000, 'Low-cost reasoning model.'),
  snapshotModel('cohere/command-r-plus-08-2024', 'Command R+', 'Cohere', 2.5, 10, 128_000, 'RAG and enterprise search model.'),
].sort((a, b) => a.inputPricePer1M - b.inputPricePer1M)
