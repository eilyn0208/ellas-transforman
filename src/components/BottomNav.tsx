"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  IoHomeOutline,
  IoSearchOutline,
  IoCompassOutline,
  IoCalendarOutline,
  IoPersonOutline,
} from "react-icons/io5";

const NAV_ITEMS = [
  { label: "Inicio", path: "/home", Icon: IoHomeOutline },
  { label: "Explorar", path: "/explore", Icon: IoSearchOutline },
  { label: "Ruta", path: "/roadmap", Icon: IoCompassOutline },
  { label: "Sesiones", path: "/sessions", Icon: IoCalendarOutline },
  { label: "Perfil", path: "/profile", Icon: IoPersonOutline },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 px-4 pt-3 pb-safe flex items-center justify-around z-10">
      {NAV_ITEMS.map(({ label, path, Icon }) => {
        const isActive = pathname === path;
        return (
          <button
            key={path}
            onClick={() => router.push(path)}
            className={`flex flex-col items-center gap-0.5 transition-colors ${
              isActive
                ? "text-brand"
                : "text-gray-400 hover:text-brand"
            }`}
          >
            <Icon className="text-xl" />
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
