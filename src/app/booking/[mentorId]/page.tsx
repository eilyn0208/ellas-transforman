"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { mentors } from "@/constants/mentors";
import PrimaryButton from "@/components/PrimaryButton";

interface Props {
  params: Promise<{ mentorId: string }>;
}

export default function ConnectConfirmationPage({ params }: Props) {
  const { mentorId } = use(params);
  const router = useRouter();
  const mentor = mentors.find((m) => m.id === mentorId);

  if (!mentor) {
    router.replace("/discover");
    return null;
  }

  const firstName = mentor.name.split(" ")[0];

  return (
    <div className="min-h-screen bg-[#3d3d3d] flex flex-col">
      {/* Top nav */}
      <header className="flex items-center justify-between px-5 py-4 flex-shrink-0">
        <button
          onClick={() => router.back()}
          className="text-white text-xl w-8 h-8 flex items-center justify-center"
          aria-label="Volver"
        >
          ←
        </button>
        <div className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#824be5">
            <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-8 2 9-5 10-1 10-1z" />
          </svg>
          <span className="text-white font-semibold text-sm tracking-wide">
            EllasTransforman
          </span>
        </div>
        <button className="text-white text-sm opacity-80 hover:opacity-100">
          Share
        </button>
      </header>

      {/* Mentor name on dark bg */}
      <div className="px-6 pt-1 pb-5">
        <h1 className="text-white text-2xl font-bold">{mentor.name}</h1>
      </div>

      {/* White card */}
      <div className="flex-1 mx-4 mb-6 bg-white rounded-3xl px-8 pb-8 pt-2 flex flex-col items-center">
        {/* Purple checkmark badge — float above card edge */}
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
        <div className="w-24 h-24 rounded-full bg-brand-soft flex items-center justify-center text-5xl mb-5 shadow-sm">
          {mentor.avatar}
        </div>

        {/* Texts */}
        <h2 className="text-xl font-bold text-center mb-1">
          ¡Conectaste con {firstName}!
        </h2>
        <p className="text-brand text-sm text-center mb-8">
          Es momento de dar el siguiente paso
        </p>

        {/* Actions */}
        <div className="w-full space-y-3">
          <PrimaryButton
            onClick={() => router.push(`/booking/${mentorId}/schedule`)}
          >
            Agendar sesión
          </PrimaryButton>
          <button className="w-full border border-gray-200 py-3 rounded-full font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            Enviar mensaje
          </button>
          <button
            onClick={() => router.push("/discover")}
            className="w-full text-gray-400 text-sm py-2 hover:text-gray-600 transition-colors"
          >
            Seguir explorando
          </button>
        </div>
      </div>
    </div>
  );
}
