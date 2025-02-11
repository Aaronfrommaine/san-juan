export interface QuestionOption {
  label: string;
  value: InvestorType;
}

export interface Question {
  id: number;
  question: string;
  options: QuestionOption[];
}

export type InvestorType = 'hnw' | 'diaspora' | 'impact' | 'institutional' | 'lifestyle';

export interface InvestorResult {
  title: string;
  description: string;
  recommendations: string[];
  nextSteps: string[];
}