import type { AssessmentQuestion } from "@/types/database/assessment";

export const mentorQuestions: AssessmentQuestion[] = [
  {
    id: "current_area",
    question: "¿En qué área trabajas actualmente?",
    type: "single",
    options: [
      "Tecnología / Software",
      "Data / AI",
      "Diseño / UX",
      "Producto",
      "Marketing",
      "Negocios",
      "Finanzas",
      "Emprendimiento",
      "Educación",
      "Liderazgo / Management",
      "Otra",
    ],
  },

  {
    id: "experience_years",
    question: "¿Cuántos años de experiencia profesional tienes?",
    type: "single",
    options: [
      "1–3 años",
      "3–5 años",
      "5–8 años",
      "8–12 años",
      "12+ años",
    ],
  },

  {
    id: "mentoring_topics",
    question: "¿Qué temas te sientes cómoda mentoreando?",
    type: "multiple",
    options: [
      "Claridad en carrera",
      "Tecnología",
      "Mujeres en Tecnología",
      "Primer empleo",
      "Universidad",
      "Cambio de carrera",
      "Liderazgo",
      "Networking",
      "Entrevistas",
      "CV / LinkedIn",
      "Confianza profesional",
      "Productividad",
      "Emprendimiento",
      "Desarrollo profesional",
    ],
  },

  {
    id: "mentoring_motivation",
    question: "¿Qué disfrutas más al mentorar?",
    type: "multiple",
    options: [
      "Ayudar a alguien a ganar claridad",
      "Compartir experiencias reales",
      "Ayudar a construir confianza",
      "Guiar decisiones importantes",
      "Impulsar liderazgo",
      "Ayudar a entrar a tecnología",
      "Conectar personas con oportunidades",
      "Ver crecer a otras mujeres",
    ],
  },

  {
    id: "mentoring_style",
    question: "¿Cómo describirías tu estilo de mentoría?",
    type: "single",
    options: [
      "Cercana y empática",
      "Estratégica y directa",
      "Estructurada y organizada",
      "Motivadora",
      "Técnica y práctica",
      "Reflexiva y orientadora",
    ],
  },

  {
    id: "session_preference",
    question: "¿Cómo prefieres llevar una sesión?",
    type: "multiple",
    options: [
      "Conversación abierta",
      "Planes accionables",
      "Resolución de problemas específicos",
      "Compartir experiencias personales",
      "Revisión de metas y seguimiento",
      "Retroalimentación directa",
    ],
  },

  {
    id: "preferred_mentees",
    question: "¿Qué tipo de mentees disfrutas apoyar más?",
    type: "multiple",
    options: [
      "Estudiantes explorando opciones",
      "Mujeres entrando a tecnología",
      "Personas buscando claridad profesional",
      "Inicio de carrera",
      "Personas cambiando de carrera",
      "Mujeres desarrollando liderazgo",
      "Personas con baja confianza profesional",
      "Primeras generaciones universitarias",
    ],
  },

  {
    id: "mentee_outcomes",
    question: "¿Qué te gustaría ayudarles a lograr?",
    type: "multiple",
    options: [
      "Más claridad",
      "Más confianza",
      "Conseguir oportunidades",
      "Crear un plan profesional",
      "Crecer en tecnología",
      "Prepararse para entrevistas",
      "Construir liderazgo",
      "Expandir networking",
    ],
  },

  {
    id: "mentoring_frequency",
    question: "¿Con qué frecuencia te gustaría mentorear?",
    type: "single",
    options: [
      "Ocasionalmente",
      "1 vez al mes",
      "2 veces al mes",
      "Seguimiento continuo",
    ],
  },

  {
    id: "mentor_reason",
    question: "¿Por qué decidiste convertirte en mentora?",
    type: "text",
    placeholder:
      "Ej. Quiero ayudar a otras mujeres a tener las oportunidades que yo no tuve.",
  },

  {
    id: "availability_slots",
    question: "¿Cuándo estás disponible para sesiones?",
    type: "multiple",
    minSelections: 3,
    maxSelections: 5,
    options: [
      "Lunes · 9:00 AM",
      "Lunes · 2:00 PM",
      "Martes · 10:00 AM",
      "Martes · 4:00 PM",
      "Miércoles · 9:00 AM",
      "Miércoles · 3:00 PM",
      "Jueves · 10:00 AM",
      "Jueves · 4:00 PM",
      "Viernes · 9:00 AM",
      "Viernes · 3:00 PM",
      "Sábado · 10:00 AM",
      "Sábado · 12:00 PM",
    ],
  },
];