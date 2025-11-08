type EvaluationMetrics = {
  relevance_score: number;
  factual_accuracy: number;
  coherence_score: number;
  response_quality: number;
};

type ErrorInfo = {
  type: string;
  message: string;
};

export type DataEntry = {
  id: string;
  timestamp: string;
  model: string;
  prompt_tokens: number;
  completion_tokens: number | null;
  total_tokens: number | null;
  response_time_ms: number;
  status: 'success' | 'timeout';
  cost_usd: number;
  temperature: number;
  max_tokens: number;
  prompt_template: string;
  output: string | null;
  evaluation_metrics: EvaluationMetrics | null;
  error: ErrorInfo | null;
};

export type StoredDataEntry = {
  name: string;
  data: { responses: DataEntry[] };
};
