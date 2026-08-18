"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import {
  IoChatbubbleOutline,
  IoCalendarOutline,
  IoTimeOutline,
  IoLocationOutline,
  IoChevronForward,
  IoCheckmarkCircle,
  IoEllipseOutline,
  IoPeopleOutline,
  IoSparklesOutline,
  IoTrophyOutline,
  IoHeartOutline,
} from "react-icons/io5";
import AppHeader from "@/components/AppHeader";
import AppLayout from "@/components/AppLayout";
import NotificationBell from "@/components/NotificationBell";
import type {
  MenteeDashboardData,
  MentorDashboardData,
  ActiveGoalCard,
  MenteeProgressCard,
} from "@/types/home";

// ─── Shared sub-components ─────────────────────────────────────────────────

function Sparkline({ data, color = "#824be5" }: { data: number[]; color?: string }) {
  const W = 300;
  const H = 56;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * W,
    y: H - ((v - min) / range) * (H * 0.85),
  }));

  const line = pts.reduce(
    (d, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${d} L ${p.x} ${p.y}`),
    ""
  );
  const area = `${line} L ${W} ${H} L 0 ${H} Z`;
  const gradId = `sg-${color.replace("#", "")}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-14" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} />
      <path d={line} stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3.5" fill={color} />
      ))}
    </svg>
  );
}

function ProgressBar({
  percent,
  color = "bg-brand",
}: {
  percent: number;
  color?: string;
}) {
  return (
    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full ${color} transition-all duration-500`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

// ─── Mentee Dashboard ──────────────────────────────────────────────────────

function MenteeWelcomeBanner({ data }: { data: MenteeDashboardData }) {
  return (
    <div className="bg-brand rounded-2xl p-5 relative overflow-hidden">
      <div className="absolute right-0 top-0 text-7xl opacity-20 leading-none select-none pr-3 pt-1">
        🌟
      </div>
      <div className="relative">
        <p className="text-white/90 text-sm font-medium mb-0.5">
          Bienvenida de vuelta
        </p>
        <h1 className="text-white text-xl font-bold mb-1">
          {data.userName} 👋
        </h1>
        {data.sessionMilestoneCount > 0 && (
          <p className="text-yellow-300 text-xs font-bold tracking-wide uppercase mb-3">
            ¡Felicidades por tus {data.sessionMilestoneCount} sesiones!
          </p>
        )}
        <p className="text-white/75 text-xs leading-relaxed italic">
          "{data.motivationalQuote}"
        </p>
        <p className="text-white/50 text-[10px] mt-0.5">— EllasTransforman</p>
      </div>
    </div>
  );
}

function MenteeUpcomingSession({ data }: { data: MenteeDashboardData }) {
  const router = useRouter();
  const session = data.upcomingSession;

  if (!session) {
    return (
      <section>
        <SectionHeader title="Próxima sesión" />
        <div className="bg-white rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-brand-soft flex items-center justify-center text-2xl flex-shrink-0">
            📅
          </div>
          <div className="flex-1">
            <p className="text-gray-400 text-sm">Aún no tienes sesiones agendadas</p>
            <button
              onClick={() => router.push("/discover")}
              className="text-brand text-xs font-semibold mt-1 hover:underline"
            >
              Agendar ahora →
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <SectionHeader title="Próxima sesión" />
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-brand-soft flex items-center justify-center text-2xl flex-shrink-0">
            {session.mentorAvatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-gray-900 leading-snug">
              {session.title}
            </p>
            <p className="text-brand text-xs mt-0.5">
              Con {session.mentorName} · {session.mentorRole}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <IoCalendarOutline className="text-sm text-brand" />
            {session.dateLabel}
          </span>
          <span className="flex items-center gap-1">
            <IoTimeOutline className="text-sm text-brand" />
            {session.startTime} – {session.endTime}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <IoLocationOutline className="text-sm" />
            {session.locationType}
          </span>
          <button
            onClick={() => router.push("/sessions")}
            className="px-4 py-1.5 bg-brand text-white text-xs font-semibold rounded-full hover:opacity-90 transition-opacity"
          >
            Ver sesión
          </button>
        </div>
      </div>
    </section>
  );
}

function MenteeActiveGoals({ data }: { data: MenteeDashboardData }) {
  const router = useRouter();

  return (
    <section>
      <SectionHeader
        title="Tus metas"
        action={{ label: "Ver todas", route: "/roadmap" }}
      />
      {data.activeGoals.length === 0 ? (
        <div className="bg-white rounded-2xl px-5 py-6 shadow-sm text-center">
          <p className="text-gray-400 text-sm">Tus metas activas aparecerán aquí</p>
          <button
            onClick={() => router.push("/roadmap")}
            className="text-brand text-xs font-semibold mt-2 hover:underline"
          >
            Crear mi roadmap →
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-50">
          {data.activeGoals.map((goal: ActiveGoalCard) => (
            <div key={goal.id} className="px-4 py-3 flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-full ${goal.iconBg} flex items-center justify-center text-base flex-shrink-0`}
              >
                {goal.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-gray-900 leading-tight">
                    {goal.title}
                  </p>
                  <span className="text-xs font-bold text-brand ml-2 flex-shrink-0">
                    {goal.progressPercent}%
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-1.5">{goal.description}</p>
                <ProgressBar percent={goal.progressPercent} />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function MenteeGrowthProgress({ data }: { data: MenteeDashboardData }) {
  const { growthStats } = data;

  if (growthStats.sessionsThisMonth === 0) {
    return (
      <section>
        <SectionHeader title="Progreso de crecimiento" />
        <div className="bg-white rounded-2xl px-5 py-6 shadow-sm text-center">
          <p className="text-gray-400 text-sm">Aún no tienes sesiones registradas</p>
          <p className="text-gray-300 text-xs mt-1">Tu progreso aparecerá aquí</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <SectionHeader title="Progreso de crecimiento" />
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs text-gray-400">{growthStats.chartLabel}</p>
          <span className="text-[10px] font-semibold text-brand uppercase tracking-wide">
            Puntaje
          </span>
        </div>
        <div className="mt-1 mb-4">
          <Sparkline data={growthStats.chartDataByWeek} />
        </div>
        <div className="flex justify-between border-t border-gray-50 pt-3">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Sesiones</p>
            <p className="text-sm font-bold text-brand">
              {growthStats.sessionsThisMonth} este mes
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 mb-0.5">Habilidades ganadas</p>
            <p className="text-sm font-bold text-green-600">
              {growthStats.skillsGained.join(" · ")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function MenteeRoadmapSummary({ data }: { data: MenteeDashboardData }) {
  const router = useRouter();
  const { roadmapSummary } = data;

  if (!roadmapSummary.pathTitle) {
    return (
      <section>
        <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Ruta de Carrera
          </p>
          <p className="text-xs text-gray-400 mb-3">Aún no tienes un roadmap activo</p>
          <button
            onClick={() => router.push("/roadmap")}
            className="px-5 py-2 bg-brand text-white text-xs font-semibold rounded-full hover:opacity-90 transition-opacity"
          >
            Explorar rutas →
          </button>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">
              Ruta de Carrera
            </p>
            <p className="text-sm font-bold text-gray-900">
              {roadmapSummary.pathTitle}
            </p>
          </div>
          <span className="text-xs font-semibold text-brand bg-brand-soft px-2.5 py-1 rounded-full flex-shrink-0">
            Etapa {roadmapSummary.currentStage} de {roadmapSummary.totalStages}
          </span>
        </div>

        <div className="space-y-2 mb-3">
          {roadmapSummary.completedItems.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <IoCheckmarkCircle className="text-green-500 text-base flex-shrink-0" />
              <p className="text-xs text-gray-600">{item}</p>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <IoEllipseOutline className="text-gray-300 text-base flex-shrink-0" />
            <p className="text-xs text-gray-400">{roadmapSummary.inProgressItem}</p>
          </div>
        </div>

        <button
          onClick={() => router.push("/roadmap")}
          className="w-full py-2 border border-brand text-brand text-xs font-semibold rounded-full hover:bg-brand-light transition-colors"
        >
          Ver roadmap completo
        </button>
      </div>
    </section>
  );
}

function MenteeAIAction({ data }: { data: MenteeDashboardData }) {
  const router = useRouter();
  const { aiAction } = data;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-brand-soft">
      <div className="flex items-center gap-2 mb-2">
        <IoSparklesOutline className="text-brand text-base" />
        <p className="text-xs font-bold text-brand uppercase tracking-wide">
          Acción recomendada
        </p>
      </div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-gray-700 leading-snug flex-1">
          {aiAction.suggestion}
        </p>
        <button
          onClick={() => router.push(aiAction.ctaRoute)}
          className="px-5 py-2 bg-brand text-white text-sm font-bold rounded-full hover:opacity-90 transition-opacity flex-shrink-0"
        >
          {aiAction.ctaLabel}
        </button>
      </div>
    </div>
  );
}

function MenteeDashboard({
  data,
}: {
  data: MenteeDashboardData;
}) {
  const router = useRouter();

  const rightSlot = (
    <>
      <NotificationBell />
      <button
        onClick={() => router.push("/messages")}
        className="w-9 h-9 rounded-full bg-brand-soft flex items-center justify-center text-brand hover:bg-brand-light transition-colors"
      >
        <IoChatbubbleOutline className="text-lg" />
      </button>
    </>
  );

  return (
    <AppLayout>
      <AppHeader rightSlot={rightSlot} />
      <main className="flex-1 px-5 py-5 space-y-5 overflow-y-auto">
        <MenteeWelcomeBanner data={data} />
        <MenteeUpcomingSession data={data} />
        <MenteeActiveGoals data={data} />
        <MenteeGrowthProgress data={data} />
        <MenteeRoadmapSummary data={data} />
        <MenteeAIAction data={data} />
      </main>
    </AppLayout>
  );
}

// ─── Mentor Dashboard ──────────────────────────────────────────────────────

function MentorWelcomeBanner({ data }: { data: MentorDashboardData }) {
  return (
    <div className="rounded-2xl p-5 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #824be5 0%, #a06af0 100%)" }}>
      <div className="absolute right-0 top-0 text-7xl opacity-20 leading-none select-none pr-3 pt-1">
        🌱
      </div>
      <div className="relative">
        <p className="text-white/80 text-sm font-medium mb-0.5">
          Bienvenida de vuelta
        </p>
        <h1 className="text-white text-xl font-bold mb-1">
          {data.userName} 🌟
        </h1>
        {data.sessionMilestoneCount > 0 && (
          <p className="text-purple-200 text-xs font-bold tracking-wide uppercase mb-3">
            {data.sessionMilestoneCount} sesiones de mentoría dadas
          </p>
        )}
        <p className="text-white/70 text-xs leading-relaxed italic">
          "Tu guía transforma el camino de otra mujer."
        </p>
        <p className="text-white/40 text-[10px] mt-0.5">— EllasTransforman</p>
      </div>
    </div>
  );
}

function MentorUpcomingSession({ data }: { data: MentorDashboardData }) {
  const router = useRouter();
  const session = data.upcomingSession;

  if (!session) {
    return (
      <section>
        <SectionHeader title="Próxima sesión" />
        <div className="bg-white rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-brand-soft flex items-center justify-center text-2xl flex-shrink-0">
            📅
          </div>
          <p className="text-gray-400 text-sm">No tienes sesiones programadas</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <SectionHeader title="Próxima sesión" />
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-brand-soft flex items-center justify-center text-2xl flex-shrink-0">
            {session.menteeAvatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-gray-900 leading-snug">
              {session.title}
            </p>
            <p className="text-brand text-xs mt-0.5">
              Con {session.menteeName} · Meta: {session.menteeGoal}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <IoCalendarOutline className="text-sm text-brand" />
            {session.dateLabel}
          </span>
          <span className="flex items-center gap-1">
            <IoTimeOutline className="text-sm text-brand" />
            {session.startTime} – {session.endTime}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <IoLocationOutline className="text-sm" />
            {session.locationType}
          </span>
          <button
            onClick={() => router.push("/sessions")}
            className="px-4 py-1.5 text-xs font-semibold rounded-full text-white bg-brand hover:opacity-90 transition-opacity"
          >
            Ver sesión
          </button>
        </div>
      </div>
    </section>
  );
}

function MentorActiveMentees({ data }: { data: MentorDashboardData }) {
  const router = useRouter();

  return (
    <section>
      <SectionHeader
        title="Tus mentees activas"
        action={{ label: "Ver todas", route: "/sessions" }}
      />
      {data.activeMentees.length === 0 ? (
        <div className="bg-white rounded-2xl px-5 py-6 shadow-sm text-center">
          <p className="text-gray-400 text-sm">Aún no tienes mentees activas</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-50">
          {data.activeMentees.map((mentee: MenteeProgressCard) => (
            <div key={mentee.id} className="px-4 py-3">
              <div className="flex items-center gap-3 mb-1.5">
                <div className="w-9 h-9 rounded-full bg-brand-soft flex items-center justify-center text-base flex-shrink-0">
                  {mentee.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900">
                      {mentee.name}
                    </p>
                    <div className="flex items-center gap-1.5">
                      {mentee.needsAttention && (
                        <span className="w-2 h-2 bg-amber-400 rounded-full flex-shrink-0" />
                      )}
                      <span className="text-xs font-bold text-brand">
                        {mentee.progressPercent}%
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">{mentee.goal}</p>
                </div>
              </div>
              <ProgressBar
                percent={mentee.progressPercent}
                color={mentee.needsAttention ? "bg-amber-400" : "bg-brand"}
              />
              <p className="text-[10px] text-gray-400 mt-1">{mentee.lastActivityLabel}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function MentorImpactSection({ data }: { data: MentorDashboardData }) {
  const { impactStats } = data;

  if (impactStats.sessionsGiven === 0) {
    return (
      <section>
        <SectionHeader title="Tu impacto" />
        <div className="bg-white rounded-2xl px-5 py-6 shadow-sm text-center">
          <p className="text-gray-400 text-sm">
            Tu impacto aparecerá aquí cuando des tu primera sesión
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <SectionHeader title="Tu impacto" />
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center mx-auto mb-1">
              <IoTrophyOutline className="text-brand text-lg" />
            </div>
            <p className="text-lg font-bold text-gray-900">{impactStats.sessionsGiven}</p>
            <p className="text-[10px] text-gray-400">Sesiones</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-1">
              <IoHeartOutline className="text-blue-500 text-lg" />
            </div>
            <p className="text-lg font-bold text-gray-900">{impactStats.menteesActive}</p>
            <p className="text-[10px] text-gray-400">Mentees</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center mx-auto mb-1">
              <IoPeopleOutline className="text-brand text-lg" />
            </div>
            <p className="text-lg font-bold text-gray-900">{impactStats.totalHours}h</p>
            <p className="text-[10px] text-gray-400">Horas dadas</p>
          </div>
        </div>

        <div className="mb-1">
          <p className="text-xs text-gray-400">{impactStats.chartLabel}</p>
        </div>
        <Sparkline data={impactStats.chartDataByWeek} color="#824be5" />
      </div>
    </section>
  );
}

function MentorProgramSection({ data }: { data: MentorDashboardData }) {
  const router = useRouter();
  const { programProgress } = data;

  if (programProgress.totalStages === 0) {
    return (
      <section>
        <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Programa actual
          </p>
          <p className="text-xs text-gray-400">Sin programa activo por el momento</p>
        </div>
      </section>
    );
  }

  const stagePercent = Math.round((programProgress.currentStage / programProgress.totalStages) * 100);

  return (
    <section>
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">
              Programa actual
            </p>
            <p className="text-sm font-bold text-gray-900">{programProgress.title}</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 text-brand bg-brand-soft">
            Etapa {programProgress.currentStage}/{programProgress.totalStages}
          </span>
        </div>

        <ProgressBar percent={stagePercent} color="bg-brand" />

        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-gray-500">
            Próximo: <span className="font-semibold text-gray-700">{programProgress.nextMilestone}</span>
          </p>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <IoPeopleOutline className="text-sm" />
            {programProgress.menteesEnrolled} mentees
          </span>
        </div>

        <button
          onClick={() => router.push("/sessions")}
          className="w-full mt-3 py-2 border border-brand text-brand text-xs font-semibold rounded-full hover:bg-brand-soft transition-colors"
        >
          Ver programa completo
        </button>
      </div>
    </section>
  );
}

function MentorAIAction({ data }: { data: MentorDashboardData }) {
  const router = useRouter();
  const { aiAction } = data;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-brand-soft">
      <div className="flex items-center gap-2 mb-2">
        <IoSparklesOutline className="text-brand text-base" />
        <p className="text-xs font-bold text-brand uppercase tracking-wide">
          Acción recomendada
        </p>
      </div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-gray-700 leading-snug flex-1">
          {aiAction.suggestion}
        </p>
        <button
          onClick={() => router.push(aiAction.ctaRoute)}
          className="px-5 py-2 text-white text-sm font-bold rounded-full bg-brand hover:opacity-90 transition-opacity flex-shrink-0"
        >
          {aiAction.ctaLabel}
        </button>
      </div>
    </div>
  );
}

function MentorDashboard({
  data,
}: {
  data: MentorDashboardData;
}) {
  const router = useRouter();

  const rightSlot = (
    <>
      <NotificationBell />
      <button
        onClick={() => router.push("/messages")}
        className="w-9 h-9 rounded-full bg-brand-soft flex items-center justify-center text-brand hover:bg-brand-soft/80 transition-colors"
      >
        <IoChatbubbleOutline className="text-lg" />
      </button>
    </>
  );

  return (
    <AppLayout>
      <AppHeader rightSlot={rightSlot} />
      <main className="flex-1 px-5 py-5 space-y-5 overflow-y-auto">
        <MentorWelcomeBanner data={data} />
        <MentorUpcomingSession data={data} />
        <MentorActiveMentees data={data} />
        <MentorImpactSection data={data} />
        <MentorProgramSection data={data} />
        <MentorAIAction data={data} />
      </main>
    </AppLayout>
  );
}

// ─── Shared helpers ────────────────────────────────────────────────────────

function SectionHeader({
  title,
  action,
}: {
  title: string;
  action?: { label: string; route: string };
}) {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
        {title}
      </h2>
      {action && (
        <button
          onClick={() => router.push(action.route)}
          className="text-brand text-xs font-semibold flex items-center gap-0.5 hover:underline"
        >
          {action.label}
          <IoChevronForward className="text-xs" />
        </button>
      )}
    </div>
  );
}

// ─── Page entry point ──────────────────────────────────────────────────────

export default function HomePage() {
  const router = useRouter();
  const [role, setRole] = useState<"mentee" | "mentor" | null>(null);
  const [menteeData, setMenteeData] = useState<MenteeDashboardData | null>(null);
  const [mentorData, setMentorData] = useState<MentorDashboardData | null>(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) { router.push("/welcome"); return; }

      // 1. profiles → role + nombre canónico
      let dbProfile: { full_name: string | null; role: string | null } | null = null;
      if (user) {
        const { data: p } = await supabase
          .from("profiles")
          .select("full_name, role")
          .eq("id", user.id)
          .maybeSingle();
        dbProfile = p;
      }

      const resolvedRole = (
        (dbProfile?.role as "mentee" | "mentor" | undefined) ??
        (user?.user_metadata?.role as "mentee" | "mentor" | undefined) ??
        (localStorage.getItem("ellas_role") as "mentee" | "mentor" | null) ??
        "mentee"
      );
      localStorage.setItem("ellas_role", resolvedRole);

      const resolvedName: string =
        dbProfile?.full_name ??
        user?.user_metadata?.full_name ??
        user?.user_metadata?.name ??
        localStorage.getItem("ellas_name") ??
        "—";

      if (resolvedRole === "mentee") {
        let upcomingSession: import("@/types/home").UpcomingBookingSession | null = null;
        let answers: Record<string, unknown> = {};
        let bookingCount = 0;
        let activeGoals: ActiveGoalCard[] = [];
        let roadmapSummary: import("@/types/home").RoadmapSummary = {
          pathTitle: "",
          currentStage: 0,
          totalStages: 0,
          completedItems: [],
          inProgressItem: "",
        };

        if (user) {
          const [bkRes, assessmentRes, countRes] = await Promise.all([
            supabase
              .from("bookings")
              .select("id, mentor_id, mentor_name, slot_label, scheduled_at")
              .eq("mentee_id", user.id)
              .eq("status", "confirmed")
              .gte("scheduled_at", new Date().toISOString())
              .order("scheduled_at", { ascending: true })
              .limit(1)
              .maybeSingle(),
            supabase
              .from("assessments")
              .select("answers")
              .eq("user_id", user.id)
              .order("created_at", { ascending: false })
              .limit(1)
              .maybeSingle(),
            supabase
              .from("bookings")
              .select("*", { count: "exact", head: true })
              .eq("mentee_id", user.id)
              .eq("status", "confirmed"),
          ]);

          const bk = bkRes.data;
          if (bk) {
            const dt  = new Date(bk.scheduled_at);
            const end = new Date(dt.getTime() + 30 * 60_000);
            upcomingSession = {
              id:           bk.id,
              title:        `Sesión de Mentoría con ${bk.mentor_name}`,
              mentorName:   bk.mentor_name,
              mentorRole:   "Mentora",
              mentorAvatar: "👩‍💼",
              dateLabel:    dt.toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" }),
              startTime:    dt.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: false }),
              endTime:      end.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: false }),
              locationType: "Online · 1:1",
              mentorId:     bk.mentor_id,
            };
          }

          if (assessmentRes.data?.answers) {
            answers = assessmentRes.data.answers as Record<string, unknown>;
          }
          bookingCount = countRes.count ?? 0;
        }

        if (!answers.goals) {
          const local = localStorage.getItem("ellas_mentee_answers");
          if (local) {
            try { answers = JSON.parse(local); } catch { /* ignore */ }
          }
        }

        try {
          const roadmapRes = await fetch("/api/roadmap", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              goals: (answers.goals as string[]) ?? [],
              interests: (answers.interests as string[]) ?? [],
              stage: (answers.stage as string) ?? "",
              bookingCount,
            }),
          });
          if (roadmapRes.ok) {
            const rd = await roadmapRes.json();
            const progressMap: Record<string, number> = {
              completed: 100,
              "in-progress": 60,
              upcoming: 20,
            };
            const iconMap: Record<string, { icon: string; iconBg: string }> = {
              completed:     { icon: "✅", iconBg: "bg-green-50" },
              "in-progress": { icon: "🚀", iconBg: "bg-brand-soft" },
              upcoming:      { icon: "🎯", iconBg: "bg-blue-50" },
            };
            activeGoals = (rd.milestones as Array<{ id: string; title: string; description: string; status: string }>)
              .filter((m) => m.status !== "locked" && m.status !== "suggested")
              .slice(0, 3)
              .map((m) => ({
                id: m.id,
                title: m.title,
                description: m.description,
                progressPercent: progressMap[m.status] ?? 10,
                icon: (iconMap[m.status] ?? { icon: "📌", iconBg: "bg-gray-50" }).icon,
                iconBg: (iconMap[m.status] ?? { icon: "📌", iconBg: "bg-gray-50" }).iconBg,
              }));

            const completed = (rd.milestones as Array<{ title: string; status: string }>)
              .filter((m) => m.status === "completed");
            const inProg = (rd.milestones as Array<{ title: string; status: string }>)
              .find((m) => m.status === "in-progress");
            const interests = (answers.interests as string[]) ?? [];
            roadmapSummary = {
              pathTitle: interests.length > 0
                ? `Ruta: ${interests.slice(0, 2).join(" & ")}`
                : "Tu ruta profesional",
              currentStage: completed.length + (inProg ? 1 : 0),
              totalStages: rd.milestones.length,
              completedItems: completed.map((m: { title: string }) => m.title),
              inProgressItem: inProg?.title ?? "",
            };
          }
        } catch { /* roadmap fetch failed, keep empty */ }

        setMenteeData({
          role: "mentee",
          userName: resolvedName,
          sessionMilestoneCount: 0,
          motivationalQuote: "Tu camino empieza aquí.",
          upcomingSession,
          activeGoals,
          growthStats: {
            sessionsThisMonth: 0,
            skillsGained: [],
            chartDataByWeek: [0, 0, 0, 0, 0, 0],
            chartLabel: "Últimas 6 semanas",
          },
          roadmapSummary,
          aiAction: {
            suggestion: "Explora mentoras disponibles y agenda tu primera sesión.",
            ctaLabel: "Explorar",
            ctaRoute: "/discover",
          },
        });

      } else {
        // ── Mentor branch: load real data from Supabase ──────────────────
        let upcomingSession: import("@/types/home").UpcomingMenteeSession | null = null;
        let activeMentees: import("@/types/home").MenteeProgressCard[] = [];
        let sessionsGiven = 0;
        let totalHours = 0;
        let menteesActive = 0;
        const chartDataByWeek: number[] = [0, 0, 0, 0, 0, 0];

        if (user) {
          const { data: mentorRows } = await supabase
            .from("bookings")
            .select("id, mentee_id, scheduled_at, duration_min, location_type, status")
            .eq("mentor_id", user.id)
            .neq("status", "cancelled");

          const allBookings = mentorRows ?? [];
          const nowIso = new Date().toISOString();

          const pastBookings = allBookings.filter((b) => b.scheduled_at <= nowIso);
          sessionsGiven = pastBookings.length;
          const totalMins = pastBookings.reduce((s, b) => s + (b.duration_min ?? 30), 0);
          totalHours = Math.round((totalMins / 60) * 10) / 10;

          const uniqueIds = [...new Set(allBookings.map((b) => b.mentee_id))];
          menteesActive = uniqueIds.length;

          const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
          for (const b of pastBookings) {
            const diffWeeks = Math.floor((Date.now() - new Date(b.scheduled_at).getTime()) / WEEK_MS);
            const idx = 5 - diffWeeks;
            if (idx >= 0 && idx <= 5) chartDataByWeek[idx]++;
          }

          if (uniqueIds.length > 0) {
            const { data: menteeProfiles } = await supabase
              .from("profiles")
              .select("id, full_name")
              .in("id", uniqueIds);

            const profileMap = new Map((menteeProfiles ?? []).map((p) => [p.id, p.full_name as string]));

            const futureBookings = allBookings
              .filter((b) => b.scheduled_at > nowIso)
              .sort((a, b) => a.scheduled_at.localeCompare(b.scheduled_at));
            const nextBk = futureBookings[0] ?? null;

            if (nextBk) {
              const dt = new Date(nextBk.scheduled_at);
              const end = new Date(dt.getTime() + (nextBk.duration_min ?? 30) * 60_000);
              upcomingSession = {
                id: nextBk.id,
                title: "Sesión de mentoría",
                menteeName: profileMap.get(nextBk.mentee_id) ?? "Mentee",
                menteeAvatar: "👩‍💻",
                menteeGoal: "Meta profesional",
                dateLabel: dt.toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" }),
                startTime: dt.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: false }),
                endTime: end.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: false }),
                locationType: nextBk.location_type,
                menteeId: nextBk.mentee_id,
              };
            }

            activeMentees = uniqueIds.slice(0, 4).map((mid) => {
              const mBookings = allBookings.filter((b) => b.mentee_id === mid);
              const pastMBookings = mBookings.filter((b) => b.scheduled_at <= nowIso);
              const lastPast = [...pastMBookings].sort((a, b) => b.scheduled_at.localeCompare(a.scheduled_at))[0];
              const futureMBookings = mBookings.filter((b) => b.scheduled_at > nowIso);
              const daysSince = lastPast
                ? Math.floor((Date.now() - new Date(lastPast.scheduled_at).getTime()) / 86_400_000)
                : null;
              const lastActivityLabel =
                daysSince === null
                  ? (futureMBookings.length > 0 ? "Sesión próxima" : "Sin actividad")
                  : daysSince === 0 ? "Hoy"
                  : daysSince === 1 ? "Ayer"
                  : `Hace ${daysSince} días`;
              return {
                id: mid,
                name: profileMap.get(mid) ?? "Mentee",
                avatar: "👩‍💻",
                goal: "Meta profesional",
                progressPercent: Math.min(100, mBookings.length * 12),
                lastActivityLabel,
                needsAttention: daysSince !== null && daysSince > 14,
              };
            });
          }
        }

        let suggestion: string;
        let ctaLabel: string;
        let ctaRoute: string;
        if (sessionsGiven === 0 && menteesActive === 0) {
          suggestion = "Completa tu perfil para empezar a recibir solicitudes de mentoría.";
          ctaLabel = "Mi perfil";
          ctaRoute = "/profile";
        } else if (sessionsGiven === 0) {
          suggestion = `Tienes ${menteesActive} mentee${menteesActive > 1 ? "s" : ""} esperando. Agenda tu primera sesión.`;
          ctaLabel = "Ver mentees";
          ctaRoute = "/mentor/mentees";
        } else {
          suggestion = `Llevas ${sessionsGiven} sesión${sessionsGiven > 1 ? "es" : ""} con ${menteesActive} mentee${menteesActive > 1 ? "s" : ""}. Sigue así.`;
          ctaLabel = "Ver sesiones";
          ctaRoute = "/sessions";
        }

        setMentorData({
          role: "mentor",
          userName: resolvedName,
          sessionMilestoneCount: sessionsGiven,
          upcomingSession,
          activeMentees,
          impactStats: {
            sessionsGiven,
            totalHours,
            menteesActive,
            chartDataByWeek,
            chartLabel: "Últimas 6 semanas",
          },
          programProgress: {
            title: "",
            currentStage: 0,
            totalStages: 0,
            nextMilestone: "—",
            menteesEnrolled: menteesActive,
          },
          aiAction: { suggestion, ctaLabel, ctaRoute },
        });
      }

      setRole(resolvedRole);
    }
    load();
  }, []);

  const isLoading =
    role === null ||
    (role === "mentee" && menteeData === null) ||
    (role === "mentor" && mentorData === null);

  if (isLoading) {
    return (
      <AppLayout>
        <AppHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-soft border-t-brand" />
        </div>
      </AppLayout>
    );
  }

  return role === "mentor"
    ? <MentorDashboard data={mentorData!} />
    : <MenteeDashboard data={menteeData!} />;
}
