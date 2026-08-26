"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PrimaryButton from "@/components/PrimaryButton";
import AppLayout from "@/components/AppLayout";
import AppHeader from "@/components/AppHeader";
import { getMentorProfile, type MentorProfileSummary } from "@/lib/mentors";

interface Props {
  params: Promise<{ mentorId: string }>;
}

export default function ConnectConfirmationPage({ params }: Props) {
  const { mentorId } = use(params);
  const router = useRouter();
  const [mentor, setMentor] = useState<MentorProfileSummary | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getMentorProfile(mentorId).then((data) => {
      setMentor(data);
      setReady(true);
    });
  }, [mentorId]);

  if (!ready) return null;
  if (!mentor) { router.replace("/discover"); return null; }

  const firstName = mentor.name.split(" ")[0];

  return (
    <AppLayout showNav={false}>
      <AppHeader showBack title={mentor.name} />

      {/* White card */}
      <div className="flex-1 overflow-y-auto mt-5 mb-5 bg-white rounded-3xl shadow-sm px-5 pb-8 pt-2 flex flex-col items-center">
        {/* Purple checkmark badge */}
        <div className="w-14 h-14 rounded-full bg-brand flex items-center justify-center -mt-7 shadow-lg mb-5 z-10">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        {/* Mentor avatar */}
        <div className="w-24 h-24 rounded-full bg-brand-soft flex items-center justify-center text-5xl font-bold text-brand mb-5 shadow-sm">
          {mentor.name.charAt(0).toUpperCase()}
        </div>

        {/* Texts */}
        <h2 className="text-xl font-bold text-center mb-1">
          ¡Conectaste con {firstName}!
        </h2>
        <p className="text-brand text-sm text-center mb-8">
          Es momento de dar el siguiente paso
        </p>

        {/* Actions */}
        <div className="w-full space-y-3 mt-auto">
          <PrimaryButton
            onClick={() => router.push(`/booking/${mentorId}/schedule`)}
          >
            Agendar sesión
          </PrimaryButton>
          <button
            onClick={() => router.push("/discover")}
            className="w-full text-gray-400 text-sm py-2 hover:text-gray-600 transition-colors"
          >
            Seguir explorando
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
