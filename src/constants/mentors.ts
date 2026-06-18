export interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  bio: string;
  avatar: string;
  tags: string[];
}

export const mentors: Mentor[] = [
  {
    id: "1",
    name: "Ana Martínez",
    role: "Software Engineer",
    company: "Microsoft",
    bio: "Le apasiona ayudar a mujeres a iniciar una carrera en tecnología.",
    avatar: "👩‍💻",
    tags: ["Programación", "Carrera tech", "Mentoría"],
  },
  {
    id: "2",
    name: "María Gómez",
    role: "Product Manager",
    company: "Google",
    bio: "Ayuda a estudiantes a encontrar oportunidades profesionales.",
    avatar: "👩‍💼",
    tags: ["Liderazgo", "Producto", "Networking"],
  },
  {
    id: "3",
    name: "Valeria Torres",
    role: "UX Designer",
    company: "Nubank",
    bio: "Especialista en diseño de productos digitales y mentoría.",
    avatar: "👩‍🎨",
    tags: ["Diseño UX/UI", "Portafolio", "Creatividad"],
  },
  {
    id: "4",
    name: "Camila Rojas",
    role: "Data Scientist",
    company: "Amazon",
    bio: "Apoya a jóvenes interesadas en datos, IA y análisis.",
    avatar: "👩‍🔬",
    tags: ["Datos", "Inteligencia Artificial", "Estudios"],
  },
  {
    id: "5",
    name: "Sofía Herrera",
    role: "Ingeniera Aeroespacial",
    company: "SpaceX",
    bio: "Comparte su experiencia para inspirar vocaciones STEM.",
    avatar: "👩‍🚀",
    tags: ["STEM", "Inspiración", "Ciencia"],
  },
  {
    id: "6",
    name: "Daniela Pérez",
    role: "Profesora universitaria",
    company: "UNAM",
    bio: "Guía a estudiantes en su transición de la universidad al trabajo.",
    avatar: "👩‍🏫",
    tags: ["Educación", "Primer empleo", "Orientación"],
  },
];
