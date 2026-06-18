"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { IoTimeOutline, IoCalendarOutline } from "react-icons/io5";
import { mentors } from "@/constants/mentors";
import PrimaryButton from "@/components/PrimaryButton";
import AppLayout from "@/components/AppLayout";

interface Props {
  params: Promise<{ mentorId: string }>;
}

const DAY_NAMES = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

function buildSlots() {
  const today = new Date();
  const dayAfter = new Date(today);
  dayAfter.setDate(today.getDate() + 2);

  return [
    { id: "1", label: "Hoy · 3:30 PM", icon: "time" as const },
    { id: "2", label: "Mañana · 10:00 AM", icon: "calendar" as const },
    {
      id: "3",
      label: `${DAY_NAMES[dayAfter.getDay()]} · 5:00 PM`,
      icon: "calendar" as const,
    },
  ];
}

const slots = buildSlots();

export default function SchedulePage({ params }: Props) {
  const { mentorId } = use(params);
  const router = useRouter();
  const mentor = mentors.find((m) => m.id === mentorId);
  const [selectedId, setSelectedId] = useState("1");

  if (!mentor) {
    router.replace("/discover");
    return null;
  }

  const firstName = mentor.name.split(" ")[0];

  const handleConfirm = () => {
    const selected = slots.find((s) => s.id === selectedId);
    if (!selected) return;
    router.push(
      `/booking/${mentorId}/confirmed?slot=${encodeURIComponent(selected.label)}`
    );
  };

  return (
    <AppLayout showNav={false} bg="bg-white">
      {/* Header */}
      <header className="flex items-center gap-4 px-5 py-4 border-b border-gray-100 flex-shrink-0">
        <button
          onClick={() => router.back()}
          className="text-gray-500 text-xl w-8 h-8 flex items-center justify-center hover:text-gray-800 transition-colors"
          aria-label="Volver"
        >
          ←
        </button>
        <div
          className="w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center text-xl flex-shrink-0"
          aria-hidden
        >
          {mentor.avatar}
        </div>
        <div>
          <p className="font-bold text-sm leading-tight">
            Agenda con {firstName}
          </p>
          <p className="text-gray-400 text-xs">Elige un horario</p>
        </div>
      </header>

      <div className="flex-1 px-5 py-6 flex flex-col gap-6">
        <div>
          <h2 className="font-bold text-base mb-1">Horarios disponibles</h2>
          <p className="text-brand text-xs leading-relaxed">
            Elige un momento para tu sesión de mentoría de 45 minutos
          </p>
        </div>

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
                    className={`text-lg flex-shrink-0 ${
                      isSelected ? "text-white" : "text-brand"
                    }`}
                  />
                ) : (
                  <IoCalendarOutline
                    className={`text-lg flex-shrink-0 ${
                      isSelected ? "text-white" : "text-brand"
                    }`}
                  />
                )}
                <span>{slot.label}</span>
              </button>
            );
          })}
        </div>

        <p className="text-gray-400 text-xs leading-relaxed">
          Las sesiones duran 45 minutos. Puedes cancelar hasta 12 horas antes
          sin penalización.
        </p>

        <div className="mt-auto pt-4">
          <PrimaryButton onClick={handleConfirm}>
            Confirmar sesión
          </PrimaryButton>
        </div>
      </div>
    </AppLayout>
  );
}
