"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  IoNotificationsOutline,
  IoChatbubbleOutline,
} from "react-icons/io5";
import type { Conversation } from "@/types/messages";
import AppHeader from "@/components/AppHeader";
import AppLayout from "@/components/AppLayout";

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
  const [role, setRole] = useState<string>("mentee");
  const [userId, setUserId] = useState<string>("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedRole = localStorage.getItem("ellas_role") ?? "mentee";
    const uid = storedRole === "mentor" ? "demo-mentor" : "demo-mentee";
    setRole(storedRole);
    setUserId(uid);

    // Register user with server (update onboarding answers if available)
    let answers: Record<string, unknown> = {};
    try {
      const key = storedRole === "mentor" ? "ellas_mentor_answers" : "ellas_mentee_answers";
      answers = JSON.parse(localStorage.getItem(key) ?? "{}");
    } catch { /* ignore */ }

    fetch("/api/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: uid, role: storedRole, onboardingAnswers: answers }),
    }).catch(console.error);
  }, []);

  const fetchConversations = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/conversations?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations ?? []);
      }
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    fetchConversations();
    const interval = setInterval(fetchConversations, 3000);
    return () => clearInterval(interval);
  }, [userId, fetchConversations]);

  const isMentor = role === "mentor";

  const rightSlot = (
    <>
      <button className="relative w-9 h-9 rounded-full bg-brand-soft flex items-center justify-center text-brand hover:bg-brand-light transition-colors">
        <IoNotificationsOutline className="text-lg" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full" />
      </button>
      <button className="w-9 h-9 rounded-full bg-brand flex items-center justify-center text-white">
        <IoChatbubbleOutline className="text-lg" />
      </button>
    </>
  );

  return (
    <AppLayout showNav={false}>
      <AppHeader showBack rightSlot={rightSlot} />

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

      <main className="flex-1 px-5 py-2 space-y-2 pb-6">
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 rounded-full border-4 border-brand-soft border-t-brand animate-spin" />
          </div>
        )}

        {!loading && conversations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <span className="text-4xl">💬</span>
            <p className="text-gray-400 text-sm text-center">
              {isMentor
                ? "Aún no tienes mentees conectadas"
                : "Conecta con una mentora para comenzar"}
            </p>
            <button
              onClick={() => router.push("/discover")}
              className="text-brand text-sm font-semibold hover:underline"
            >
              Explorar mentoras →
            </button>
          </div>
        )}

        {conversations.map((conv) => {
          const otherName = isMentor ? conv.menteeName : conv.mentorName;
          const otherAvatar = isMentor ? conv.menteeAvatar : conv.mentorAvatar;
          const otherRole = isMentor ? conv.menteeRole : conv.mentorRole;

          return (
            <button
              key={conv.id}
              onClick={() => router.push(`/messages/${conv.id}`)}
              className="w-full bg-white rounded-2xl px-4 py-3.5 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow text-left"
            >
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-brand-soft flex items-center justify-center text-2xl">
                  {otherAvatar}
                </div>
                {conv.status === "active" && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="font-semibold text-sm text-gray-900 truncate">
                    {otherName}
                  </p>
                  <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">
                    {timeAgo(conv.lastMessageAt)}
                  </span>
                </div>
                <p className="text-xs text-gray-400 truncate">{otherRole}</p>
                <p className="text-xs text-gray-500 truncate mt-0.5">
                  {conv.lastMessage}
                </p>
              </div>

              {conv.unreadCount > 0 && (
                <div className="w-5 h-5 rounded-full bg-brand flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[10px] font-bold">
                    {conv.unreadCount}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </main>
    </AppLayout>
  );
}
