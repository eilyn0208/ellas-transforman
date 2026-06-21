"use client";

import { use, useState, useEffect, useRef } from "react";
import { IoCalendarOutline, IoTimeOutline } from "react-icons/io5";
import { supabase } from "@/lib/supabase/client";
import AppHeader from "@/components/AppHeader";
import AppLayout from "@/components/AppLayout";

interface Props {
  params: Promise<{ conversationId: string }>;
}

interface BookingContext {
  contactName: string;
  contactRole: string;
  scheduledAt: string;
  slotLabel: string | null;
  locationType: string | null;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
}

function timeLabel(iso: string): string {
  return new Date(iso).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" });
}

function MessageBubble({ msg, isSelf }: { msg: Message; isSelf: boolean }) {
  return (
    <div className={`flex ${isSelf ? "justify-end" : "justify-start"} px-5 mb-2`}>
      <div
        className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isSelf
            ? "bg-brand text-white rounded-br-sm"
            : "bg-white text-gray-800 shadow-sm rounded-bl-sm"
        }`}
      >
        {msg.content}
        <p className={`text-[10px] mt-1 ${isSelf ? "text-white/60 text-right" : "text-gray-400"}`}>
          {timeLabel(msg.createdAt)}
        </p>
      </div>
    </div>
  );
}

export default function ConversationPage({ params }: Props) {
  const { conversationId } = use(params);

  const [userId, setUserId] = useState<string>("");
  const [isMentor, setIsMentor] = useState(false);
  const [booking, setBooking] = useState<BookingContext | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      setUserId(user.id);

      const storedRole = localStorage.getItem("ellas_role") ?? "mentee";
      const mentor = storedRole === "mentor";
      setIsMentor(mentor);

      const { data: bk } = await supabase
        .from("bookings")
        .select("id, mentor_id, mentee_id, mentor_name, scheduled_at, slot_label, location_type, status")
        .eq("id", conversationId)
        .maybeSingle();

      if (bk) {
        if (mentor) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", bk.mentee_id)
            .maybeSingle();
          setBooking({
            contactName: profile?.full_name ?? "Mentee",
            contactRole: "Mentee",
            scheduledAt: bk.scheduled_at,
            slotLabel: bk.slot_label,
            locationType: bk.location_type,
          });
        } else {
          setBooking({
            contactName: bk.mentor_name ?? "Mentora",
            contactRole: "Mentora",
            scheduledAt: bk.scheduled_at,
            slotLabel: bk.slot_label,
            locationType: bk.location_type,
          });
        }
      }

      setLoading(false);
    }
    load();
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function sendMessage() {
    if (!draft.trim() || sending) return;
    setSending(true);
    const msg: Message = {
      id: `msg-${Date.now()}`,
      senderId: userId,
      content: draft.trim(),
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, msg]);
    setDraft("");
    setSending(false);
  }

  if (loading) {
    return (
      <AppLayout showNav={false}>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-brand-soft border-t-brand animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (!booking) {
    return (
      <AppLayout showNav={false}>
        <AppHeader showBack />
        <div className="flex-1 flex flex-col items-center justify-center px-8 gap-3 text-center">
          <p className="text-sm text-gray-500">No se encontró esta conversación.</p>
        </div>
      </AppLayout>
    );
  }

  const dt = new Date(booking.scheduledAt);
  const dateLabel = dt.toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" });
  const timeStr = dt.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: false });

  return (
    <AppLayout showNav={false}>
      <AppHeader showBack />

      <div className="flex-1 overflow-y-auto flex flex-col">
        {/* Profile card */}
        <div className="bg-white mx-5 mt-4 mb-3 rounded-2xl shadow-sm px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-brand-soft flex items-center justify-center text-2xl flex-shrink-0">
              {isMentor ? "👩‍💻" : "👩‍💼"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-gray-900">{booking.contactName}</p>
              <p className="text-xs text-gray-500">{booking.contactRole}</p>
            </div>
            <span className="text-[10px] bg-brand text-white font-semibold px-2.5 py-1 rounded-full flex-shrink-0">
              {isMentor ? "Tu mentee" : "Tu mentora"}
            </span>
          </div>
        </div>

        {/* Booking context */}
        <div className="mx-5 mb-3 bg-brand-soft rounded-2xl px-4 py-3 flex flex-col gap-1.5">
          <p className="text-[10px] font-semibold text-brand uppercase tracking-wide mb-0.5">
            Sesión agendada
          </p>
          <div className="flex items-center gap-1.5 text-xs text-gray-700">
            <IoCalendarOutline className="text-brand text-sm flex-shrink-0" />
            {dateLabel}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-700">
            <IoTimeOutline className="text-brand text-sm flex-shrink-0" />
            {timeStr} · {booking.slotLabel ?? booking.locationType ?? "Online"}
          </div>
        </div>

        {/* Messages or empty state */}
        <div className="flex-1 py-2">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-8 gap-2 text-center">
              <p className="text-sm text-gray-400">Todavía no hay mensajes en esta conversación.</p>
              <p className="text-xs text-gray-300">Envía el primero para comenzar.</p>
            </div>
          ) : (
            messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} isSelf={msg.senderId === userId} />
            ))
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input bar */}
      <div className="flex-shrink-0 w-full bg-white border-t border-gray-100 px-5 py-3 shadow-sm">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Escribe un mensaje..."
            className="flex-1 text-sm text-gray-700 placeholder-gray-300 outline-none bg-transparent"
          />
          <button
            onClick={sendMessage}
            disabled={!draft.trim() || sending}
            className="bg-brand text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-brand/90 transition-colors disabled:opacity-40 flex-shrink-0"
          >
            Enviar
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
