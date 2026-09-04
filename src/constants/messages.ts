import type { MenteeSummary } from "@/types/messages";

export const mockMenteeSummaries: Record<string, MenteeSummary> = {
  "mentee-mt": {
    menteeId: "mentee-mt",
    professionalGoal:
      "Transicionar de QA Engineer a Product Manager en los próximos 6 meses",
    currentRoadmapTitle: "Ruta PM · Stakeholder & Roadmap Sprint",
    progressPercent: 40,
    progressNote:
      "3 hitos en progreso: comunicación con stakeholders, A/B testing y roadmapping",
    nextSessionFocus:
      "Revisar el primer borrador de roadmap de producto y alinear prioridades con el equipo",
    availableHours: "Tardes y noches (6–9 PM UTC-5)",
    activeProgramLabels: ["Sprint de Liderazgo de Producto", "Cohorte Women in Product"],
    generatedAt: "2026-06-16T08:00:00Z",
    isAiGenerated: false, // TODO: set true once Gemini integration is live
  },
  "mentee-lp": {
    menteeId: "mentee-lp",
    professionalGoal:
      "Consolidar habilidades en Data Science y conseguir primer rol en empresa tech",
    currentRoadmapTitle: "Ruta Data Science · Fundamentos y Proyectos",
    progressPercent: 25,
    progressNote: "2 hitos completados: Python y SQL. Próximo: Machine Learning básico",
    nextSessionFocus:
      "Definir proyecto personal de portafolio y revisar estructura del CV técnico",
    availableHours: "Fines de semana (10 AM – 2 PM UTC-5)",
    activeProgramLabels: ["Bootcamp de Data Science"],
    generatedAt: "2026-06-15T10:00:00Z",
    isAiGenerated: false,
  },
};
