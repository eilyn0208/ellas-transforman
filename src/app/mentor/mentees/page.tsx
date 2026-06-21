"use client";

import { useEffect, useState } from "react";
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
import { supabase } from "@/lib/supabase/client";
import AppHeader from "@/components/AppHeader";
import AppLayout from "@/components/AppLayout";
import type { MenteeSummaryCard, MenteeStatus } from "@/types/mentor";

const BRAND = "#824be5";

function ProgressBar({ percent, color = BRAND }: { percent: number; color?: string }) {
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
      ? `${atRisk[0].name} lleva más de 14 días sin actividad. Un check-in podría marcar la diferencia.`
      : needsAttention.length > 0
      ? `${needsAttention[0].name} puede necesitar orientación antes de su próxima sesión.`
      : mentees.length === 0
      ? "Cuando tengas mentees conectadas, aquí verás perspectivas sobre su progreso."
      : "Todas tus mentees están progresando bien esta semana. ¡Excelente trabajo!";

  return (
    <div className="rounded-2xl p-4 border border-brand-soft bg-brand-soft/30">
      <div className="flex items-center gap-2 mb-1.5">
        <IoSparklesOutline className="text-brand text-base flex-shrink-0" />
        <p className="text-xs font-bold uppercase tracking-wide text-brand">
          Perspectiva IA
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
      ? BRAND
      : mentee.status === "needs-attention"
      ? "#f59e0b"
      : "#ef4444";

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-brand-soft flex items-center justify-center text-2xl flex-shrink-0">
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

        {mentee.roadmapTotalStages > 0 && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-gray-500">
                Ruta · Etapa {mentee.roadmapStage} de {mentee.roadmapTotalStages}
              </p>
              <span className="text-xs font-bold" style={{ color: progressColor }}>
                {mentee.roadmapProgressPercent}%
              </span>
            </div>
            <ProgressBar percent={mentee.roadmapProgressPercent} color={progressColor} />
          </div>
        )}

        {mentee.nextSession ? (
          <div className="bg-brand-soft/40 rounded-xl px-3 py-2 mb-3">
            <div className="flex items-center gap-1.5">
              <IoCalendarOutline className="text-sm text-brand flex-shrink-0" />
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

        <div className="flex items-center justify-between text-[10px] text-gray-400 mb-3">
          <span>{mentee.sessionCount} sesiones realizadas</span>
          <span>Último contacto: {mentee.lastContactLabel}</span>
        </div>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center justify-between text-xs font-semibold py-2 border-t border-gray-50 text-brand"
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
          <div className="mt-2 bg-brand-soft/30 rounded-xl p-3">
            <p className="text-xs text-gray-700 leading-relaxed">{mentee.aiPrepSummary}</p>
          </div>
        )}
      </div>

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
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-full text-white text-xs font-semibold bg-brand hover:opacity-90 transition-opacity"
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

function deriveStatus(lastBookingDate: string | null): MenteeStatus {
  if (!lastBookingDate) return "at-risk";
  const days = Math.floor((Date.now() - new Date(lastBookingDate).getTime()) / 86_400_000);
  if (days > 14) return "at-risk";
  if (days > 7) return "needs-attention";
  return "on-track";
}

function formatLastContact(dateStr: string | null): string {
  if (!dateStr) return "Sin actividad";
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000);
  if (days === 0) return "Hoy";
  if (days === 1) return "Ayer";
  return `Hace ${days} días`;
}

function buildAiSummary(sessionCount: number, status: MenteeStatus, name: string): string {
  const first = name.split(" ")[0];
  if (sessionCount === 0) return `Primera sesión pendiente con ${first}.`;
  if (status === "at-risk") return `${first} lleva tiempo sin actividad. Un check-in de motivación puede ser clave.`;
  if (status === "needs-attention") return `Considera revisar el avance de ${first} antes de la próxima sesión.`;
  return `Con ${sessionCount} ${sessionCount === 1 ? "sesión" : "sesiones"} completadas, ${first} va por buen camino.`;
}

export default function MisMenuteesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | MenteeStatus>("all");
  const [mentees, setMentees] = useState<MenteeSummaryCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const nowIso = new Date().toISOString();

      const { data: bookingRows } = await supabase
        .from("bookings")
        .select("id, mentee_id, scheduled_at, duration_min, slot_label")
        .eq("mentor_id", user.id);

      const allBookings = bookingRows ?? [];
      const uniqueIds = [...new Set(allBookings.map((b) => b.mentee_id))];

      if (uniqueIds.length === 0) { setLoading(false); return; }

      const [profilesRes, assessmentRes] = await Promise.all([
        supabase.from("profiles").select("id, full_name").in("id", uniqueIds),
        supabase.from("assessment_results").select("user_id, profile_name, profile_description").in("user_id", uniqueIds),
      ]);

      const profiles = new Map((profilesRes.data ?? []).map((p) => [p.id, p]));
      const assessments = new Map((assessmentRes.data ?? []).map((a) => [a.user_id, a]));

      const cards: MenteeSummaryCard[] = uniqueIds.map((mid) => {
        const mBookings = allBookings.filter((b) => b.mentee_id === mid);
        const pastBookings = mBookings.filter((b) => b.scheduled_at <= nowIso);
        const futureBookings = mBookings
          .filter((b) => b.scheduled_at > nowIso)
          .sort((a, b) => a.scheduled_at.localeCompare(b.scheduled_at));

        const lastPast = [...pastBookings].sort((a, b) => b.scheduled_at.localeCompare(a.scheduled_at))[0] ?? null;
        const nextFuture = futureBookings[0] ?? null;

        const profile = profiles.get(mid);
        const assessment = assessments.get(mid);
        const name = profile?.full_name ?? "Mentee";
        const status = deriveStatus(lastPast?.scheduled_at ?? null);

        let nextSession: MenteeSummaryCard["nextSession"] = null;
        if (nextFuture) {
          const dt = new Date(nextFuture.scheduled_at);
          const dateLabel =
            dt.toLocaleDateString("es-MX", { weekday: "short", month: "short", day: "numeric" }) +
            " · " +
            dt.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: false });
          nextSession = {
            dateLabel,
            topicLabel: nextFuture.slot_label ?? "Sesión de mentoría",
          };
        }

        return {
          id: mid,
          name,
          avatar: "👩‍💻",
          professionalGoal: assessment?.profile_description ?? "Meta profesional por definir",
          industry: assessment?.profile_name ?? "—",
          roadmapStage: 0,
          roadmapTotalStages: 0,
          roadmapProgressPercent: 0,
          nextSession,
          sessionCount: pastBookings.length,
          lastContactLabel: formatLastContact(lastPast?.scheduled_at ?? null),
          status,
          aiPrepSummary: buildAiSummary(pastBookings.length, status, name),
        };
      });

      setMentees(cards);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = mentees.filter((m) => {
    const matchesSearch =
      search === "" ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.professionalGoal.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || m.status === filter;
    return matchesSearch && matchesFilter;
  });

  const rightSlot = (
    <>
      <button className="w-9 h-9 rounded-full bg-brand-soft flex items-center justify-center text-brand hover:bg-brand-soft/80 transition-colors relative">
        <IoNotificationsOutline className="text-lg" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full" />
      </button>
      <button
        onClick={() => router.push("/messages")}
        className="w-9 h-9 rounded-full bg-brand-soft flex items-center justify-center text-brand hover:bg-brand-soft/80 transition-colors"
      >
        <IoChatbubbleOutline className="text-lg" />
      </button>
    </>
  );

  if (loading) {
    return (
      <AppLayout>
        <AppHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-soft border-t-brand" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <AppHeader rightSlot={rightSlot} />

      <main className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Mis Mentees</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {mentees.length} {mentees.length === 1 ? "relación activa" : "relaciones activas"}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 bg-brand">
            {mentees.length}
          </div>
        </div>

        <AIInsightBanner mentees={mentees} />

        <div className="relative">
          <IoSearchOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
          <input
            type="text"
            placeholder="Buscar mentee o meta..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-full border border-gray-200 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-0.5 no-scrollbar">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                filter === opt.value
                  ? "text-white border-transparent bg-brand"
                  : "bg-white text-gray-600 border-gray-200 hover:border-brand/40"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {mentees.length === 0 ? (
          <div className="bg-white rounded-2xl px-5 py-12 text-center shadow-sm">
            <p className="text-3xl mb-3">🌱</p>
            <p className="text-sm font-semibold text-gray-700">Aún no tienes mentees conectadas</p>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Cuando una mentee agende una sesión contigo, aparecerá aquí
            </p>
          </div>
        ) : filtered.length === 0 ? (
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
