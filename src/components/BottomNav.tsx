"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  IoHomeOutline,
  IoSearchOutline,
  IoCompassOutline,
  IoCalendarOutline,
  IoPersonOutline,
  IoPeopleOutline,
  IoTrophyOutline,
} from "react-icons/io5";
import { supabase } from "@/lib/supabase/client";

type NavItem = {
  label: string;
  path: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const MENTEE_NAV: NavItem[] = [
  { label: "Inicio", path: "/home", Icon: IoHomeOutline },
  { label: "Explorar", path: "/explore", Icon: IoSearchOutline },
  { label: "Sesiones", path: "/sessions", Icon: IoCalendarOutline },
  { label: "Ruta", path: "/roadmap", Icon: IoCompassOutline },
  { label: "Perfil", path: "/profile", Icon: IoPersonOutline },
];

const MENTOR_NAV: NavItem[] = [
  { label: "Inicio", path: "/home", Icon: IoHomeOutline },
  { label: "Mis Mentees", path: "/mentor/mentees", Icon: IoPeopleOutline },
  { label: "Sesiones", path: "/sessions", Icon: IoCalendarOutline },
  { label: "Mi Impacto", path: "/mentor/impact", Icon: IoTrophyOutline },
  { label: "Perfil", path: "/profile", Icon: IoPersonOutline },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [navItems, setNavItems] = useState<NavItem[]>(MENTEE_NAV);
  const [isMentor, setIsMentor] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      const metaRole = user?.user_metadata?.role as string | undefined;
      const role = metaRole ?? localStorage.getItem("ellas_role");
      if (metaRole) localStorage.setItem("ellas_role", metaRole);
      const mentor = role === "mentor" || role === "mentora";
      setIsMentor(mentor);
      setNavItems(mentor ? MENTOR_NAV : MENTEE_NAV);
    }
    load();
  }, []);

  const activeColor = "text-brand";
  const hoverColor = "hover:text-brand";

  return (
    <nav className="flex-shrink-0 w-full bg-white border-t border-gray-100 px-4 pt-3 pb-safe flex items-center justify-around">
      {navItems.map(({ label, path, Icon }) => {
        const isActive =
          pathname === path ||
          (path !== "/home" && pathname.startsWith(path + "/"));
        return (
          <button
            key={path}
            onClick={() => router.push(path)}
            className={`flex flex-col items-center gap-0.5 transition-colors ${
              isActive ? activeColor : `text-gray-400 ${hoverColor}`
            }`}
          >
            <Icon className="text-xl" />
            <span className="text-[10px] font-medium leading-none">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
