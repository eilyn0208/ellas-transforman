"use client";

import { use, useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IoCalendarOutline } from "react-icons/io5";
import PrimaryButton from "@/components/PrimaryButton";
import AppLayout from "@/components/AppLayout";
import AppHeader from "@/components/AppHeader";

interface Props {
  params: Promise<{ mentorId: string }>;
}

interface SelectedMentor {
  user_id: string;
  name: string;
}

function ConfirmedContent({ mentorId: _mentorId }: { mentorId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slot = searchParams.get("slot") ?? "Hoy · 3:30 PM";
  const [mentor, setMentor] = useState<SelectedMentor | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("ellas_selected_mentor");
      if (raw) setMentor(JSON.parse(raw));
    } catch { /* ignore */ }
    setReady(true);
  }, []);

  if (!ready) return null;
  if (!mentor) { router.replace("/discover"); return null; }

  const firstName = mentor.name.split(" ")[0];

  return (
    <AppLayout showNav={false}>
      <AppHeader showBack title="Sesión confirmada" />
      <main className="flex-1 overflow-y-auto flex flex-col items-center px-5 py-5">
        {/* Glow + checkmark */}
        <div className="flex flex-col items-center w-full gap-5">
          <div className="relative flex items-center justify-center mb-2">
            <div className="absolute w-40 h-40 rounded-full bg-brand-light opacity-40" />
            <div className="absolute w-32 h-32 rounded-full bg-brand-soft opacity-60" />
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-md relative z-10">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#824be5"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold mb-1">¡Sesión agendada!</h1>
            <p className="text-gray-500 text-sm">Tu mentoría está confirmada</p>
          </div>

          {/* Mentor info card */}
          <div className="w-full bg-white rounded-2xl px-5 py-4 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-brand-soft flex items-center justify-center text-2xl font-bold text-brand flex-shrink-0">
              {mentor.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-sm">
                {firstName}{" "}
                <span className="font-normal text-gray-400">· Mentora</span>
              </p>
              <div className="flex items-center gap-1 mt-1">
                <IoCalendarOutline className="text-brand text-xs flex-shrink-0" />
                <p className="text-gray-500 text-xs">{slot}</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="w-full mt-auto">
          <PrimaryButton onClick={() => router.push("/home")}>
            Ir al inicio
          </PrimaryButton>
        </div>
      </main>
    </AppLayout>
  );
}

export default function ConfirmedPage({ params }: Props) {
  const { mentorId } = use(params);
  return (
    <Suspense>
      <ConfirmedContent mentorId={mentorId} />
    </Suspense>
  );
}
