"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IoChatbubbleOutline } from "react-icons/io5";
import { supabase } from "@/lib/supabase/client";
import AppHeader from "@/components/AppHeader";
import AppLayout from "@/components/AppLayout";

interface Contact {
  id: string;
  name: string;
  role: string;
  bookingId: string;
  scheduledAt: string;
  slotLabel: string | null;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Ahora";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

export default function MessagesPage() {
  const router = useRouter();
  const [isMentor, setIsMentor] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const storedRole = localStorage.getItem("ellas_role") ?? "mentee";
      const mentor = storedRole === "mentor";
      setIsMentor(mentor);

      if (mentor) {
        const { data: bookings } = await supabase
          .from("bookings")
          .select("id, mentee_id, scheduled_at, slot_label, status")
          .eq("mentor_id", user.id)
          .neq("status", "cancelled")
          .order("scheduled_at", { ascending: false });

        const rows = bookings ?? [];
        const uniqueMenteeIds = [...new Set(rows.map((b) => b.mentee_id))].filter(Boolean) as string[];

        let nameMap = new Map<string, string>();
        if (uniqueMenteeIds.length > 0) {
          const { data: profiles } = await supabase
            .from("profiles")
            .select("id, full_name")
            .in("id", uniqueMenteeIds);
          nameMap = new Map((profiles ?? []).map((p) => [p.id, p.full_name as string]));
        }

        const seen = new Set<string>();
        const result: Contact[] = [];
        for (const b of rows) {
          if (seen.has(b.mentee_id)) continue;
          seen.add(b.mentee_id);
          result.push({
            id: b.mentee_id,
            name: nameMap.get(b.mentee_id) ?? "Mentee",
            role: "Mentee",
            bookingId: b.id,
            scheduledAt: b.scheduled_at,
            slotLabel: b.slot_label,
          });
        }
        setContacts(result);
      } else {
        const { data: bookings } = await supabase
          .from("bookings")
          .select("id, mentor_id, mentor_name, scheduled_at, slot_label, status")
          .eq("mentee_id", user.id)
          .neq("status", "cancelled")
          .order("scheduled_at", { ascending: false });

        const rows = bookings ?? [];
        const seen = new Set<string>();
        const result: Contact[] = [];
        for (const b of rows) {
          if (seen.has(b.mentor_id)) continue;
          seen.add(b.mentor_id);
          result.push({
            id: b.mentor_id,
            name: b.mentor_name ?? "Mentora",
            role: "Mentora",
            bookingId: b.id,
            scheduledAt: b.scheduled_at,
            slotLabel: b.slot_label,
          });
        }
        setContacts(result);
      }

      setLoading(false);
    }
    load();
  }, []);

  return (
    <AppLayout showNav={false}>
      <AppHeader showBack />

      <div className="px-5 pt-5 pb-2">
        <h1 className="text-lg font-bold text-gray-900">
          {isMentor ? "Mis Mentees" : "Mis Mentoras"}
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          {isMentor
            ? "Conversaciones de mentoría activas"
            : "Sesiones y preparación con tus mentoras"}
        </p>
      </div>

      <main className="flex-1 px-5 py-2 space-y-2 pb-6 overflow-y-auto">
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 rounded-full border-4 border-brand-soft border-t-brand animate-spin" />
          </div>
        )}

        {!loading && contacts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-16 h-16 rounded-full bg-brand-soft flex items-center justify-center">
              <IoChatbubbleOutline className="text-brand text-3xl" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-semibold text-gray-700">
                {isMentor ? "Aún no tienes mentees conectadas" : "Aún no tienes mentoras conectadas"}
              </p>
              <p className="text-xs text-gray-400">
                {isMentor
                  ? "Cuando una mentee agende una sesión contigo aparecerá aquí."
                  : "Agenda una sesión con una mentora para comenzar."}
              </p>
            </div>
            {!isMentor && (
              <button
                onClick={() => router.push("/discover")}
                className="px-5 py-2 bg-brand text-white text-sm font-semibold rounded-full hover:opacity-90 transition-opacity"
              >
                Explorar mentoras →
              </button>
            )}
          </div>
        )}

        {contacts.map((contact) => (
          <button
            key={contact.bookingId}
            onClick={() => router.push(`/messages/${contact.bookingId}`)}
            className="w-full bg-white rounded-2xl px-4 py-3.5 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow text-left"
          >
            <div className="w-12 h-12 rounded-full bg-brand-soft flex items-center justify-center text-2xl flex-shrink-0">
              {isMentor ? "👩‍💻" : "👩‍💼"}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <p className="font-semibold text-sm text-gray-900 truncate">{contact.name}</p>
                <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">
                  {timeAgo(contact.scheduledAt)}
                </span>
              </div>
              <p className="text-xs text-gray-400 truncate">{contact.role}</p>
              <p className="text-xs text-gray-500 truncate mt-0.5">
                {contact.slotLabel ?? "Sesión de mentoría"}
              </p>
            </div>
          </button>
        ))}
      </main>
    </AppLayout>
  );
}
