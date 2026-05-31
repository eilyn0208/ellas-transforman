import type { AssessmentQuestion } from "@/types/database/assessment";

export const menteeQuestions: AssessmentQuestion[] = [
  {
    id: "stage",
    title: "¿En qué etapa estás actualmente?",
    subtitle:
      "Esto nos ayuda a recomendarte mentoras con experiencias relevantes.",
    type: "single",
    options: [
      "Secundaria",
      "Preparatoria",
      "Universidad",
      "Primer trabajo",
      "Cambio de carrera",
      "Explorando opciones",
    ],
  },

  {
    id: "interests",
    title: "¿Qué áreas te interesan más?",
    subtitle: "Selecciona hasta 3 opciones.",
    type: "multiple",
    maxSelections: 3,
    options: [
      "Tecnología",
      "Diseño / UX",
      "Negocios",
      "Marketing",
      "Ciencia",
      "Emprendimiento",
      "Liderazgo",
      "Finanzas",
      "Producto",
      "Data / AI",
      "Educación",
      "Creatividad / Media",
      "Todavía no estoy segura",
    ],
  },


  {
  id: "currentSituation",
  title: "¿Cómo describirías tu situación actual?",
  subtitle: "Selecciona la opción que más se acerque a ti.",
  type: "single",
  options: [
    "Tengo intereses pero no claridad",
    "Sé lo que quiero pero no sé cómo lograrlo",
    "Quiero explorar caminos profesionales",
    "Me siento confundida sobre mi futuro",
    "Quiero crecer profesionalmente",
    "Quiero cambiar de dirección",
    "Necesito más confianza en mí misma",
  ],
},

{
  id: "goals",
  title: "¿Qué te gustaría lograr en los próximos 6 meses?",
  subtitle: "Selecciona hasta 3 opciones.",
  type: "multiple",
  maxSelections: 3,
  options: [
    "Descubrir qué estudiar",
    "Entrar a tecnología",
    "Conseguir internship",
    "Mejorar mi CV",
    "Mejorar LinkedIn",
    "Construir networking",
    "Ganar claridad profesional",
    "Sentirme más segura",
    "Aprender de mujeres con experiencia",
    "Prepararme para entrevistas",
    "Desarrollar liderazgo",
    "Crear un plan profesional",
  ],
},

{
  id: "supportNeeded",
  title: "¿Qué tipo de apoyo buscas?",
  subtitle: "Selecciona hasta 2 opciones.",
  type: "multiple",
  maxSelections: 2,
  options: [
    "Alguien que me oriente",
    "Accountability y seguimiento",
    "Consejos estratégicos",
    "Inspiración y motivación",
    "Ayuda técnica/profesional",
    "Claridad para tomar decisiones",
    "Networking y oportunidades",
    "Una guía cercana y humana",
  ],
},

{
  id: "mentorshipStyle",
  title: "¿Cómo prefieres recibir mentorías?",
  subtitle: "Selecciona la opción que más te represente.",
  type: "single",
  options: [
    "Conversaciones relajadas",
    "Planes estructurados",
    "Retroalimentación directa",
    "Retos prácticos",
    "Seguimiento frecuente",
    "Ejemplos reales y experiencias",
  ],
},

{
  id: "confidenceLevel",
  title: "¿Qué tan segura te sientes sobre tu futuro profesional?",
  subtitle: "Califica del 1 al 5.",
  type: "scale",
  min: 1,
  max: 5,
},

{
  id: "frequency",
  title: "¿Qué tan frecuente te gustaría conectar con una mentora?",
  subtitle: "Selecciona una opción.",
  type: "single",
  options: [
    "Ocasionalmente",
    "1 vez al mes",
    "2 veces al mes",
    "Seguimiento continuo (más de 3 veces al mes)",
  ],
},

{
  id: "desiredOutcome",
  title: "¿Qué te gustaría sentir después de una mentoría?",
  subtitle: "Selecciona hasta 2 opciones.",
  type: "multiple",
  maxSelections: 2,
  options: [
    "Más claridad",
    "Más confianza",
    "Menos ansiedad",
    "Más dirección",
    "Más motivación",
    "Un plan concreto",
    "Más preparada para mi futuro",
  ],
},

{
  id: "additionalContext",
  title: "¿Hay algo importante que te gustaría que tu mentora entendiera sobre ti?",
  subtitle: "Opcional. Máximo 250 caracteres.",
  type: "text",
  maxLength: 250,
},

];