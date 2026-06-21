"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  IoCheckmark,
  IoLockClosed,
  IoFlag,
  IoBulb,
  IoShareSocial,
  IoPersonCircleOutline,
} from "react-icons/io5";
import type { Milestone, MilestoneStatus, Roadmap } from "@/types/roadmap";
import AppHeader from "@/components/AppHeader";
import AppLayout from "@/components/AppLayout";
import { supabase } from "@/lib/supabase/client";

function ProgressCircle({ percent }: { percent: number }) {
  const r = 28;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="80" height="80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="#dbc9f8" strokeWidth="6" />
        <circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke="#824be5"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <span className="text-sm font-bold text-brand z-10">{percent}%</span>
    </div>
  );
}

function StatusIcon({ status }: { status: MilestoneStatus }) {
  if (status === "completed") {
    return (
      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
        <IoCheckmark className="text-green-600 text-lg" />
      </div>
    );
  }
  if (status === "in-progress") {
    return (
      <div className="w-10 h-10 rounded-full border-2 border-dashed border-brand flex items-center justify-center flex-shrink-0">
        <div className="w-3 h-3 rounded-full bg-brand" />
      </div>
    );
  }
  if (status === "locked") {
    return (
      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
        <IoLockClosed className="text-gray-400 text-lg" />
      </div>
    );
  }
  if (status === "upcoming") {
    return (
      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
        <IoFlag className="text-blue-500 text-lg" />
      </div>
    );
  }
  return (
    <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
      <IoBulb className="text-amber-500 text-lg" />
    </div>
  );
}

const STATUS_LABELS: Record<MilestoneStatus, { label: string; className: string }> = {
  completed: { label: "Completado", className: "bg-green-100 text-green-700" },
  "in-progress": { label: "En progreso", className: "bg-brand-light text-brand" },
  locked: { label: "Bloqueado", className: "bg-gray-100 text-gray-500" },
  upcoming: { label: "Próximo", className: "bg-blue-50 text-blue-600" },
  suggested: { label: "Sugerido", className: "bg-amber-50 text-amber-600" },
};

function StatusBadge({ status }: { status: MilestoneStatus }) {
  const { label, className } = STATUS_LABELS[status];
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${className}`}>
      {label}
    </span>
  );
}

function MilestoneCTA({ status }: { status: MilestoneStatus }) {
  const ctas: Partial<Record<MilestoneStatus, { label: string; variant: string }>> = {
    completed: { label: "Ver", variant: "border border-brand text-brand" },
    "in-progress": { label: "Unirme", variant: "bg-brand text-white" },
    locked: { label: "Cómo desbloquear", variant: "text-brand text-xs underline p-0" },
    upcoming: { label: "Prepararme", variant: "bg-brand text-white" },
    suggested: { label: "Agregar al plan", variant: "border border-gray-300 text-gray-600" },
  };

  const cta = ctas[status];
  if (!cta) return null;

  return (
    <button
      className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-opacity hover:opacity-80 ${cta.variant}`}
    >
      {cta.label}
    </button>
  );
}

function MilestoneCard({ milestone }: { milestone: Milestone }) {
  const isLocked = milestone.status === "locked";

  return (
    <div className={`bg-white rounded-2xl p-4 shadow-sm flex gap-3 ${isLocked ? "opacity-60" : ""}`}>
      <StatusIcon status={milestone.status} />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-sm text-gray-900 leading-snug">
            {milestone.title}
          </h3>
          <StatusBadge status={milestone.status} />
        </div>

        <p className="text-xs text-gray-500 leading-relaxed mb-2">
          {milestone.description}
        </p>

        {milestone.mentorName && (
          <div className="flex items-center gap-1.5 mb-2">
            <IoPersonCircleOutline className="text-gray-400 text-base flex-shrink-0" />
            <span className="text-xs text-gray-500">
              Mentora: {milestone.mentorName}
            </span>
          </div>
        )}

        {milestone.sessionInfo && (
          <p className="text-xs text-brand font-medium mb-2">
            {milestone.sessionInfo}
          </p>
        )}

        {milestone.requiresInfo && (
          <p className="text-xs text-gray-400 italic mb-2">
            {milestone.requiresInfo}
          </p>
        )}

        {milestone.targetInfo && (
          <p className="text-xs text-blue-600 font-medium mb-2">
            {milestone.targetInfo}
          </p>
        )}

        {milestone.estimatedTime && (
          <p className="text-xs text-amber-600 mb-2">{milestone.estimatedTime}</p>
        )}

        <div className="flex justify-end">
          <MilestoneCTA status={milestone.status} />
        </div>
      </div>
    </div>
  );
}

export default function RoadmapPage() {
  const router = useRouter();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function checkRole() {
      const { data: { user } } = await supabase.auth.getUser();
      const role = user?.user_metadata?.role ?? localStorage.getItem("ellas_role");
      if (role === "mentor" || role === "mentora") {
        router.replace("/mentor/impact");
      }
    }
    checkRole();
  }, [router]);

  const fetchRoadmap = async () => {
    setLoading(true);
    setError(false);

    try {
      // 1. Obtener usuario autenticado
      const { data: { user } } = await supabase.auth.getUser();

      // 2. Leer answers desde Supabase o localStorage como fallback
      let answers: Record<string, unknown> = {};
      if (user) {
        const { data } = await supabase
          .from("assessments")
          .select("answers")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (data?.answers) answers = data.answers as Record<string, unknown>;
      }
      if (!answers.goals) {
        const local = localStorage.getItem("ellas_mentee_answers");
        if (local) {
          try { answers = JSON.parse(local); } catch { /* ignore */ }
        }
      }

      // 3. Contar bookings de la mentee
      let bookingCount = 0;
      if (user) {
        const { count } = await supabase
          .from("bookings")
          .select("*", { count: "exact", head: true })
          .eq("mentee_id", user.id);
        bookingCount = count ?? 0;
      }

      // 4. Llamar a la API con datos reales del onboarding
      const res = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goals: (answers.goals as string[]) ?? [],
          interests: (answers.interests as string[]) ?? [],
          stage: (answers.stage as string) ?? "",
          bookingCount,
        }),
      });

      if (!res.ok) throw new Error("Error cargando roadmap");

      const data: Roadmap = await res.json();
      setRoadmap(data);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, []);

  return (
    <AppLayout>
      <AppHeader title="Mi Ruta" />

      <main className="flex-1 px-5 py-5 space-y-5 overflow-y-auto">
        {loading && (
          <div className="py-20 flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-soft border-t-brand" />
            <p className="text-sm text-gray-500">
              Cargando tu ruta de crecimiento...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="py-20 flex flex-col items-center gap-4 text-center">
            <p className="text-gray-500 text-sm">
              No pudimos cargar tu roadmap.
            </p>
            <button
              onClick={fetchRoadmap}
              className="px-5 py-2.5 bg-brand text-white text-sm font-semibold rounded-full hover:opacity-90"
            >
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && roadmap && (
          <>
            <h1 className="text-2xl font-bold text-gray-900">
              Tu Ruta de Crecimiento
            </h1>

            {/* Tarjeta de progreso */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <ProgressCircle percent={roadmap.progressPercent} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 leading-snug mb-1">
                    {roadmap.progressSummary}
                  </p>
                  <p className="text-xs text-gray-400">{roadmap.updatedLabel}</p>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => window.open("https://www.linkedin.com/", "_blank")}
                  className="flex-1 py-2 border border-brand text-brand text-xs font-semibold rounded-full hover:bg-brand-light transition-colors flex items-center justify-center gap-1"
                >
                  <IoShareSocial className="text-sm" />
                  Compartir
                </button>
              </div>
            </div>

            {/* Milestones */}
            <section>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Hitos
              </h2>
              <div className="space-y-3">
                {roadmap.milestones.map((milestone) => (
                  <MilestoneCard key={milestone.id} milestone={milestone} />
                ))}
              </div>
            </section>

            {/* Acciones recomendadas */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Próximas acciones
                </h2>
                <span className="text-xs text-brand font-semibold">
                  Enfocarte
                </span>
              </div>

              <div className="space-y-2">
                {roadmap.recommendedActions.map((action, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl px-4 py-3 shadow-sm flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-soft flex items-center justify-center flex-shrink-0 text-brand font-bold text-xs">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 leading-snug">
                        {action.title}
                      </p>
                      <p className="text-xs text-gray-400">{action.duration}</p>
                    </div>
                    <button className="px-3 py-1.5 bg-brand text-white text-xs font-semibold rounded-full hover:opacity-90 transition-opacity flex-shrink-0">
                      {action.ctaLabel}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </AppLayout>
  );
}
