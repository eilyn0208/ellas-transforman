"use client";

import { IoNotificationsOffOutline } from "react-icons/io5";
import AppHeader from "@/components/AppHeader";
import AppLayout from "@/components/AppLayout";

export default function NotificationsPage() {
  return (
    <AppLayout showNav>
      <AppHeader showBack />

      <div className="px-5 pt-5 pb-2">
        <h1 className="text-lg font-bold text-gray-900">Notificaciones</h1>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-8 pb-20 gap-4">
        <div className="w-16 h-16 rounded-full bg-brand-soft flex items-center justify-center">
          <IoNotificationsOffOutline className="text-brand text-3xl" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-semibold text-gray-700">
            Tus notificaciones estarán disponibles próximamente
          </p>
          <p className="text-xs text-gray-400 leading-relaxed">
            Aquí recibirás avisos sobre sesiones, mensajes y actualizaciones de tu ruta.
          </p>
        </div>
      </main>
    </AppLayout>
  );
}
