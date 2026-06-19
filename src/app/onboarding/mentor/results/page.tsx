"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import AppLayout from "@/components/AppLayout";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface MentorAnswers {
  current_area?: string;
  mentoring_topics?: string[];
  mentoring_style?: string;
  preferred_mentees?: string[];
  mentee_outcomes?: string[];
  mentor_reason?: string;
}

const STYLE_TO_PROFILE: Record<string, { title: string; description: string }> =
  {
    "Cercana y empática": {
      title: "Guía Empática",
      description:
        "Creas espacios de confianza donde otras mujeres se sienten escuchadas y acompañadas en su crecimiento profesional.",
    },
    "Estratégica y directa": {
      title: "Guía Estratégica",
      description:
        "Tienes una forma clara y estratégica de acompañar. Ayudas a tomar mejores decisiones y convertir metas en pasos concretos.",
    },
    "Estructurada y organizada": {
      title: "Mentora Estructurada",
      description:
        "Diseñas rutas de crecimiento claras y medibles, ayudando a cada mentee a avanzar con orden y enfoque.",
    },
    "Motivadora": {
      title: "Mentora Motivadora",
      description:
        "Inspiras y energizas a otras mujeres para superar sus miedos y tomar acción hacia sus metas profesionales.",
    },
    "Técnica y práctica": {
      title: "Guía Técnica",
      description:
        "Compartes conocimiento práctico y real sobre tu área, cerrando la brecha entre el aprendizaje teórico y el mundo laboral.",
    },
    "Reflexiva y orientadora": {
      title: "Mentora Reflexiva",
      description:
        "Guías a través de preguntas poderosas y reflexiones que ayudan a cada mentee a descubrir sus propias respuestas.",
    },
  };

const DEFAULT_PROFILE = {
  title: "Guía Estratégica",
  description:
    "Tienes experiencia y pasión para acompañar a otras mujeres en su desarrollo profesional.",
};

export default function MentorResultsPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<MentorAnswers>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("ellas_mentor_answers");
      if (raw) setAnswers(JSON.parse(raw));
    } catch {
      // fallback to empty answers
    }
    setLoaded(true);
  }, []);

  if (!loaded) {
    return (
      <AppLayout showNav={false}>
        <div className="flex-1 flex items-start justify-center pt-16">
          <div className="w-8 h-8 rounded-full border-4 border-brand-soft border-t-brand animate-spin" />
        </div>
      </AppLayout>
    );
  }

  const profile =
    (answers.mentoring_style && STYLE_TO_PROFILE[answers.mentoring_style]) ||
    DEFAULT_PROFILE;

  const specialties = [
    ...new Set([
      ...(answers.current_area ? [answers.current_area] : []),
      ...(answers.mentoring_topics?.slice(0, 3) ?? []),
    ]),
  ];

  const mentoringAreas = answers.mentoring_topics ?? [
    "Claridad Profesional",
    "Confianza profesional",
    "Desarrollo profesional",
  ];

  const recommendedMentees = answers.preferred_mentees ?? [
    "Personas buscando claridad profesional",
    "Inicio de Carrera",
    "Mujeres entrando a tecnología",
  ];

  return (
    <AppLayout showNav={false}>
      <AppHeader />

      <main className="flex-1 overflow-y-auto px-5 py-6 space-y-5 pb-10">
        {/* Hero */}
        <div className="text-center pt-2 pb-4">
          <span className="inline-block bg-brand-light text-brand text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            Tu perfil de mentora
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {profile.title}
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            {profile.description}
          </p>
        </div>

        {/* Especialidades detectadas */}
        <section className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 bg-brand rounded-full" />
            <h2 className="font-bold text-gray-900 text-base">
              Especialidades detectadas
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {specialties.length > 0 ? (
              specialties.map((s) => <Badge key={s}>{s}</Badge>)
            ) : (
              <p className="text-sm text-gray-400">Sin datos aún</p>
            )}
          </div>
        </section>

        {/* Áreas de mentoría */}
        <section className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 bg-purple-400 rounded-full" />
            <h2 className="font-bold text-gray-900 text-base">
              Áreas de mentoría
            </h2>
          </div>
          <div className="space-y-2">
            {mentoringAreas.map((area, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-brand flex-shrink-0" />
                <span className="text-sm text-gray-700">{area}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Tipo de mentees recomendadas */}
        <section className="bg-brand-soft rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 bg-brand rounded-full" />
            <h2 className="font-bold text-gray-900 text-base">
              Mentees ideales para ti
            </h2>
          </div>
          <div className="space-y-2.5">
            {recommendedMentees.map((mentee, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white/60 rounded-xl px-3 py-2.5"
              >
                <span className="text-brand font-bold text-sm w-5 flex-shrink-0">
                  ✓
                </span>
                <span className="text-sm text-gray-800">{mentee}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="pt-2">
          <Button fullWidth size="lg" onClick={() => router.push("/home")}>
            Ir al inicio
          </Button>
        </div>
      </main>
    </AppLayout>
  );
}
