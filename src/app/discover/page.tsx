"use client";

const mentors = [
  {
    name: "Ana Martínez",
    role: "Software Engineer",
    company: "Microsoft",
    bio: "Le apasiona ayudar a mujeres a iniciar una carrera en tecnología.",
  },
  {
    name: "María Gómez",
    role: "Product Manager",
    company: "Google",
    bio: "Ayuda a estudiantes a encontrar oportunidades profesionales.",
  },
  {
    name: "Valeria Torres",
    role: "UX Designer",
    company: "Nubank",
    bio: "Especialista en diseño de productos digitales y mentoría.",
  },
];

export default function DiscoverPage() {
  const mentor = mentors[0];

  return (
    <main className="min-h-screen bg-white p-6 flex items-center justify-center">
      <div className="max-w-md w-full">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Mentoras para ti 💜
        </h1>

        <div className="rounded-3xl border border-gray-200 p-6 shadow-sm">

          <div className="h-56 rounded-2xl bg-[#DACDF2] mb-6 flex items-center justify-center text-6xl">
            👩‍💻
          </div>

          <h2 className="text-2xl font-bold">
            {mentor.name}
          </h2>

          <p className="text-[#824BE5] font-semibold">
            {mentor.role}
          </p>

          <p className="text-gray-500 mb-4">
            {mentor.company}
          </p>

          <p className="text-gray-700">
            {mentor.bio}
          </p>

        </div>

        <div className="flex gap-4 mt-6">
          <button className="flex-1 rounded-2xl border py-4 font-semibold">
            Omitir
          </button>

          <button className="flex-1 rounded-2xl bg-[#824BE5] py-4 text-white font-semibold">
            Conectar 💜
          </button>
        </div>

      </div>
    </main>
  );
}