export type QuestionType = "single" | "multiple" | "scale" | "text";

export interface AssessmentQuestion {
  id: string;
  question?: string;
  title?: string;
  subtitle?: string;
  type: QuestionType;
  options?: string[];
  maxSelections?: number;
  min?: number;
  max?: number;
  maxLength?: number;
  placeholder?: string;
}