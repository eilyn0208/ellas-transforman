"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  IoSearchOutline,
  IoNotificationsOutline,
  IoChatbubbleOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoPlayCircleOutline,
} from "react-icons/io5";
import {
  EXPLORE_FILTER_TAGS,
  workshops,
  stories,
} from "@/constants/explore";
import type { RecommendedMentor } from "@/types/explore";
import AppHeader from "@/components/AppHeader";
import AppLayout from "@/components/AppLayout";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabase/client";

export default function ExplorePage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [storyIndex, setStoryIndex] = useState(0);
  const [mentors, setMentors] = useState<RecommendedMentor[]>([]);

  useEffect(() => {
    async function checkRole() {
      const { data: { user } } = await supabase.auth.getUser();
      const role = user?.user_metadata?.role ?? localStorage.getItem("ellas_role");
      if (role === "mentor" || role === "mentora") {
        router.replace("/mentor/mentees");
      }
    }
    checkRole();
  }, [router]);

  useEffect(() => {
    async function fetchMentors() {
      const { data } = await supabase
        .from("mentor_profiles")
        .select("user_id, name, role, expertise, mentoring_style, availability")
        .limit(10);
      const avatars = ["👩‍💼", "👩‍🔬", "👩‍🏫", "👩‍🎨", "👩‍💻"];
      setMentors(
        (data ?? [])
          .filter((m, i, arr) => arr.findIndex((x) => x.user_id === m.user_id) === i)
          .map((m, i) => ({
          id: m.user_id as string,
          name: (m.name as string) ?? "Mentora",
          role: (m.role as string | null) ?? "Mentora",
          location: (m.availability as string | null) ?? "Remoto",
          bio: (m.mentoring_style as string | null) ?? "",
          avatar: avatars[i % avatars.length],
          rating: 0,
          tags: Array.isArray(m.expertise) ? (m.expertise as string[]).slice(0, 2) : [],
        }))
      );
    }
    fetchMentors();
  }, []);

  const prevStory = () =>
    setStoryIndex((i) => (i - 1 + stories.length) % stories.length);
  const nextStory = () =>
    setStoryIndex((i) => (i + 1) % stories.length);

  const rightSlot = (
    <>
      <button className="relative w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center text-brand hover:bg-brand-light transition-colors">
        <IoNotificationsOutline className="text-xl" />
        <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
          3
        </span>
      </button>
      <button
        onClick={() => router.push("/messages")}
        className="w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center text-brand hover:bg-brand-light transition-colors"
      >
        <IoChatbubbleOutline className="text-xl" />
      </button>
    </>
  );

  return (
    <AppLayout>
      <AppHeader rightSlot={rightSlot} />

      <main className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
        <h1 className="text-2xl font-bold text-brand leading-snug">
          Descubre mentoras,<br />workshops &amp; eventos
        </h1>

        {/* Search bar */}
        <div className="relative">
          <IoSearchOutline
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Busca mentoras, workshops o temas"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-full border border-gray-200 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {EXPLORE_FILTER_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveFilter(activeFilter === tag ? null : tag)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                activeFilter === tag
                  ? "bg-brand text-white border-brand"
                  : "bg-white text-brand border-brand/30 hover:bg-brand-light"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Mentoras recomendadas */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900 text-base">
              Mentoras recomendadas
            </h2>
            <button
              onClick={() => router.push("/discover")}
              className="text-brand text-sm font-medium hover:underline"
            >
              Ver todas
            </button>
          </div>

          {mentors.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <p className="text-2xl mb-2">🌟</p>
              <p className="text-sm font-semibold text-gray-700">Próximamente podrás descubrir mentoras recomendadas</p>
              <p className="text-xs text-gray-400 mt-1">Estamos seleccionando las mejores para ti</p>
            </div>
          ) : (
            <div className="space-y-3">
              {mentors.map((mentor) => (
                <div key={mentor.id} className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="flex gap-3">
                    <div className="w-16 h-16 rounded-xl bg-brand-soft flex items-center justify-center text-2xl flex-shrink-0">
                      {mentor.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 text-sm leading-tight">
                            {mentor.name}
                          </p>
                          <p className="text-gray-500 text-xs mt-0.5">
                            {[mentor.role, mentor.location].filter(Boolean).join(" · ")}
                          </p>
                        </div>
                        {mentor.rating > 0 && (
                          <div className="flex items-center gap-0.5 flex-shrink-0 text-sm font-semibold text-gray-700">
                            {mentor.rating}
                            <span className="text-yellow-400 ml-0.5">★</span>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-500 text-xs mt-1.5 leading-relaxed line-clamp-2">
                        {mentor.bio}
                      </p>
                      <div className="flex items-center justify-between mt-2.5">
                        <div className="flex gap-1.5 flex-wrap">
                          {mentor.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag}>{tag}</Badge>
                          ))}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => router.push(`/booking/${mentor.id}`)}
                        >
                          Conectar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Workshops & Events */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900 text-base">
              Workshops &amp; Eventos
            </h2>
            <button className="text-brand text-sm font-medium hover:underline">
              Ver calendario
            </button>
          </div>

          {workshops.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <p className="text-2xl mb-2">📅</p>
              <p className="text-sm font-semibold text-gray-700">Eventos increíbles próximamente</p>
              <p className="text-xs text-gray-400 mt-1">Estamos preparando nuevos workshops para ti</p>
            </div>
          ) : (
            <div className="space-y-3">
              {workshops.map((workshop) => (
                <div
                  key={workshop.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm flex"
                >
                  <div className="w-24 h-24 bg-brand-soft flex-shrink-0 flex items-center justify-center text-4xl">
                    {workshop.emoji}
                  </div>
                  <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                    <div>
                      <p className="font-bold text-gray-900 text-sm leading-tight">
                        {workshop.title}
                      </p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        {workshop.presenter} · {workshop.date} · {workshop.time}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-gray-500 text-xs">
                        Cupos: {workshop.seats}
                      </span>
                      <Button size="sm">Unirme</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Historias Inspiradoras */}
        <section className="bg-brand-soft rounded-3xl p-5">
          <h2 className="font-bold text-gray-900 text-xl mb-4">
            Historias Inspiradoras
          </h2>
          {stories.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-2xl mb-2">🎬</p>
              <p className="text-sm font-semibold text-gray-700">Muy pronto encontrarás historias inspiradoras aquí</p>
              <p className="text-xs text-gray-400 mt-1.5">Mujeres que transformaron su carrera</p>
            </div>
          ) : (
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden bg-gray-800 aspect-video flex items-center justify-center">
                <span className="text-7xl select-none">
                  {stories[storyIndex].emoji}
                </span>
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <IoPlayCircleOutline
                    size={60}
                    className="text-white drop-shadow-lg"
                  />
                </div>
              </div>

              <button
                onClick={prevStory}
                aria-label="Historia anterior"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-brand text-white rounded-full flex items-center justify-center shadow-md hover:bg-brand-dark transition-colors"
              >
                <IoChevronBackOutline size={16} />
              </button>
              <button
                onClick={nextStory}
                aria-label="Historia siguiente"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-brand text-white rounded-full flex items-center justify-center shadow-md hover:bg-brand-dark transition-colors"
              >
                <IoChevronForwardOutline size={16} />
              </button>
            </div>
          )}

          {stories.length > 0 && (
            <>
              <p className="mt-3 text-sm font-semibold text-gray-800 text-center">
                {stories[storyIndex].title}
              </p>
              <p className="text-xs text-gray-500 text-center mt-0.5">
                {stories[storyIndex].authorName}
              </p>
              <div className="flex justify-center gap-1.5 mt-3">
                {stories.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setStoryIndex(i)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === storyIndex ? "bg-brand" : "bg-brand/30"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      </main>
    </AppLayout>
  );
}
