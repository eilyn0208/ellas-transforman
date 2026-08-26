"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoTimeOutline, IoCalendarOutline } from "react-icons/io5";
import PrimaryButton from "@/components/PrimaryButton";
import AppLayout from "@/components/AppLayout";
import AppHeader from "@/components/AppHeader";
import { supabase } from "@/lib/supabase/client";
import { getMentorProfile, type MentorProfileSummary } from "@/lib/mentors";

interface Props {
  params: Promise<{ mentorId: string }>;
}

interface Slot {
  id: string;
  label: string;
  scheduledAt: string;
  icon: "time" | "calendar";
}

const DAY_NAMES = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

function nextOccurrence(dayOfWeek: number, hour: number, minute: number): Date {
  const now = new Date();
  const daysUntil = (dayOfWeek - now.getDay() + 7) % 7;

  const candidate = new Date(now);
  candidate.setDate(now.getDate() + (daysUntil === 0 ? 0 : daysUntil));
  candidate.setHours(hour, minute, 0, 0);

  // If today's slot has already passed (with 30 min buffer), push to next week
  if (candidate.getTime() <= now.getTime() + 30 * 60 * 1000) {
    candidate.setDate(candidate.getDate() + 7);
  }

  return candidate;
}

export default function SchedulePage({ params }: Props) {
  const { mentorId } = use(params);
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mentor, setMentor] = useState<MentorProfileSummary | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getMentorProfile(mentorId).then((data) => {
      setMentor(data);
      setReady(true);
    });
  }, [mentorId]);

  useEffect(() => {
    if (!ready) return;
    async function fetchSlots() {
      setLoading(true);

      const { data: avail } = await supabase
        .from("mentor_availability")
        .select("day_of_week, hour, minute, label")
        .eq("mentor_id", mentorId);

      if (!avail || avail.length === 0) {
        setLoading(false);
        return;
      }

      const computed = avail.map((s, i) => {
        const dt = nextOccurrence(s.day_of_week, s.hour, s.minute);
        const isToday = dt.toDateString() === new Date().toDateString();
        const dayLabel = isToday ? "Hoy" : DAY_NAMES[dt.getDay()];
        const timePart = s.label.split(" · ")[1] ?? "";
        return {
          id: String(i),
          label: `${dayLabel} · ${timePart}`,
          scheduledAt: dt.toISOString(),
          icon: isToday ? ("time" as const) : ("calendar" as const),
        };
      });

      // Filter slots already booked for this mentor using day+hour+minute key
      const { data: futureBookings } = await supabase
        .from("bookings")
        .select("scheduled_at")
        .eq("mentor_id", mentorId)
        .neq("status", "cancelled")
        .gte("scheduled_at", new Date().toISOString());

      const takenKeys = new Set(
        (futureBookings ?? []).map((b) => {
          const dt = new Date(b.scheduled_at);
          return `${dt.getDay()}-${dt.getHours()}-${dt.getMinutes()}`;
        })
      );

      const available = computed.filter((c) => {
        const dt = new Date(c.scheduledAt);
        return !takenKeys.has(`${dt.getDay()}-${dt.getHours()}-${dt.getMinutes()}`);
      });

      setSlots(available);
      if (available.length > 0) setSelectedId(available[0].id);
      setLoading(false);
    }
    fetchSlots();
  }, [ready, mentorId]);

  if (!ready) return null;
  if (!mentor) { router.replace("/discover"); return null; }

  const firstName = mentor.name.split(" ")[0];

  const handleConfirm = () => {
    const selected = slots.find((s) => s.id === selectedId);
    if (!selected) return;
    router.push(
      `/booking/${mentorId}/confirmed?slot=${encodeURIComponent(selected.label)}&scheduledAt=${encodeURIComponent(selected.scheduledAt)}`
    );
  };

  return (
    <AppLayout showNav={false}>
      <AppHeader showBack title={`Agenda con ${firstName}`} />

      <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-6">
        <div>
          <h2 className="font-bold text-base mb-1">Horarios disponibles</h2>
          <p className="text-brand text-xs leading-relaxed">
            Elige un momento para tu sesión de mentoría de 30 minutos
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center gap-3 py-10">
            <div className="w-8 h-8 rounded-full border-4 border-brand-soft border-t-brand animate-spin" />
            <p className="text-gray-400 text-sm">Cargando horarios...</p>
          </div>
        ) : slots.length === 0 ? (
          <div className="bg-brand-soft rounded-2xl px-5 py-6 text-center">
            <p className="text-brand font-semibold text-sm mb-1">
              Sin horarios disponibles
            </p>
            <p className="text-gray-500 text-xs leading-relaxed">
              Esta mentora aún no ha configurado sus horarios o todos están reservados.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {slots.map((slot) => {
              const isSelected = selectedId === slot.id;
              return (
                <button
                  key={slot.id}
                  onClick={() => setSelectedId(slot.id)}
                  className={`w-full flex items-center gap-4 py-4 px-6 rounded-full font-semibold text-sm transition-colors ${
                    isSelected
                      ? "bg-brand text-white"
                      : "bg-white border border-gray-200 text-gray-700 hover:border-brand"
                  }`}
                >
                  {slot.icon === "time" ? (
                    <IoTimeOutline
                      className={`text-lg flex-shrink-0 ${isSelected ? "text-white" : "text-brand"}`}
                    />
                  ) : (
                    <IoCalendarOutline
                      className={`text-lg flex-shrink-0 ${isSelected ? "text-white" : "text-brand"}`}
                    />
                  )}
                  <span>{slot.label}</span>
                </button>
              );
            })}
          </div>
        )}

        <p className="text-gray-400 text-xs leading-relaxed">
          Las sesiones duran 30 minutos. Puedes cancelar hasta 12 horas antes sin penalización.
        </p>

        {slots.length > 0 && (
          <div className="mt-auto pt-4">
            <PrimaryButton onClick={handleConfirm}>
              Confirmar sesión
            </PrimaryButton>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
