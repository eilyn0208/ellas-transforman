"use client";

import { use, useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IoCalendarOutline } from "react-icons/io5";
import PrimaryButton from "@/components/PrimaryButton";
import AppLayout from "@/components/AppLayout";
import AppHeader from "@/components/AppHeader";
import { supabase } from "@/lib/supabase/client";
import { getMentorProfile, type MentorProfileSummary } from "@/lib/mentors";

interface Props {
  params: Promise<{ mentorId: string }>;
}

function ConfirmedContent({ mentorId }: { mentorId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slot        = searchParams.get("slot")        ?? "Hoy · 3:30 PM";
  const scheduledAt = searchParams.get("scheduledAt") ?? new Date().toISOString();
  const [mentor, setMentor] = useState<MentorProfileSummary | null>(null);
  const [ready, setReady] = useState(false);
  const savedRef = useRef(false);

  useEffect(() => {
    getMentorProfile(mentorId).then((data) => {
      setMentor(data);
      setReady(true);
    });
  }, [mentorId]);

  // Persist booking exactly once. Double guard:
  // - savedRef: prevents React Strict Mode double-invoke in dev
  // - DB UNIQUE(mentee_id, scheduled_at) + ignoreDuplicates: prevents repeat on page refresh
  useEffect(() => {
    if (!mentor || savedRef.current) return;
    savedRef.current = true;
    async function save() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.from("bookings").upsert(
        {
          mentee_id:    user.id,
          mentor_id:    mentorId,
          mentor_name:  mentor!.name,
          slot_label:   slot,
          scheduled_at: scheduledAt,
        },
        { onConflict: "mentee_id,scheduled_at", ignoreDuplicates: true }
      );
    }
    save();
  }, [mentor]); // eslint-disable-line react-hooks/exhaustive-deps

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
