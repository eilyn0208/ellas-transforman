"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Role = "mentee" | "mentora";

interface RoleOption {
  id: Role;
  title: string;
  description: string;
  icon: JSX.Element;
}

const roles: RoleOption[] = [
  {
    id: "mentee",
    title: "Mentee",
    description: "Aprende de mentoras con experiencia",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 3L2 8l10 5 10-5-10-5z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M6 10.5V15c0 1.5 3 3 6 3s6-1.5 6-3v-4.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M22 8v6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "mentora",
    title: "Mentora",
    description: "Comparte tu experiencia y guía a otras",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 5h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H8l-4 3V7a2 2 0 0 1 2-2z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M8 10h6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export default function RoleSelectionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // lee ?nombre=... de la URL; si no viene, usa fallback
  const nombre = searchParams.get("nombre") ?? "[tu nombre]";

  const handleContinue = () => {
    if (!selectedRole) return;
    // navega al onboarding del rol, llevando el nombre adelante
    const params = new URLSearchParams({ nombre });
    if (selectedRole === "mentee") {
      router.push(`/onboarding?${params.toString()}`);
      return;
    }

    if (selectedRole === "mentora") {
      router.push(`/onboarding/mentor?${params.toString()}`);
      return;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-5 text-gray-900 font-sans">
      <div className="w-full max-w-[380px] bg-white rounded-[32px] px-7 pt-12 pb-8 min-h-[720px] flex flex-col shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
        <h1 className="text-3xl font-bold leading-tight mb-3.5">
          Hola {nombre},
        </h1>
        <p className="text-lg leading-snug mb-9">
          cuéntanos quién eres y cómo te gustaría participar.
        </p>

        <div className="border border-gray-200 rounded-[20px] px-[18px] py-5 bg-white">
          <p className="text-[13px] text-gray-500 mb-[18px]">
            Selecciona tu rol principal
          </p>

          {roles.map((role, index) => {
            const isSelected = selectedRole === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRole(role.id)}
                aria-pressed={isSelected}
                className={[
                  "w-full flex items-center gap-3.5 px-2.5 py-3 rounded-2xl text-left transition-all duration-150 border-2 active:scale-[0.99]",
                  index > 0 ? "mt-2" : "",
                  isSelected
                    ? "bg-brand-light border-brand"
                    : "bg-transparent border-transparent hover:bg-brand-bg",
                ].join(" ")}
              >
                <span
                  className={[
                    "w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors duration-150",
                    isSelected
                      ? "bg-brand text-white"
                      : "bg-brand-soft text-brand",
                  ].join(" ")}
                >
                  {role.icon}
                </span>

                <span className="flex-1 flex flex-col">
                  <span className="text-[17px] font-bold text-gray-900 mb-0.5">
                    {role.title}
                  </span>
                  <span className="text-sm text-gray-600 leading-snug">
                    {role.description}
                  </span>
                </span>

                <span
                  aria-hidden="true"
                  className={[
                    "w-[22px] h-[22px] rounded-full border-2 shrink-0 flex items-center justify-center transition-all duration-150",
                    isSelected
                      ? "bg-brand border-brand"
                      : "bg-transparent border-gray-300",
                  ].join(" ")}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={isSelected ? "opacity-100" : "opacity-0"}
                  >
                    <path
                      d="M2.5 6.5L5 9l4.5-5"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex-1" />

        <button
          type="button"
          onClick={handleContinue}
          disabled={!selectedRole}
          className="w-full py-[18px] rounded-[32px] bg-brand text-white text-[17px] font-bold mt-8 transition-all duration-150 hover:bg-brand-dark disabled:opacity-45 disabled:cursor-not-allowed disabled:hover:bg-brand"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
