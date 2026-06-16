"use client";

import { useRouter } from "next/navigation";
import { mentors } from "@/constants/mentors";
import {
  IoSearchOutline,
  IoPersonOutline,
  IoHomeOutline,
  IoCalendarOutline,
  IoNotificationsOutline,
  IoChatbubbleOutline,
  IoCompassOutline,
} from "react-icons/io5";

export default function HomePage() {
  const router = useRouter();
  const featured = mentors.slice(0, 3);

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col max-w-md mx-auto">
      {/* Top navbar */}
      <nav className="bg-white px-6 pt-10 pb-3 flex items-center justify-between shadow-sm">
        <div>
          <p className="text-sm text-gray-400">Bienvenida de nuevo</p>
          <h1 className="text-xl font-bold text-gray-900">Ellas Transforman</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center text-brand hover:bg-brand-light transition-colors relative">
            <IoNotificationsOutline className="text-xl" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full" />
          </button>
          <button className="w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center text-brand hover:bg-brand-light transition-colors">
            <IoChatbubbleOutline className="text-xl" />
          </button>
        </div>
      </nav>

      <main className="flex-1 px-6 py-6 space-y-6">
        {/* Banner CTA */}
        <div className="bg-brand rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-white font-bold text-base mb-1">
              Encuentra tu mentora ideal
            </p>
            <p className="text-white/80 text-xs leading-relaxed">
              Conecta con mujeres referentes en tecnología
            </p>
          </div>
          <button
            onClick={() => router.push("/discover")}
            className="bg-white text-brand text-xs font-bold px-4 py-2 rounded-full flex-shrink-0 hover:bg-brand-light transition-colors"
          >
            Explorar
          </button>
        </div>

        {/* Próxima sesión */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Próxima sesión
          </h2>
          <div className="bg-white rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-brand-soft flex items-center justify-center text-2xl flex-shrink-0">
              📅
            </div>
            <div className="flex-1">
              <p className="text-gray-400 text-sm">Aún no tienes sesiones agendadas</p>
              <button
                onClick={() => router.push("/discover")}
                className="text-brand text-xs font-semibold mt-1 hover:underline"
              >
                Agendar ahora →
              </button>
            </div>
          </div>
        </section>

        {/* Mentoras destacadas */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Mentoras para ti
            </h2>
            <button
              onClick={() => router.push("/discover")}
              className="text-brand text-xs font-semibold hover:underline"
            >
              Ver todas
            </button>
          </div>

          <div className="space-y-3">
            {featured.map((mentor) => (
              <button
                key={mentor.id}
                onClick={() => router.push(`/booking/${mentor.id}`)}
                className="w-full bg-white rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow text-left"
              >
                <div className="w-12 h-12 rounded-full bg-brand-soft flex items-center justify-center text-2xl flex-shrink-0">
                  {mentor.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900 truncate">
                    {mentor.name}
                  </p>
                  <p className="text-brand text-xs">{mentor.role}</p>
                  <p className="text-gray-400 text-xs">{mentor.company}</p>
                </div>
                <div className="flex-shrink-0">
                  <div className="flex flex-wrap gap-1 justify-end">
                    {mentor.tags.slice(0, 1).map((tag) => (
                      <span
                        key={tag}
                        className="bg-brand-light text-brand text-[10px] font-medium px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom navbar */}
      <nav className="bg-white border-t border-gray-100 px-4 py-3 flex items-center justify-around">
        <button className="flex flex-col items-center gap-0.5 text-brand">
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
        <button
          onClick={() => router.push("/explore")}
          className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-brand transition-colors"
        >
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
