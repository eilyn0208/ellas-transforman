import type { Workshop, Story, RecommendedMentor } from "@/types/explore";

// TODO: Replace with Supabase queries

export const EXPLORE_FILTER_TAGS = ["Diseño", "Producto", "Liderazgo", "Español"];

export const recommendedMentors: RecommendedMentor[] = [
  {
    id: "2",
    name: "Mariana Herrera",
    role: "Senior Product Manager",
    location: "Remote (México)",
    bio: "Especialidades: Roadmaps de producto, OKRs, entrevistas con stakeholders. 12 años liderando equipos híbridos.",
    avatar: "👩‍💼",
    rating: 4.9,
    tags: ["Product", "Leadership"],
  },
  {
    id: "4",
    name: "Camila Rojas",
    role: "Data Scientist",
    location: "Remoto (Colombia)",
    bio: "Apoya a jóvenes interesadas en datos, IA y análisis. Ex-Amazon con más de 8 años en el sector.",
    avatar: "👩‍🔬",
    rating: 4.8,
    tags: ["Datos", "IA"],
  },
];

export const workshops: Workshop[] = [
  {
    id: "w1",
    title: "Fundamentos de Roadmapping",
    presenter: "Ana Martínez",
    date: "Jul 12",
    time: "17:00",
    seats: 18,
    emoji: "📊",
  },
  {
    id: "w2",
    title: "Negociación salarial en tech",
    presenter: "Laura Gómez",
    date: "Jul 18",
    time: "19:00",
    seats: 25,
    emoji: "💼",
  },
];

export const stories: Story[] = [
  {
    id: "s1",
    title: "De junior a senior en 2 años",
    authorName: "Sofía Ramírez",
    emoji: "🌟",
  },
  {
    id: "s2",
    title: "Cómo conseguí mi primer trabajo en tech",
    authorName: "María López",
    emoji: "🚀",
  },
  {
    id: "s3",
    title: "Liderando equipos remotos como PM",
    authorName: "Camila Torres",
    emoji: "👩‍💻",
  },
];
