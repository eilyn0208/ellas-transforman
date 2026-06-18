"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  IoSearchOutline,
  IoSparklesOutline,
  IoCalendarOutline,
  IoChevronForward,
  IoAlertCircleOutline,
  IoCheckmarkCircle,
  IoWarningOutline,
  IoChatbubbleOutline,
  IoNotificationsOutline,
} from "react-icons/io5";
import AppHeader from "@/components/AppHeader";
import AppLayout from "@/components/AppLayout";
import { mockMentees } from "@/constants/mentor-mentees";
import type { MenteeSummaryCard, MenteeStatus } from "@/types/mentor";

const MENTOR_GREEN = "#2d6a4f";
const MENTOR_MID = "#40916c";

function ProgressBar({ percent, color = MENTOR_MID }: { percent: number; color?: string }) {
  return (
    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${percent}%`, background: color }}
      />
    </div>
  );
}

const STATUS_CONFIG: Record<MenteeStatus, { label: string; icon: React.ReactNode; dot: string; textColor: string }> = {
  "on-track": {
    label: "En camino",
    icon: <IoCheckmarkCircle className="text-emerald-500 text-sm" />,
    dot: "bg-emerald-400",
    textColor: "text-emerald-600",
  },
  "needs-attention": {
    label: "Necesita atención",
    icon: <IoWarningOutline className="text-amber-500 text-sm" />,
    dot: "bg-amber-400",
    textColor: "text-amber-600",
  },
  "at-risk": {
    label: "En riesgo",
    icon: <IoAlertCircleOutline className="text-red-500 text-sm" />,
    dot: "bg-red-400",
    textColor: "text-red-600",
  },
};

function AIInsightBanner({ mentees }: { mentees: MenteeSummaryCard[] }) {
  const atRisk = mentees.filter((m) => m.status === "at-risk");
  const needsAttention = mentees.filter((m) => m.status === "needs-attention");

  const message =
    atRisk.length > 0
      ? `${atRisk[0].name} lleva más de 10 días sin actividad. Un check-in podría marcar la diferencia.`
      : needsAttention.length > 0
      ? `${needsAttention[0].name} puede necesitar orientación antes de su próxima sesión.`
      : "Todas tus mentees están progresando bien esta semana. ¡Excelente trabajo!";

  return (
    <div className="rounded-2xl p-4 border border-emerald-200 bg-emerald-50">
      <div className="flex items-center gap-2 mb-1.5">
        <IoSparklesOutline style={{ color: MENTOR_MID }} className="text-base flex-shrink-0" />
        <p className="text-xs font-bold uppercase tracking-wide" style={{ color: MENTOR_MID }}>
          Insight IA
        </p>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed">{message}</p>
    </div>
  );
}

function MenteeCard({ mentee }: { mentee: MenteeSummaryCard }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const status = STATUS_CONFIG[mentee.status];
  const progressColor =
    mentee.status === "on-track"
      ? MENTOR_MID
      : mentee.status === "needs-attention"
      ? "#f59e0b"
      : "#ef4444";

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-2xl flex-shrink-0">
            {mentee.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="font-bold text-sm text-gray-900 leading-tight">{mentee.name}</p>
              <div className={`flex items-center gap-1 ${status.textColor}`}>
                {status.icon}
                <span className="text-[10px] font-semibold">{status.label}</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-0.5 leading-snug line-clamp-1">
              {mentee.professionalGoal}
            </p>
            <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full mt-1 inline-block">
              {mentee.industry}
            </span>
          </div>
        </div>

        {/* Roadmap progress */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-gray-500">
              Roadmap · Etapa {mentee.roadmapStage} de {mentee.roadmapTotalStages}
            </p>
            <span className="text-xs font-bold" style={{ color: progressColor }}>
              {mentee.roadmapProgressPercent}%
            </span>
          </div>
          <ProgressBar percent={mentee.roadmapProgressPercent} color={progressColor} />
        </div>

        {/* Next session */}
        {mentee.nextSession ? (
          <div className="bg-emerald-50 rounded-xl px-3 py-2 mb-3">
            <div className="flex items-center gap-1.5">
              <IoCalendarOutline className="text-sm flex-shrink-0" style={{ color: MENTOR_MID }} />
              <div>
                <p className="text-xs font-semibold text-gray-700">{mentee.nextSession.dateLabel}</p>
                <p className="text-[10px] text-gray-500">{mentee.nextSession.topicLabel}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-red-50 rounded-xl px-3 py-2 mb-3">
            <p className="text-xs text-red-600 font-medium">Sin próxima sesión agendada</p>
          </div>
        )}

        {/* Stats row */}
        <div className="flex items-center justify-between text-[10px] text-gray-400 mb-3">
          <span>{mentee.sessionCount} sesiones realizadas</span>
          <span>Último contacto: {mentee.lastContactLabel}</span>
        </div>

        {/* AI prep summary (expandable) */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center justify-between text-xs font-semibold py-2 border-t border-gray-50"
          style={{ color: MENTOR_MID }}
        >
          <div className="flex items-center gap-1.5">
            <IoSparklesOutline className="text-sm" />
            <span>Resumen IA para próxima sesión</span>
          </div>
          <IoChevronForward
            className={`text-sm transition-transform duration-200 ${expanded ? "rotate-90" : ""}`}
          />
        </button>

        {expanded && (
          <div className="mt-2 bg-emerald-50 rounded-xl p-3">
            <p className="text-xs text-gray-700 leading-relaxed">{mentee.aiPrepSummary}</p>
          </div>
        )}
      </div>

      {/* Action bar */}
      <div className="border-t border-gray-50 px-4 py-2.5 flex gap-2">
        <button
          onClick={() => router.push(`/messages`)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-full border border-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-50 transition-colors"
        >
          <IoChatbubbleOutline className="text-sm" />
          Mensaje
        </button>
        <button
          onClick={() => router.push(`/sessions`)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-full text-white text-xs font-semibold hover:opacity-90 transition-opacity"
          style={{ background: MENTOR_MID }}
        >
          <IoCalendarOutline className="text-sm" />
          Preparar sesión
        </button>
      </div>
    </div>
  );
}

const FILTER_OPTIONS: { label: string; value: "all" | MenteeStatus }[] = [
  { label: "Todas", value: "all" },
  { label: "En camino", value: "on-track" },
  { label: "Atención", value: "needs-attention" },
  { label: "En riesgo", value: "at-risk" },
];

export default function MisMenuteesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | MenteeStatus>("all");

  const filtered = mockMentees.filter((m) => {
    const matchesSearch =
      search === "" ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.professionalGoal.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || m.status === filter;
    return matchesSearch && matchesFilter;
  });

  const rightSlot = (
    <>
      <button className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 hover:bg-emerald-100 transition-colors relative">
        <IoNotificationsOutline className="text-lg" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full" />
      </button>
      <button
        onClick={() => router.push("/messages")}
        className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 hover:bg-emerald-100 transition-colors"
      >
        <IoChatbubbleOutline className="text-lg" />
      </button>
    </>
  );

  return (
    <AppLayout>
      <AppHeader rightSlot={rightSlot} />

      <main className="flex-1 overflow-y-auto px-5 py-5 space-y-4 pb-28">
        {/* Page title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Mis Mentees</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {mockMentees.length} relaciones activas
            </p>
          </div>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
            style={{ background: MENTOR_MID }}
          >
            {mockMentees.length}
          </div>
        </div>

        {/* AI insight banner */}
        <AIInsightBanner mentees={mockMentees} />

        {/* Search */}
        <div className="relative">
          <IoSearchOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
          <input
            type="text"
            placeholder="Buscar mentee o meta..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-full border border-gray-200 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-0.5 no-scrollbar">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                filter === opt.value
                  ? "text-white border-transparent"
                  : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300"
              }`}
              style={
                filter === opt.value
                  ? { background: MENTOR_MID, borderColor: MENTOR_MID }
                  : {}
              }
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Mentee list */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl px-5 py-10 text-center shadow-sm">
            <p className="text-gray-400 text-sm">No hay mentees que coincidan</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((mentee) => (
              <MenteeCard key={mentee.id} mentee={mentee} />
            ))}
          </div>
        )}
      </main>
    </AppLayout>
  );
}
