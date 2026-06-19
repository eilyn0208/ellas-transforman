"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  IoFunnelOutline,
  IoLinkOutline,
  IoLocationOutline,
  IoDocumentOutline,
} from "react-icons/io5";
import type { SessionType, WeekDay } from "@/types/sessions";
import {
  sessionEvents,
  goalAgendaItems,
  weekStats,
  SESSION_FILTER_TYPES,
} from "@/constants/sessions";
import AppHeader from "@/components/AppHeader";
import AppLayout from "@/components/AppLayout";

const DAY_LABELS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const TIMELINE_START = 8;
const TIMELINE_END = 18;

function getWeekDays(ref: Date): WeekDay[] {
  const d = new Date(ref);
  const dow = d.getDay();
  d.setDate(d.getDate() - (dow === 0 ? 6 : dow - 1));
  d.setHours(0, 0, 0, 0);

  const todayMs = (() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t.getTime();
  })();

  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(d);
    day.setDate(d.getDate() + i);
    return {
      date: day.toISOString().split("T")[0],
      dayLabel: DAY_LABELS[i],
      dayNumber: day.getDate(),
      dayOfWeek: i,
      isToday: day.getTime() === todayMs,
    };
  });
}

const SESSION_BADGE: Record<SessionType, { label: string; className: string }> =
  {
    mentoring: { label: "1:1", className: "bg-brand text-white" },
    cohort: { label: "Cohorte", className: "bg-purple-100 text-purple-700" },
    workshop: { label: "Taller", className: "bg-orange-100 text-orange-700" },
    "office-hours": { label: "Oficina", className: "bg-blue-100 text-blue-700" },
  };

export default function SessionsPage() {
  const router = useRouter();
  const weekDays = useMemo(() => getWeekDays(new Date()), []);

  const todayIndex = weekDays.find((d) => d.isToday)?.dayOfWeek;
  const [selectedDow, setSelectedDow] = useState<number>(todayIndex ?? 2);
  const [showFilter, setShowFilter] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(
    new Set(SESSION_FILTER_TYPES.map((f) => f.id))
  );

  const toggleFilter = (id: string) =>
    setActiveFilters((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const dayEvents = sessionEvents.filter(
    (e) => e.dayOfWeek === selectedDow && activeFilters.has(e.type)
  );
  const dayGoals = goalAgendaItems.filter(
    (g) => g.dayOfWeek === selectedDow && activeFilters.has("goals")
  );

  const timeline = useMemo(() => {
    type Slot =
      | { kind: "hour"; hour: number }
      | { kind: "session"; event: (typeof sessionEvents)[0] }
      | { kind: "goal"; goal: (typeof goalAgendaItems)[0] };

    const slots: Slot[] = [];
    let goalsInserted = false;

    for (let h = TIMELINE_START; h <= TIMELINE_END; h++) {
      slots.push({ kind: "hour", hour: h });

      const atHour = dayEvents.filter((e) => parseInt(e.startTime) === h);
      atHour.forEach((e) => slots.push({ kind: "session", event: e }));

      if (
        h === 12 &&
        dayGoals.length > 0 &&
        !dayEvents.some((e) => parseInt(e.startTime) === 13) &&
        !goalsInserted
      ) {
        dayGoals.forEach((g) => slots.push({ kind: "goal", goal: g }));
        goalsInserted = true;
      }
    }

    if (!goalsInserted && dayGoals.length > 0) {
      dayGoals.forEach((g) => slots.push({ kind: "goal", goal: g }));
    }

    return slots;
  }, [dayEvents, dayGoals]);

  const selectedDay = weekDays[selectedDow];
  const hasContent = dayEvents.length > 0 || dayGoals.length > 0;

  return (
    <AppLayout>
      {/* Sticky header: AppHeader + week strip */}
      <div className="flex-shrink-0 z-10 bg-white shadow-sm">
        <AppHeader
          shadow={false}
          rightSlot={
            <span className="text-sm font-semibold text-gray-500">
              Esta semana
            </span>
          }
        />
        <div className="flex justify-between gap-1 px-5 pb-4">
          {weekDays.map((day) => (
            <button
              key={day.dayOfWeek}
              onClick={() => setSelectedDow(day.dayOfWeek)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-2xl transition-colors flex-1 ${
                day.dayOfWeek === selectedDow
                  ? "bg-brand text-white"
                  : day.isToday
                  ? "bg-brand-soft text-brand"
                  : "text-gray-500 hover:bg-brand-soft"
              }`}
            >
              <span className="text-[9px] font-medium">{day.dayLabel}</span>
              <span className="text-sm font-bold">{day.dayNumber}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto">
        {/* Stats row */}
        <div className="px-5 pt-4 pb-3 grid grid-cols-3 gap-2">
          <StatCard
            main={String(weekStats.sessionsCount)}
            label="esta semana"
            sub={`Próx: ${weekStats.nextSessionLabel}`}
          />
          <StatCard
            main={`${weekStats.hoursTotal} hrs`}
            label="dedicadas"
            sub={`Meta: ${weekStats.hoursWeeklyTarget} hrs`}
          />
          <StatCard
            main={String(weekStats.activeGoalsCount)}
            label="metas activas"
            sub={`${weekStats.goalsDueThisWeek} vencen pronto`}
          />
        </div>

        {/* Timeline */}
        <div className="px-5">
          {hasContent ? (
            timeline.map((slot, i) => {
              if (slot.kind === "hour") {
                return (
                  <div
                    key={`h-${slot.hour}-${i}`}
                    className="flex items-center gap-2 py-1"
                  >
                    <span className="text-[11px] text-gray-400 w-11 text-right flex-shrink-0 tabular-nums">
                      {String(slot.hour).padStart(2, "0")}:00
                    </span>
                    <div className="flex-1 h-px bg-gray-100" />
                  </div>
                );
              }

              if (slot.kind === "session") {
                const { event } = slot;
                const badge = SESSION_BADGE[event.type];
                return (
                  <div
                    key={event.id}
                    className="ml-14 mb-2 bg-white rounded-2xl p-4 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center text-xl flex-shrink-0">
                        {event.mentorAvatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-bold text-gray-900 text-sm leading-tight truncate">
                              {event.mentorName}
                            </p>
                            <p className="text-gray-400 text-[11px] mt-0.5">
                              {event.mentorRole} • {event.startTime} -{" "}
                              {event.endTime}
                            </p>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap ${badge.className}`}
                          >
                            {badge.label}
                          </span>
                        </div>
                        <p className="text-brand text-[11px] mt-1.5 leading-relaxed">
                          {event.description}
                        </p>
                        {(event.zoomLink ||
                          event.location ||
                          event.hasMaterials) && (
                          <div className="flex gap-3 mt-1.5">
                            {event.zoomLink && (
                              <button className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-brand transition-colors">
                                <IoLinkOutline size={11} />
                                Zoom
                              </button>
                            )}
                            {event.location && (
                              <span className="flex items-center gap-1 text-[10px] text-gray-400">
                                <IoLocationOutline size={11} />
                                {event.location}
                              </span>
                            )}
                            {event.hasMaterials && (
                              <span className="flex items-center gap-1 text-[10px] text-gray-400">
                                <IoDocumentOutline size={11} />
                                Materiales
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }

              if (slot.kind === "goal") {
                const { goal } = slot;
                return (
                  <div
                    key={goal.id}
                    className="ml-14 mb-2 bg-white rounded-2xl p-4 shadow-sm border-l-4 border-brand"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">🎯</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-sm leading-tight">
                          {goal.title}
                        </p>
                        <p className="text-gray-400 text-[11px] mt-0.5">
                          Responsable: {goal.owner} • Fecha límite: {goal.dueDateLabel}
                        </p>
                        <div className="mt-2 mb-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand rounded-full"
                            style={{ width: `${goal.progressPercent}%` }}
                          />
                        </div>
                        <p className="text-brand text-[11px] leading-relaxed">
                          {goal.progressPercent}% — {goal.progressNote}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }

              return null;
            })
          ) : (
            <div className="mt-12 flex flex-col items-center gap-3 text-center px-8">
              <span className="text-5xl">📅</span>
              <p className="text-gray-500 text-sm leading-relaxed">
                No tienes eventos para{" "}
                <span className="font-semibold text-gray-700">
                  {selectedDay?.dayLabel} {selectedDay?.dayNumber}
                </span>
              </p>
              <button
                onClick={() => router.push("/discover")}
                className="text-brand text-sm font-semibold hover:underline"
              >
                Buscar mentora →
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Filter sheet overlay */}
      {showFilter && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-20"
            onClick={() => setShowFilter(false)}
          />
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md lg:max-w-2xl bg-white rounded-t-3xl px-5 pt-5 pb-8 z-30 shadow-xl">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <p className="font-bold text-gray-900 text-base mb-4">
              Filtrar por tipo
            </p>
            <div className="flex flex-wrap gap-2">
              {SESSION_FILTER_TYPES.map((f) => (
                <button
                  key={f.id}
                  onClick={() => toggleFilter(f.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    activeFilters.has(f.id)
                      ? "bg-brand text-white border-brand"
                      : "bg-white text-gray-500 border-gray-200 hover:bg-brand-soft"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowFilter(false)}
              className="mt-5 w-full bg-brand text-white font-semibold py-2.5 rounded-full hover:bg-brand-dark transition-colors"
            >
              Aplicar
            </button>
          </div>
        </>
      )}

      {/* Action bar — in flow, above BottomNav */}
      <div className="flex-shrink-0 w-full bg-white border-t border-gray-100 px-5 py-3 flex items-center justify-between">
        <button className="text-sm font-semibold text-gray-400 hover:text-brand transition-colors">
          Vista día
        </button>
        <button
          onClick={() => setShowFilter(true)}
          className="flex items-center gap-2 bg-brand text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-brand-dark transition-colors shadow-sm"
        >
          <IoFunnelOutline size={14} />
          Filtrar
        </button>
      </div>
    </AppLayout>
  );
}

function StatCard({
  main,
  label,
  sub,
}: {
  main: string;
  label: string;
  sub: string;
}) {
  return (
    <div className="bg-white rounded-2xl px-3 py-3 shadow-sm">
      <p className="font-extrabold text-gray-900 text-base leading-none">
        {main}
      </p>
      <p className="text-gray-500 text-[10px] mt-0.5 leading-tight">{label}</p>
      <p className="text-gray-400 text-[10px] mt-1.5 leading-tight">{sub}</p>
    </div>
  );
}
