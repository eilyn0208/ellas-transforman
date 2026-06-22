"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import {
  IoFunnelOutline,
  IoLinkOutline,
  IoLocationOutline,
  IoDocumentOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoCloseCircleOutline,
} from "react-icons/io5";
import type { SessionType, WeekDay, SessionEvent, WeekStats } from "@/types/sessions";
import { SESSION_FILTER_TYPES } from "@/constants/sessions";
import AppHeader from "@/components/AppHeader";
import AppLayout from "@/components/AppLayout";

const DAY_LABELS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const MONTH_SHORT = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
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
    // Build date string in local timezone to match bookingToEvent's local-date extraction
    const localDate = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
    return {
      date: localDate,
      dayLabel: DAY_LABELS[i],
      dayNumber: day.getDate(),
      dayOfWeek: i,
      isToday: day.getTime() === todayMs,
    };
  });
}

const SESSION_BADGE: Record<SessionType, { label: string; className: string }> = {
  mentoring: { label: "1:1", className: "bg-brand text-white" },
  cohort: { label: "Cohorte", className: "bg-purple-100 text-purple-700" },
  workshop: { label: "Taller", className: "bg-orange-100 text-orange-700" },
  "office-hours": { label: "Oficina", className: "bg-blue-100 text-blue-700" },
};

function bookingToEvent(
  b: { id: string; scheduled_at: string; duration_min: number; location_type: string; slot_label?: string | null },
  partyName: string,
  partyRole: string,
  dateToWeekDow: Map<string, number>
): SessionEvent | null {
  // Use local date string (YYYY-MM-DD) so timezone doesn't shift the calendar day
  const dtObj = new Date(b.scheduled_at);
  const dateStr = `${dtObj.getFullYear()}-${String(dtObj.getMonth() + 1).padStart(2, "0")}-${String(dtObj.getDate()).padStart(2, "0")}`;
  const dow = dateToWeekDow.get(dateStr);
  if (dow === undefined) return null;

  const dt = new Date(b.scheduled_at);
  const durMin = b.duration_min ?? 30;
  const end = new Date(dt.getTime() + durMin * 60_000);

  return {
    id: b.id,
    type: "mentoring",
    startTime: dt.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: false }),
    endTime: end.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: false }),
    dayOfWeek: dow,
    mentorName: partyName,
    mentorRole: partyRole,
    mentorAvatar: "👩‍💻",
    description: b.slot_label ?? b.location_type ?? "Sesión de mentoría",
    bookingId: b.id,
  };
}

function computeWeekStats(events: SessionEvent[], totalDurMins: number): WeekStats {
  const todayRaw = new Date().getDay();
  const todayDow = todayRaw === 0 ? 6 : todayRaw - 1;

  const upcoming = events
    .filter((e) => e.dayOfWeek >= todayDow)
    .sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime))[0];

  return {
    sessionsCount: events.length,
    nextSessionLabel: upcoming ? `${DAY_LABELS[upcoming.dayOfWeek]} ${upcoming.startTime}` : "—",
    hoursTotal: Math.round((totalDurMins / 60) * 10) / 10,
    hoursWeeklyTarget: 0,
    activeGoalsCount: 0,
    goalsDueThisWeek: 0,
  };
}

export default function SessionsPage() {
  const router = useRouter();
  const [refWeek, setRefWeek] = useState(() => new Date());
  const weekDays = useMemo(() => getWeekDays(refWeek), [refWeek]);

  const [selectedDow, setSelectedDow] = useState<number>(() => {
    const today = getWeekDays(new Date());
    return today.find((d) => d.isToday)?.dayOfWeek ?? 0;
  });

  const prevWeek = () => setRefWeek((d) => { const n = new Date(d); n.setDate(d.getDate() - 7); return n; });
  const nextWeek = () => setRefWeek((d) => { const n = new Date(d); n.setDate(d.getDate() + 7); return n; });
  const [showFilter, setShowFilter] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(
    new Set(SESSION_FILTER_TYPES.map((f) => f.id))
  );
  const [role, setRole] = useState<"mentee" | "mentor">("mentee");
  const [liveEvents, setLiveEvents] = useState<SessionEvent[]>([]);
  const durMinRef = useRef<Map<string, number>>(new Map());
  const [weekTotalMins, setWeekTotalMins] = useState(0);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [weekStats, setWeekStats] = useState<WeekStats>({
    sessionsCount: 0,
    nextSessionLabel: "—",
    hoursTotal: 0,
    hoursWeeklyTarget: 0,
    activeGoalsCount: 0,
    goalsDueThisWeek: 0,
  });

  useEffect(() => {
    const r = (localStorage.getItem("ellas_role") as "mentee" | "mentor") ?? "mentee";
    setRole(r);

    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/welcome"); return; }

      const dateToWeekDow = new Map(weekDays.map((d) => [d.date, d.dayOfWeek]));
      const weekStart = weekDays[0].date;
      const weekEnd = weekDays[6].date;
      // Use local-timezone midnight so dates match the visible calendar days
      const weekStartIso = new Date(weekStart + "T00:00:00").toISOString();
      const weekEndIso   = new Date(weekEnd   + "T23:59:59.999").toISOString();

      if (r === "mentor") {
        const { data: bkRows } = await supabase
          .from("bookings")
          .select("id, mentee_id, scheduled_at, duration_min, location_type, slot_label")
          .eq("mentor_id", user.id)
          .neq("status", "cancelled")
          .gte("scheduled_at", weekStartIso)
          .lte("scheduled_at", weekEndIso);

        const bookings = bkRows ?? [];
        const menteeIds = [...new Set(bookings.map((b) => b.mentee_id))].filter(Boolean) as string[];

        let nameMap = new Map<string, string>();
        if (menteeIds.length > 0) {
          const { data: profiles } = await supabase
            .from("profiles")
            .select("id, full_name")
            .in("id", menteeIds);
          nameMap = new Map((profiles ?? []).map((p) => [p.id, p.full_name as string]));
        }

        const events = bookings
          .map((b) => bookingToEvent(b, nameMap.get(b.mentee_id) ?? "Mentee", "Mentee", dateToWeekDow))
          .filter((e): e is SessionEvent => e !== null);

        const totalMins = bookings.reduce((s, b) => s + (b.duration_min ?? 30), 0);
        durMinRef.current = new Map(bookings.map((b) => [b.id, b.duration_min ?? 30]));
        setWeekTotalMins(totalMins);
        setLiveEvents(events);
        setWeekStats(computeWeekStats(events, totalMins));
      } else {
        const { data: bkRows } = await supabase
          .from("bookings")
          .select("id, mentor_name, scheduled_at, duration_min, location_type, slot_label")
          .eq("mentee_id", user.id)
          .neq("status", "cancelled")
          .gte("scheduled_at", weekStartIso)
          .lte("scheduled_at", weekEndIso);

        const bookings = bkRows ?? [];
        const events = bookings
          .map((b) => bookingToEvent(b, b.mentor_name ?? "Mentora", "Mentora", dateToWeekDow))
          .filter((e): e is SessionEvent => e !== null);

        const totalMins = bookings.reduce((s, b) => s + (b.duration_min ?? 30), 0);
        durMinRef.current = new Map(bookings.map((b) => [b.id, b.duration_min ?? 30]));
        setWeekTotalMins(totalMins);
        setLiveEvents(events);
        setWeekStats(computeWeekStats(events, totalMins));
      }
    }
    load();
  }, [weekDays]);

  const toggleFilter = (id: string) =>
    setActiveFilters((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleCancel = async (bookingId: string) => {
    setCancelling(true);
    const { error } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", bookingId);
    if (!error) {
      const nextEvents = liveEvents.filter((e) => e.id !== bookingId);
      const cancelledMins = durMinRef.current.get(bookingId) ?? 30;
      const newTotalMins = weekTotalMins - cancelledMins;
      setLiveEvents(nextEvents);
      setWeekTotalMins(newTotalMins);
      setWeekStats(computeWeekStats(nextEvents, newTotalMins));
    }
    setCancelling(false);
    setCancellingId(null);
  };

  const dayEvents = liveEvents.filter(
    (e) => e.dayOfWeek === selectedDow && activeFilters.has(e.type)
  );

  const timeline = useMemo(() => {
    type Slot =
      | { kind: "hour"; hour: number }
      | { kind: "session"; event: SessionEvent };

    const slots: Slot[] = [];

    for (let h = TIMELINE_START; h <= TIMELINE_END; h++) {
      slots.push({ kind: "hour", hour: h });
      const atHour = dayEvents.filter((e) => parseInt(e.startTime) === h);
      atHour.forEach((e) => slots.push({ kind: "session", event: e }));
    }

    return slots;
  }, [dayEvents]);

  const selectedDay = weekDays[selectedDow];
  const hasContent = dayEvents.length > 0;

  return (
    <AppLayout>
      <div className="flex-shrink-0 z-10 bg-white shadow-sm">
        <AppHeader
          shadow={false}
          rightSlot={
            <div className="flex items-center gap-1.5">
              <button
                onClick={prevWeek}
                className="w-7 h-7 rounded-full bg-brand-soft text-brand flex items-center justify-center hover:bg-brand-light transition-colors"
              >
                <IoChevronBackOutline size={13} />
              </button>
              <span className="text-xs font-semibold text-gray-500 min-w-[80px] text-center">
                {weekDays[0].dayNumber}–{weekDays[6].dayNumber}{" "}
                {MONTH_SHORT[new Date(weekDays[0].date + "T00:00:00").getMonth()]}
              </span>
              <button
                onClick={nextWeek}
                className="w-7 h-7 rounded-full bg-brand-soft text-brand flex items-center justify-center hover:bg-brand-light transition-colors"
              >
                <IoChevronForwardOutline size={13} />
              </button>
            </div>
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

      <main className="flex-1 overflow-y-auto">
        <div className="px-5 pt-4 pb-3 grid grid-cols-3 gap-2">
          <StatCard
            main={String(weekStats.sessionsCount)}
            label="esta semana"
            sub={`Próx: ${weekStats.nextSessionLabel}`}
          />
          <StatCard
            main={weekStats.hoursTotal > 0 ? `${weekStats.hoursTotal} hrs` : "0 hrs"}
            label="dedicadas"
            sub={weekStats.hoursWeeklyTarget > 0 ? `Meta: ${weekStats.hoursWeeklyTarget} hrs` : "—"}
          />
          <StatCard
            main="—"
            label="metas activas"
            sub="próximamente"
          />
        </div>

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

                        {cancellingId === event.id ? (
                          <div className="mt-3 p-3 bg-red-50 rounded-xl flex items-center gap-2">
                            <p className="text-[11px] text-red-700 flex-1 font-medium">¿Cancelar esta sesión?</p>
                            <button
                              disabled={cancelling}
                              onClick={() => handleCancel(event.id)}
                              className="px-3 py-1.5 bg-red-500 text-white text-[11px] font-semibold rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
                            >
                              {cancelling ? "..." : "Sí, cancelar"}
                            </button>
                            <button
                              onClick={() => setCancellingId(null)}
                              className="px-3 py-1.5 border border-gray-200 text-gray-500 text-[11px] font-semibold rounded-full hover:bg-gray-50 transition-colors"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setCancellingId(event.id)}
                            className="mt-3 w-full flex items-center justify-center gap-1.5 px-3 py-2 border border-red-200 text-red-500 text-xs font-semibold rounded-full hover:bg-red-50 transition-colors"
                          >
                            <IoCloseCircleOutline size={14} />
                            Cancelar sesión
                          </button>
                        )}
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
                No tienes sesiones para{" "}
                <span className="font-semibold text-gray-700">
                  {selectedDay?.dayLabel} {selectedDay?.dayNumber}
                </span>
              </p>
              {role === "mentor" ? (
                <button
                  onClick={() => router.push("/mentor/mentees")}
                  className="text-brand text-sm font-semibold hover:underline"
                >
                  Ver mis mentees →
                </button>
              ) : (
                <button
                  onClick={() => router.push("/discover")}
                  className="text-brand text-sm font-semibold hover:underline"
                >
                  Buscar mentora →
                </button>
              )}
            </div>
          )}
        </div>
      </main>

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
