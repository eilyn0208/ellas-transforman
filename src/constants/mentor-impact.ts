import type { MentorImpactFullData } from "@/types/mentor";

// TODO: Replace with Supabase + Gemini queries:
// - totalSessions:       SELECT COUNT(*) FROM sessions WHERE mentor_id = auth.uid()
// - totalHours:          SELECT SUM(duration_minutes)/60 FROM sessions WHERE mentor_id = auth.uid()
// - badges:              SELECT * FROM mentor_badges WHERE mentor_id = auth.uid()
// - menteeAchievements:  SELECT * FROM achievements WHERE mentor_id = auth.uid() ORDER BY created_at DESC
// - aiRecommendation:    POST /api/mentor-ai-insight { mentorId } → Gemini

export const mockMentorImpact: MentorImpactFullData = {
  totalSessions: 47,
  totalHours: 62,
  menteesActive: 4,
  menteesGraduated: 3,
  avgRating: 4.9,
  level: {
    current: "Mentora Senior",
    currentEmoji: "🌟",
    points: 1340,
    nextLevel: "Mentora Experta",
    pointsToNext: 160,
    progressPercent: 89,
  },
  growthTrend: [18, 24, 30, 38, 43, 47],
  growthTrendLabel: "Sesiones acumuladas — últimas 6 semanas",
  badges: [
    {
      id: "b1",
      emoji: "🏆",
      title: "Top Mentor",
      description: "Rating 4.9+ por 3 meses consecutivos",
      earnedAt: "May 2026",
    },
    {
      id: "b2",
      emoji: "🚀",
      title: "Aceleradora",
      description: "Mentee consiguió empleo en 60 días",
      earnedAt: "Apr 2026",
    },
    {
      id: "b3",
      emoji: "💬",
      title: "Comunicadora",
      description: "100% de sesiones completadas sin cancelaciones",
      earnedAt: "Mar 2026",
    },
    {
      id: "b4",
      emoji: "🌱",
      title: "Sembradora",
      description: "Primera mentee graduada del programa",
      earnedAt: "Feb 2026",
    },
    {
      id: "b5",
      emoji: "⭐",
      title: "5 Estrellas",
      description: "10 reseñas con calificación perfecta",
      earnedAt: "Ene 2026",
    },
    {
      id: "b6",
      emoji: "🎯",
      title: "Enfocada",
      description: "3 mentees alcanzaron su meta principal",
      earnedAt: "Dic 2025",
    },
  ],
  certifications: [
    {
      id: "c1",
      title: "Certified Mentor — Nivel Avanzado",
      issuer: "EllasTransforman",
      issuedAt: "Jun 2026",
      badge: "🎓",
    },
    {
      id: "c2",
      title: "Facilitadora de Liderazgo Femenino",
      issuer: "EllasTransforman",
      issuedAt: "Mar 2026",
      badge: "👑",
    },
    {
      id: "c3",
      title: "Coaching para Transiciones de Carrera",
      issuer: "EllasTransforman",
      issuedAt: "Nov 2025",
      badge: "🧭",
    },
  ],
  menteeAchievements: [
    {
      id: "a1",
      menteeId: "m4",
      menteeName: "Andrea Castillo",
      menteeAvatar: "👩‍💼",
      achievement: "Promovida a Directora de Operaciones en FinCorp",
      dateLabel: "Jun 2026",
    },
    {
      id: "a2",
      menteeId: "m1",
      menteeName: "Valeria Torres",
      menteeAvatar: "👩‍💻",
      achievement: "Aprobó entrevista técnica en empresa top 10 LATAM",
      dateLabel: "May 2026",
    },
    {
      id: "a3",
      menteeId: "m5",
      menteeName: "Isabela Mora",
      menteeAvatar: "👩‍🏫",
      achievement: "Lanzó su primer producto como PM independiente",
      dateLabel: "Apr 2026",
    },
    {
      id: "a4",
      menteeId: "m2",
      menteeName: "Camila Ríos",
      menteeAvatar: "👩‍🎨",
      achievement: "Portfolio seleccionado para exhibición de diseño LATAM",
      dateLabel: "Mar 2026",
    },
  ],
  aiRecommendation:
    "Lucía lleva 12 días sin actividad y expresó dudas sobre su transición. Un check-in motivacional esta semana puede marcar la diferencia. Además, Andrea está lista para dar el salto final — considera compartirle tu red de contactos en fintech.",
};
