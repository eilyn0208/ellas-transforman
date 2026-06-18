import type { MenteeProfileView, MentorProfileView } from "@/types/profile";

// TODO: Replace with Supabase query:
// SELECT p.*, u.role FROM profiles p JOIN users u ON u.id = p.user_id WHERE p.user_id = auth.uid()
// connected_mentors: SELECT * FROM connections WHERE mentee_id = auth.uid() AND status = 'active'
// current_mentees:  SELECT * FROM connections WHERE mentor_id = auth.uid() AND status = 'active'
// active_programs:  SELECT * FROM enrollments WHERE user_id = auth.uid() AND status = 'active'
// logros:           SELECT * FROM achievements WHERE user_id = auth.uid()

export const mockMenteeProfile: MenteeProfileView = {
  id: "u1",
  role: "mentee",
  name: "Maria Estévez",
  bio: "Passionate about building user-first product experiences. Currently transitioning from QA to PM and focusing on stakeholder communication, A/B testing, and roadmapping.",
  avatar: "👩‍💻",
  tags: ["Product Management", "User Research"],
  education: [
    {
      id: "e1",
      institution: "Universidad Tecnológica de Andes",
      degree: "B.Sc. Computer Science",
      year: "2016",
      emoji: "🎓",
    },
  ],
  connectedMentors: [
    {
      id: "1",
      name: "Ana Ruiz",
      role: "Product Leadership",
      avatar: "👩‍💼",
      isVerified: true,
      specialty: "Product Leadership",
    },
    {
      id: "2",
      name: "Priya Kapoor",
      role: "Data Strategy",
      avatar: "👩‍🔬",
      isVerified: false,
      specialty: "Data Strategy",
    },
  ],
  activeGoal: {
    title: "Build first product roadmap",
    progressPercent: 40,
    inProgressCount: 3,
    milestoneLabel: "Milestone: Draft and share with mentor",
  },
  logros: [
    {
      id: "l1",
      title: "Mentoría Verificada",
      emoji: "🏆",
    },
  ],
  activePrograms: [
    {
      id: "p1",
      title: "Product Leadership Sprint",
      coachInfo: "Role Member · Coach: Ana Rivero",
      currentLesson: 2,
      totalLessons: 8,
      emoji: "📊",
    },
  ],
  communityStats: {
    totalLabel: "8k",
    onlineLabel: "2k",
  },
  updatedLabel: "Actualizado hace 3 días",
};

export const mockMentorProfile: MentorProfileView = {
  id: "u2",
  role: "mentor",
  name: "Maria Estévez",
  bio: "Passionate about building user-first product experiences. Currently transitioning from QA to PM and focusing on stakeholder communication, A/B testing, and roadmapping.",
  avatar: "👩‍🏫",
  tags: ["Product Management", "User Research"],
  education: [
    {
      id: "e1",
      institution: "Universidad Tecnológica de Andes",
      degree: "B.Sc. Computer Science",
      year: "2016",
      emoji: "🎓",
    },
  ],
  specialties: [
    "Product Roadmapping",
    "Stakeholder Communication",
    "A/B Testing",
    "OKRs",
  ],
  currentMentees: [
    {
      id: "m1",
      name: "Sofia Cruz",
      avatar: "👩‍🎓",
      goal: "Entrar a PM",
      isVerified: true,
    },
    {
      id: "m2",
      name: "Laura Pérez",
      avatar: "👩‍💻",
      goal: "Data Science",
      isVerified: false,
    },
  ],
  activeGoal: {
    title: "Completar programa de mentoría Q3",
    progressPercent: 65,
    inProgressCount: 4,
    milestoneLabel: "Milestone: Revisión de avances con mentees",
  },
  logros: [
    {
      id: "l1",
      title: "Mentoría Verificada",
      emoji: "🏆",
    },
  ],
  activePrograms: [
    {
      id: "p1",
      title: "Product Leadership Sprint",
      coachInfo: "Coach principal · 4 mentees activas",
      currentLesson: 5,
      totalLessons: 8,
      emoji: "📊",
    },
  ],
  communityStats: {
    totalLabel: "8k",
    onlineLabel: "2k",
  },
  updatedLabel: "Actualizado hace 3 días",
};
