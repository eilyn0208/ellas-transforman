"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/AppLayout";
import { supabase } from "@/lib/supabase/client";

interface MentorProfile {
  user_id: string;
  name: string;
  role: string | null;
  expertise: string[] | null;
  mentoring_style: string | null;
  availability: string | null;
}

function scoreMatch(interests: string[], expertise: string[] | null): number {
  if (!expertise || interests.length === 0) return 0;
  const expertiseLower = expertise.map((e) => e.toLowerCase());
  return interests.filter((i) =>
    expertiseLower.some(
      (e) => e.includes(i.toLowerCase()) || i.toLowerCase().includes(e)
    )
  ).length;
}

const SWIPE_THRESHOLD = 120;
const ROTATION_FACTOR = 0.08;

export default function DiscoverPage() {
  const router = useRouter();
  const [mentors, setMentors] = useState<MentorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(null);

  const dragStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    async function fetchMentors() {
      const { data, error } = await supabase
        .from("mentor_profiles")
        .select("user_id, name, role, expertise, mentoring_style, availability");

      if (error || !data) {
        setLoading(false);
        return;
      }

      let interests: string[] = [];
      try {
        const raw = localStorage.getItem("ellas_mentee_answers");
        if (raw) {
          const parsed = JSON.parse(raw);
          interests = Array.isArray(parsed.interests) ? parsed.interests : [];
        }
      } catch { /* sin intereses */ }

      const sorted = [...data].sort(
        (a, b) =>
          scoreMatch(interests, b.expertise) - scoreMatch(interests, a.expertise)
      );

      setMentors(sorted);
      setLoading(false);
    }

    fetchMentors();
  }, []);

  const current = mentors[index];
  const next = mentors[index + 1];

  const resetCard = () => {
    setPosition({ x: 0, y: 0 });
    setExitDirection(null);
  };

  const advance = (direction: "left" | "right", mentor: MentorProfile) => {
    if (exitDirection) return;

    setDragging(false);
    setExitDirection(direction);
    setPosition({ x: direction === "right" ? 1000 : -1000, y: position.y });

    setTimeout(() => {
      if (direction === "right") {
        localStorage.setItem("ellas_selected_mentor", JSON.stringify(mentor));
        router.push(`/booking/${mentor.user_id}`);
        return;
      }
      setIndex((i) => i + 1);
      resetCard();
    }, 300);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (exitDirection) return;
    setDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handlePointerUp = () => {
    if (!dragging) return;
    setDragging(false);

    if (position.x > SWIPE_THRESHOLD) {
      advance("right", current);
    } else if (position.x < -SWIPE_THRESHOLD) {
      advance("left", current);
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleReiniciar = () => {
    setIndex(0);
    resetCard();
  };

  const rotation = position.x * ROTATION_FACTOR;
  const likeOpacity = Math.min(Math.max(position.x / SWIPE_THRESHOLD, 0), 1);
  const nopeOpacity = Math.min(Math.max(-position.x / SWIPE_THRESHOLD, 0), 1);

  if (loading) {
    return (
      <AppLayout showNav={false} bg="bg-white">
        <main className="flex-1 px-6 py-6 flex flex-col justify-center items-center">
          <div className="w-10 h-10 rounded-full border-4 border-brand-soft border-t-brand animate-spin mb-4" />
          <p className="text-gray-500 text-sm">Buscando mentoras para ti...</p>
        </main>
      </AppLayout>
    );
  }

  return (
    <AppLayout showNav={false} bg="bg-white">
      <main className="flex-1 px-6 py-6 flex flex-col justify-center">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Mentoras para ti 💜
        </h1>

        {!current ? (
          <div className="rounded-3xl border border-gray-200 p-8 text-center">
            <div className="text-6xl mb-4">✨</div>

            <h2 className="text-2xl font-bold mb-2">
              ¡Eso es todo por ahora!
            </h2>

            <p className="text-gray-600 mb-6">
              Has explorado todas las mentoras disponibles.
            </p>

            <button
              onClick={handleReiniciar}
              className="w-full rounded-2xl bg-brand py-4 text-white font-semibold hover:opacity-90"
            >
              Volver a empezar
            </button>
          </div>
        ) : (
          <>
            <div className="relative h-[480px]">
              {/* Carta siguiente (debajo) */}
              {next && (
                <div className="absolute inset-0 rounded-3xl border border-gray-200 bg-white shadow-sm scale-95 translate-y-3 transition-transform duration-300">
                  <MentorCardContent mentor={next} />
                </div>
              )}

              {/* Carta actual (arriba, deslizable) */}
              <div
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
                  transition: dragging ? "none" : "transform 0.3s ease",
                  touchAction: "none",
                }}
                className="absolute inset-0 cursor-grab active:cursor-grabbing rounded-3xl border border-gray-200 bg-white shadow-md select-none"
              >
                {/* Sello CONECTAR */}
                <div
                  style={{ opacity: likeOpacity }}
                  className="pointer-events-none absolute top-6 left-6 z-10 -rotate-12 rounded-xl border-4 border-brand px-3 py-1 text-2xl font-extrabold text-brand"
                >
                  CONECTAR
                </div>

                {/* Sello OMITIR */}
                <div
                  style={{ opacity: nopeOpacity }}
                  className="pointer-events-none absolute top-6 right-6 z-10 rotate-12 rounded-xl border-4 border-gray-400 px-3 py-1 text-2xl font-extrabold text-gray-400"
                >
                  OMITIR
                </div>

                <MentorCardContent mentor={current} />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => advance("left", current)}
                className="flex-1 rounded-2xl border py-4 font-semibold hover:bg-gray-50"
              >
                Omitir
              </button>

              <button
                onClick={() => advance("right", current)}
                className="flex-1 rounded-2xl bg-brand py-4 text-white font-semibold hover:opacity-90"
              >
                Conectar 💜
              </button>
            </div>

            <p className="mt-4 text-center text-sm text-gray-400">
              Desliza la carta a la izquierda para omitir o a la derecha para conectar
            </p>
          </>
        )}
      </main>
    </AppLayout>
  );
}

function MentorCardContent({ mentor }: { mentor: MentorProfile }) {
  const initial = mentor.name?.charAt(0).toUpperCase() ?? "M";
  return (
    <div className="flex h-full flex-col p-6">
      <div className="h-56 rounded-2xl bg-brand-soft mb-6 flex items-center justify-center text-6xl font-bold text-brand">
        {initial}
      </div>

      <h2 className="text-2xl font-bold">{mentor.name}</h2>

      <p className="text-brand font-semibold">{mentor.role ?? "Mentora"}</p>

      <p className="text-gray-500 mb-1">{mentor.mentoring_style ?? ""}</p>

      <p className="text-gray-700 mb-4 text-sm">
        {mentor.availability ? `Disponibilidad: ${mentor.availability}` : ""}
      </p>

      <div className="flex flex-wrap gap-2 mt-auto">
        {(mentor.expertise ?? []).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
