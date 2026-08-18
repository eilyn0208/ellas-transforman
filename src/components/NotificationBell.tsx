"use client";

import { useRouter } from "next/navigation";
import { IoNotificationsOutline } from "react-icons/io5";

interface NotificationBellProps {
  count?: number;
}

export default function NotificationBell({ count }: NotificationBellProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/notifications")}
      className="w-9 h-9 rounded-full bg-brand-soft flex items-center justify-center text-brand hover:bg-brand-light transition-colors relative"
      aria-label="Notificaciones"
    >
      <IoNotificationsOutline className="text-lg" />
      {!!count && count > 0 && (
        <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  );
}
