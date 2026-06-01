"use client";

import { useRouter } from "next/navigation";

const discussionTopics = [
  "How did you choose your career path?",
  "First internship experiences",
  "Women in Tech challenges",
];

const anonymousQuestions = [
  "I'm scared to switch careers. Where do I start?",
  "How do I prepare for my first interview?",
];

const featuredMentors = [
  {
    name: "Ana Martínez",
    role: "Software Engineer",
    company: "Microsoft",
    match: 92,
    emoji: "👩‍💻",
  },
  {
    name: "María Gómez",
    role: "Product Manager",
    company: "Google",
    match: 88,
    emoji: "👩‍💼",
  },
  {
    name: "Valeria Torres",
    role: "UX Designer",
    company: "Nubank",
    match: 84,
    emoji: "🎨",
  },
];

export default function ExplorePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white px-6 py-8">
      <div className="mx-auto max-w-md">
        <div className="mb-8">
          <p className="text-sm font-semibold text-[#824BE5]">Explore</p>
          <h1 className="text-3xl font-bold text-black">
            Tu comunidad para crecer 💜
          </h1>
          <p className="mt-2 text-gray-600">
            Encuentra inspiración, conversaciones y mentoras compatibles contigo.
          </p>
        </div>

        <section className="mb-8">
          <div className="mb-4 rounded-3xl bg-[#DACDF2] p-6">
            <p className="mb-2 text-sm font-semibold text-[#824BE5]">
              Today · Inspiration
            </p>
            <h2 className="text-2xl font-bold text-black">
              No tienes que tener todo resuelto para empezar.
            </h2>
            <p className="mt-3 text-gray-700">
              Explorar, preguntar y pedir apoyo también es parte del camino.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-black">
              Discussion Topics
            </h2>
            <button className="text-sm font-semibold text-[#824BE5]">
              See all
            </button>
          </div>

          <div className="space-y-3">
            {discussionTopics.map((topic) => (
              <div
                key={topic}
                className="rounded-2xl border border-gray-200 p-4"
              >
                <p className="font-semibold text-black">{topic}</p>
                <p className="mt-1 text-sm text-gray-500">
                  Join the conversation
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-black">
              Recommended Mentors
            </h2>
            <button
              onClick={() => router.push("/discover")}
              className="text-sm font-semibold text-[#824BE5]"
            >
              Discover
            </button>
          </div>

          <div className="space-y-4">
            {featuredMentors.map((mentor) => (
              <div
                key={mentor.name}
                className="rounded-3xl border border-gray-200 p-5 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#DACDF2] text-3xl">
                    {mentor.emoji}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-black">{mentor.name}</h3>
                    <p className="text-sm text-gray-600">
                      {mentor.role} · {mentor.company}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#824BE5]">
                      {mentor.match}% match
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => router.push("/discover")}
                  className="mt-4 w-full rounded-2xl bg-[#824BE5] py-3 font-semibold text-white"
                >
                  Ver mentoras
                </button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-black">
              Anonymous Questions
            </h2>
            <button className="text-sm font-semibold text-[#824BE5]">
              Ask
            </button>
          </div>

          <div className="space-y-3">
            {anonymousQuestions.map((question) => (
              <div
                key={question}
                className="rounded-2xl bg-gray-50 p-4"
              >
                <p className="text-gray-800">“{question}”</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}