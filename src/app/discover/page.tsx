"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { type Mentor, mentors } from "@/constants/mentors";

const SWIPE_THRESHOLD = 120;
const ROTATION_FACTOR = 0.08;

export default function DiscoverPage() {
  const router = useRouter();
  const [index, setIndex] = useState(0);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(null);

  const dragStart = useRef({ x: 0, y: 0 });

  const current = mentors[index];
  const next = mentors[index + 1];

  const resetCard = () => {
    setPosition({ x: 0, y: 0 });
    setExitDirection(null);
  };

  const advance = (direction: "left" | "right", mentor: Mentor) => {
    if (exitDirection) return;

    setDragging(false);
    setExitDirection(direction);
    setPosition({ x: direction === "right" ? 1000 : -1000, y: position.y });

    setTimeout(() => {
      if (direction === "right") {
        router.push(`/booking/${mentor.id}`);
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

  return (
    <main className="min-h-screen bg-white p-6 flex items-center justify-center">
      <div className="max-w-md w-full">
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
              className="w-full rounded-2xl bg-[#824BE5] py-4 text-white font-semibold hover:opacity-90"
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
                  className="pointer-events-none absolute top-6 left-6 z-10 -rotate-12 rounded-xl border-4 border-[#824BE5] px-3 py-1 text-2xl font-extrabold text-[#824BE5]"
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
                className="flex-1 rounded-2xl bg-[#824BE5] py-4 text-white font-semibold hover:opacity-90"
              >
                Conectar 💜
              </button>
            </div>

            <p className="mt-4 text-center text-sm text-[#909090]">
              Desliza la carta a la izquierda para omitir o a la derecha para conectar
            </p>
          </>
        )}
      </div>
    </main>
  );
}

function MentorCardContent({ mentor }: { mentor: Mentor }) {
  return (
    <div className="flex h-full flex-col p-6">
      <div className="h-56 rounded-2xl bg-[#DACDF2] mb-6 flex items-center justify-center text-6xl">
        {mentor.avatar}
      </div>

      <h2 className="text-2xl font-bold">{mentor.name}</h2>

      <p className="text-[#824BE5] font-semibold">{mentor.role}</p>

      <p className="text-gray-500 mb-4">{mentor.company}</p>

      <p className="text-gray-700 mb-4">{mentor.bio}</p>

      <div className="flex flex-wrap gap-2 mt-auto">
        {mentor.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-black"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
