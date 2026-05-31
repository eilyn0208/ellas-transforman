export type QuestionType = "single" | "multiple" | "scale" | "text";

export interface AssessmentQuestion {
  id: string;
  question: string;
  type: QuestionType;
  options?: string[];
  placeholder?: string;
}