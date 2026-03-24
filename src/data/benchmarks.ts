// Real benchmark data only — sourced from official pages
// Missing data shown as null (displayed as — in UI)
// Sources:
//   GPT-4o, Gemini 2.5 Pro: anotherwrapper.com/llm-pricing (March 2026)
//   Claude Opus 4.6: anthropic.com/news/claude-opus-4-6 (March 2026)

export interface BenchmarkScore {
  name: string           // benchmark name
  description: string    // what it measures
  score: number | null   // null = not available
  unit: '%' | 'elo'
}

export const benchmarkData: Record<string, BenchmarkScore[]> = {
  'openai/gpt-4o': [
    { name: 'MMLU',          description: 'General knowledge',       score: 88.7, unit: '%' },
    { name: 'HumanEval',     description: 'Coding',                  score: 90.0, unit: '%' },
    { name: 'GPQA',          description: 'Expert reasoning',        score: 70.1, unit: '%' },
    { name: 'GPQA Diamond',  description: 'Graduate reasoning',      score: 56.1, unit: '%' },
    { name: 'SWE-bench',     description: 'Real-world coding tasks', score: 33.2, unit: '%' },
    { name: 'MATH',          description: 'Math problems',           score: 76.6, unit: '%' },
    { name: 'HLE',           description: 'Hardest human exams',     score: 5.3,  unit: '%' },
    { name: 'ARC-AGI 2',     description: 'Novel problem solving',   score: null, unit: '%' },
    { name: 'Terminal-Bench',description: 'Agentic terminal coding', score: null, unit: '%' },
  ],
  'google/gemini-2.5-pro': [
    { name: 'MMLU',          description: 'General knowledge',       score: 88.9, unit: '%' },
    { name: 'HumanEval',     description: 'Coding',                  score: 88.2, unit: '%' },
    { name: 'GPQA',          description: 'Expert reasoning',        score: 83.0, unit: '%' },
    { name: 'GPQA Diamond',  description: 'Graduate reasoning',      score: 86.4, unit: '%' },
    { name: 'SWE-bench',     description: 'Real-world coding tasks', score: 63.2, unit: '%' },
    { name: 'MATH',          description: 'Math problems',           score: 97.1, unit: '%' },
    { name: 'HLE',           description: 'Hardest human exams',     score: 17.8, unit: '%' },
    { name: 'ARC-AGI 2',     description: 'Novel problem solving',   score: 4.9,  unit: '%' },
    { name: 'Terminal-Bench',description: 'Agentic terminal coding', score: null, unit: '%' },
  ],
  'anthropic/claude-opus-4.6': [
    { name: 'MMLU',          description: 'General knowledge',       score: 91.1, unit: '%' },
    { name: 'HumanEval',     description: 'Coding',                  score: null, unit: '%' },
    { name: 'GPQA',          description: 'Expert reasoning',        score: null, unit: '%' },
    { name: 'GPQA Diamond',  description: 'Graduate reasoning',      score: 91.3, unit: '%' },
    { name: 'SWE-bench',     description: 'Real-world coding tasks', score: 80.8, unit: '%' },
    { name: 'MATH',          description: 'Math problems',           score: null, unit: '%' },
    { name: 'HLE',           description: 'Hardest human exams',     score: 53.0, unit: '%' },
    { name: 'ARC-AGI 2',     description: 'Novel problem solving',   score: 68.8, unit: '%' },
    { name: 'Terminal-Bench',description: 'Agentic terminal coding', score: 65.4, unit: '%' },
  ],
}

export const ALL_BENCHMARKS = [
  { name: 'MMLU',           description: 'General knowledge (multilingual)' },
  { name: 'HumanEval',      description: 'Coding ability' },
  { name: 'GPQA Diamond',   description: 'Graduate-level reasoning' },
  { name: 'SWE-bench',      description: 'Real-world software engineering' },
  { name: 'MATH',           description: 'Math problem solving' },
  { name: 'HLE',            description: 'Humanity\'s Last Exam (hardest)' },
  { name: 'ARC-AGI 2',      description: 'Novel problem solving' },
  { name: 'Terminal-Bench', description: 'Agentic terminal coding' },
]
