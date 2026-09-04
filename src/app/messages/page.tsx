"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IoChatbubbleOutline } from "react-icons/io5";
import { supabase } from "@/lib/supabase/client";
import AppHeader from "@/components/AppHeader";
import AppLayout from "@/components/AppLayout";

interface Contact {
  conversationId: string;
  otherPartyId: string;
  name: string;
  role: string;
  timestamp: string;
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
      if (!user) { router.push("/welcome"); return; }

      const storedRole = localStorage.getItem("ellas_role") ?? "mentee";
      const mentor = storedRole === "mentor";
      setIsMentor(mentor);

      const { data: conversations } = await supabase
        .from("conversations")
        .select("id, mentor_id, mentee_id, last_message_at, created_at")
        .order("last_message_at", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false });

      const rows = conversations ?? [];
      const otherPartyIds = [
        ...new Set(rows.map((c) => (mentor ? c.mentee_id : c.mentor_id))),
      ];

      let nameMap = new Map<string, string>();
      if (otherPartyIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", otherPartyIds);
        nameMap = new Map((profiles ?? []).map((p) => [p.id, p.full_name as string]));
      }

      const result: Contact[] = rows.map((c) => {
        const otherPartyId = mentor ? c.mentee_id : c.mentor_id;
        return {
          conversationId: c.id,
          otherPartyId,
          name: nameMap.get(otherPartyId) ?? (mentor ? "Mentee" : "Mentora"),
          role: mentor ? "Mentee" : "Mentora",
          timestamp: c.last_message_at ?? c.created_at,
        };
      });

      setContacts(result);
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
            key={contact.conversationId}
            onClick={() => router.push(`/messages/${contact.conversationId}`)}
            className="w-full bg-white rounded-2xl px-4 py-3.5 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow text-left"
          >
            <div className="w-12 h-12 rounded-full bg-brand-soft flex items-center justify-center text-2xl flex-shrink-0">
              {isMentor ? "👩‍💻" : "👩‍💼"}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <p className="font-semibold text-sm text-gray-900 truncate">{contact.name}</p>
                <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">
                  {timeAgo(contact.timestamp)}
                </span>
              </div>
              <p className="text-xs text-gray-400 truncate">{contact.role}</p>
            </div>
          </button>
        ))}
      </main>
    </AppLayout>
  );
}
