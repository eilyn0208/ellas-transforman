"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  IoSearchOutline,
  IoPersonOutline,
  IoHomeOutline,
  IoCalendarOutline,
  IoNotificationsOutline,
  IoChatbubbleOutline,
  IoCompassOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoPlayCircleOutline,
} from "react-icons/io5";
import {
  EXPLORE_FILTER_TAGS,
  recommendedMentors,
  workshops,
  stories,
} from "@/constants/explore";

// TODO: Replace mock data with Supabase queries

export default function ExplorePage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [storyIndex, setStoryIndex] = useState(0);

  const prevStory = () =>
    setStoryIndex((i) => (i - 1 + stories.length) % stories.length);
  const nextStory = () =>
    setStoryIndex((i) => (i + 1) % stories.length);

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col max-w-md mx-auto">
      {/* Top navbar */}
      <nav className="bg-white px-6 pt-10 pb-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-1.5">
          <span className="text-brand text-xl">⚡</span>
          <span className="font-bold text-gray-900 text-lg">EllasTransforman</span>
        </div>
        <div className="flex items-center gap-2.5">
          <button className="relative w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center text-brand hover:bg-brand-light transition-colors">
            <IoNotificationsOutline className="text-xl" />
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </button>
          <button className="w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center text-brand hover:bg-brand-light transition-colors">
            <IoChatbubbleOutline className="text-xl" />
          </button>
          <div className="w-9 h-9 rounded-full bg-brand flex items-center justify-center text-white font-bold text-sm">
            TG
          </div>
        </div>
      </nav>

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto px-6 py-5 space-y-5 pb-24">
        {/* Title */}
        <h1 className="text-2xl font-bold text-brand leading-snug">
          Discover mentors,<br />workshops &amp; cohorts
        </h1>

        {/* Search bar */}
        <div className="relative">
          <IoSearchOutline
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search mentors, workshops or topics"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-full border border-gray-200 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
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

          <div className="space-y-3">
            {recommendedMentors.map((mentor) => (
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
                          {mentor.role} · {mentor.location}
                        </p>
                      </div>
                      <div className="flex items-center gap-0.5 flex-shrink-0 text-sm font-semibold text-gray-700">
                        {mentor.rating}
                        <span className="text-yellow-400 ml-0.5">★</span>
                      </div>
                    </div>
                    <p className="text-gray-500 text-xs mt-1.5 leading-relaxed line-clamp-2">
                      {mentor.bio}
                    </p>
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex gap-1.5 flex-wrap">
                        {mentor.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-brand text-xs bg-brand-light px-2.5 py-0.5 rounded-full font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => router.push(`/booking/${mentor.id}`)}
                        className="bg-brand text-white text-xs px-4 py-1.5 rounded-full font-semibold hover:bg-brand-dark transition-colors flex-shrink-0"
                      >
                        Conectar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Workshops & Events */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900 text-base">
              Workshops &amp; Events
            </h2>
            <button className="text-brand text-sm font-medium hover:underline">
              View calendar
            </button>
          </div>

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
                      Seats: {workshop.seats}
                    </span>
                    <button className="bg-brand text-white text-xs px-4 py-1.5 rounded-full font-semibold hover:bg-brand-dark transition-colors">
                      Join
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Historias Inspiradoras */}
        <section className="bg-brand-soft rounded-3xl p-5">
          <h2 className="font-bold text-gray-900 text-xl mb-4">
            Historias Inspiradoras
          </h2>
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden bg-gray-800 aspect-video flex items-center justify-center">
              <span className="text-7xl select-none">
                {stories[storyIndex].emoji}
              </span>
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <IoPlayCircleOutline size={60} className="text-white drop-shadow-lg" />
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

          <p className="mt-3 text-sm font-semibold text-gray-800 text-center">
            {stories[storyIndex].title}
          </p>
          <p className="text-xs text-gray-500 text-center mt-0.5">
            {stories[storyIndex].authorName}
          </p>

          {/* Dots indicator */}
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
        </section>
      </main>

      {/* Bottom navbar */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 px-4 py-3 flex items-center justify-around z-10">
        <button
          onClick={() => router.push("/home")}
          className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-brand transition-colors"
        >
          <IoHomeOutline className="text-xl" />
          <span className="text-[10px] font-medium">Inicio</span>
        </button>
        <button
          onClick={() => router.push("/roadmap")}
          className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-brand transition-colors"
        >
          <IoCompassOutline className="text-xl" />
          <span className="text-[10px] font-medium">Ruta</span>
        </button>
        <button className="flex flex-col items-center gap-0.5 text-brand">
          <IoSearchOutline className="text-xl" />
          <span className="text-[10px] font-medium">Explorar</span>
        </button>
        <button className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-brand transition-colors">
          <IoCalendarOutline className="text-xl" />
          <span className="text-[10px] font-medium">Calendario</span>
        </button>
        <button className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-brand transition-colors">
          <IoPersonOutline className="text-xl" />
          <span className="text-[10px] font-medium">Perfil</span>
        </button>
      </nav>
    </div>
  );
}
