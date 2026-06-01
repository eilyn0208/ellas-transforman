"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type MentorProfile = {
  id: string;
  user_id: string;
  name: string | null;
  role: string | null;
  company: string | null;
  bio: string | null;
  expertise: string[] | null;
  mentoring_style: string | null;
  availability: string | null;
};

export default function DiscoverPage() {
  const [mentors, setMentors] = useState<MentorProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMentors = async () => {
      const { data, error } = await supabase
        .from("mentor_profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading mentors:", error);
        setIsLoading(false);
        return;
      }

      setMentors(data || []);
      setIsLoading(false);
    };

    fetchMentors();
  }, []);

  const mentor = mentors[currentIndex];

  const handleSkip = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const handleConnect = () => {
    if (!mentor) return;

    alert(`Solicitud enviada a ${mentor.name || "esta mentora"} 💜`);
    setCurrentIndex((prev) => prev + 1);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white p-6 flex items-center justify-center">
        <p className="text-gray-600">Cargando mentoras...</p>
      </main>
    );
  }

  if (!mentor) {
    return (
      <main className="min-h-screen bg-white p-6 flex items-center justify-center">
        <div className="max-w-md text-center">
          <h1 className="text-3xl font-bold mb-4 text-black">
            No hay más mentoras disponibles
          </h1>

          <p className="text-gray-600">
            Cuando nuevas mentoras completen su onboarding, aparecerán aquí.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white p-6 flex items-center justify-center">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-black">
          Mentoras para ti 💜
        </h1>

        <div className="rounded-3xl border border-gray-200 p-6 shadow-sm">
          <div className="h-56 rounded-2xl bg-[#DACDF2] mb-6 flex items-center justify-center text-6xl">
            👩‍💻
          </div>

          <h2 className="text-2xl font-bold text-black">
            {mentor.name || "Mentora"}
          </h2>

          <p className="text-[#824BE5] font-semibold">
            {mentor.role || "Mentora"}
          </p>

          <p className="text-gray-500 mb-4">
            {mentor.company || "Ellas Transforman"}
          </p>

          <p className="text-gray-700">
            {mentor.bio || "Mentora de la comunidad Ellas Transforman."}
          </p>

          {mentor.expertise && mentor.expertise.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
              {mentor.expertise.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-[#DACDF2] px-3 py-1 text-sm font-medium text-[#824BE5]"
                >
                  {item}
                </span>
              ))}
            </div>
          )}

          {(mentor.mentoring_style || mentor.availability) && (
            <div className="mt-5 space-y-2 text-sm text-gray-600">
              {mentor.mentoring_style && (
                <p>
                  <span className="font-semibold text-black">Estilo:</span>{" "}
                  {mentor.mentoring_style}
                </p>
              )}

              {mentor.availability && (
                <p>
                  <span className="font-semibold text-black">
                    Disponibilidad:
                  </span>{" "}
                  {mentor.availability}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={handleSkip}
            className="flex-1 rounded-2xl border py-4 font-semibold text-black"
          >
            Omitir
          </button>

          <button
            onClick={handleConnect}
            className="flex-1 rounded-2xl bg-[#824BE5] py-4 text-white font-semibold"
          >
            Conectar 💜
          </button>
        </div>
      </div>
    </main>
  );
}