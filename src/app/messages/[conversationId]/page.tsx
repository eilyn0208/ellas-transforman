"use client";

import { use, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  IoChevronBackOutline,
  IoNotificationsOutline,
  IoMoonOutline,
  IoAttachOutline,
  IoHappyOutline,
  IoSparklesOutline,
  IoChevronDownOutline,
  IoChevronUpOutline,
} from "react-icons/io5";
import {
  mockConversations,
  mockMessages,
  QUICK_RESPONSES,
  CANNED_REPLIES,
} from "@/constants/messages";
import type { Conversation, Message, MenteeSummary } from "@/types/messages";

interface Props {
  params: Promise<{ conversationId: string }>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeLabel(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" });
}

function formatTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Ahora";
  if (mins < 60) return `Hace ${mins}m`;
  return timeLabel(iso);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MenteeSummaryCard({ summary }: { summary: MenteeSummary }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="mx-4 mb-3 bg-white rounded-2xl shadow-sm overflow-hidden border border-brand/20">
      <button
        onClick={() => setCollapsed((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <IoSparklesOutline className="text-brand text-base flex-shrink-0" />
          <span className="text-sm font-semibold text-gray-800">Resumen IA</span>
          {!summary.isAiGenerated && (
            <span className="text-[9px] bg-brand-soft text-brand font-medium px-1.5 py-0.5 rounded-full">
              MOCK
            </span>
          )}
        </div>
        {collapsed ? (
          <IoChevronDownOutline className="text-gray-400 text-sm" />
        ) : (
          <IoChevronUpOutline className="text-gray-400 text-sm" />
        )}
      </button>

      {!collapsed && (
        <div className="px-4 pb-4 space-y-2.5">
          <Row label="Objetivo" value={summary.professionalGoal} />
          <Row label="Ruta actual" value={summary.currentRoadmapTitle} />
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
              Progreso
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-brand-soft rounded-full">
                <div
                  className="h-1.5 bg-brand rounded-full transition-all"
                  style={{ width: `${summary.progressPercent}%` }}
                />
              </div>
              <span className="text-xs font-bold text-brand">
                {summary.progressPercent}%
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{summary.progressNote}</p>
          </div>
          <Row label="Próxima sesión" value={summary.nextSessionFocus} accent />
          <Row label="Disponible" value={summary.availableHours} />
          {summary.activeProgramLabels.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
                Programas activos
              </p>
              <div className="flex flex-wrap gap-1">
                {summary.activeProgramLabels.map((p) => (
                  <span
                    key={p}
                    className="bg-brand-soft text-brand text-[10px] font-medium px-2 py-0.5 rounded-full"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">
        {label}
      </p>
      <p className={`text-xs ${accent ? "text-brand font-medium" : "text-gray-700"}`}>
        {value}
      </p>
    </div>
  );
}

function SystemMessage({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 px-4 my-3">
      <div className="flex-1 h-px bg-gray-200" />
      <p className="text-[10px] text-gray-400 text-center whitespace-nowrap px-1">
        {text}
      </p>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}

function MessageBubble({
  msg,
  isSelf,
}: {
  msg: Message;
  isSelf: boolean;
}) {
  return (
    <div className={`flex ${isSelf ? "justify-end" : "justify-start"} px-4 mb-2`}>
      <div
        className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isSelf
            ? "bg-brand text-white rounded-br-sm"
            : "bg-white text-gray-800 shadow-sm rounded-bl-sm"
        }`}
      >
        {msg.content}
        <p
          className={`text-[10px] mt-1 ${
            isSelf ? "text-white/60 text-right" : "text-gray-400"
          }`}
        >
          {timeLabel(msg.createdAt)}
        </p>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ConversationPage({ params }: Props) {
  const { conversationId } = use(params);
  const router = useRouter();

  const [role, setRole] = useState<string>("mentee");
  const [conv, setConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("ellas_role") ?? "mentee";
    setRole(stored);

    // TODO: Replace with Supabase query + realtime subscription
    // const { data } = await supabase
    //   .from('conversations').select('*').eq('id', conversationId).single()
    // const channel = supabase.channel(`conv:${conversationId}`)
    //   .on('postgres_changes', { event: 'INSERT', table: 'messages', filter: `conversation_id=eq.${conversationId}` }, handler)
    //   .subscribe()
    const found = mockConversations.find((c) => c.id === conversationId);
    setConv(found ?? null);
    setMessages(mockMessages[conversationId] ?? []);
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isMentor = role === "mentor";
  const currentUserId = isMentor ? conv?.mentorId : conv?.menteeId;

  function sendMessage(text: string) {
    if (!text.trim() || !conv) return;
    const msg: Message = {
      id: `msg-${Date.now()}`,
      conversationId: conv.id,
      senderId: currentUserId ?? "local",
      senderRole: isMentor ? "mentor" : "mentee",
      senderName: isMentor ? conv.mentorName : conv.menteeName,
      content: text.trim(),
      type: "text",
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    // TODO: Insert into Supabase
    // await supabase.from('messages').insert(msg)
    setMessages((prev) => [...prev, msg]);
    setDraft("");
  }

  if (!conv) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center max-w-md mx-auto">
        <p className="text-gray-400 text-sm">Conversación no encontrada</p>
      </div>
    );
  }

  const otherName = isMentor ? conv.menteeName : conv.mentorName;
  const otherAvatar = isMentor ? conv.menteeAvatar : conv.mentorAvatar;
  const otherRole = isMentor ? conv.menteeRole : conv.mentorRole;
  const otherLocation = conv.menteeLocation;

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col max-w-md mx-auto">
      {/* ── Header ── */}
      <nav className="bg-white px-5 pt-10 pb-3 flex items-center justify-between shadow-sm flex-shrink-0">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-brand transition-colors"
          aria-label="Volver"
        >
          <IoChevronBackOutline className="text-xl" />
        </button>

        <div className="flex items-center gap-1.5">
          <span className="text-brand text-lg">⚡</span>
          <span className="font-bold text-gray-900 text-base">EllasTransforman</span>
        </div>

        <div className="flex items-center gap-2">
          <button className="relative w-9 h-9 rounded-full bg-brand-soft flex items-center justify-center text-brand hover:bg-brand-light transition-colors">
            <IoNotificationsOutline className="text-lg" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full" />
          </button>
          <button className="w-9 h-9 rounded-full bg-brand-soft flex items-center justify-center text-brand hover:bg-brand-light transition-colors">
            <IoMoonOutline className="text-lg" />
          </button>
        </div>
      </nav>

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Mentee / Mentor profile card */}
        <div className="bg-white mx-4 mt-4 mb-3 rounded-2xl shadow-sm px-4 py-4">
          <div className="flex items-start gap-3">
            <div className="w-14 h-14 rounded-full bg-brand-soft flex items-center justify-center text-3xl flex-shrink-0">
              {otherAvatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-sm text-gray-900">{otherName}</p>
                  <p className="text-xs text-gray-500">
                    {otherRole} · {otherLocation}
                  </p>
                </div>
                <span className="text-[10px] text-gray-400 flex-shrink-0 mt-0.5">
                  {formatTime(conv.lastMessageAt)}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-2.5">
                <span className="bg-brand text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                  New match
                </span>
                <span className="bg-gray-100 text-gray-600 text-[10px] font-medium px-2.5 py-1 rounded-full">
                  Goal: {conv.menteeGoal}
                </span>
                <span className="bg-gray-100 text-gray-600 text-[10px] font-medium px-2.5 py-1 rounded-full">
                  Available: {conv.menteeAvailability}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Summary (mentor-only) */}
        {isMentor && conv.menteeSummary && (
          <MenteeSummaryCard summary={conv.menteeSummary} />
        )}

        {/* Messages */}
        <div className="py-2">
          {messages.map((msg) => {
            if (msg.type === "ai-summary") return null; // rendered as card above
            if (msg.type === "system") {
              return <SystemMessage key={msg.id} text={msg.content} />;
            }
            const isSelf = msg.senderId === currentUserId;
            return <MessageBubble key={msg.id} msg={msg} isSelf={isSelf} />;
          })}
          <div ref={bottomRef} />
        </div>

        {/* Match context bar */}
        <div className="flex items-center justify-between px-5 py-2.5 mx-4 mb-3 bg-white rounded-xl shadow-sm">
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-brand flex items-center justify-center flex-shrink-0">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <p className="text-[10px] text-gray-500">
              {conv.matchLabel}: {conv.matchContext}
            </p>
          </div>
          <p className="text-[10px] text-gray-400 flex-shrink-0 ml-2">
            Message #{conv.messageNumber}
          </p>
        </div>

        {/* ── Mentor tools ── */}
        {isMentor && (
          <>
            {/* Quick responses */}
            <div className="mx-4 mb-3 bg-white rounded-2xl shadow-sm px-4 py-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-800">Quick responses</p>
                <p className="text-[10px] text-gray-400">Tap to send</p>
              </div>

              <div className="space-y-2">
                {/* Row 1: full-width primary */}
                <button
                  onClick={() => sendMessage(QUICK_RESPONSES[0].label)}
                  className="w-full bg-brand text-white text-xs font-semibold py-2.5 rounded-full hover:bg-brand/90 transition-colors"
                >
                  {QUICK_RESPONSES[0].label}
                </button>
                {/* Row 2: two columns */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => sendMessage(QUICK_RESPONSES[1].label)}
                    className="border border-gray-200 text-gray-700 text-xs font-semibold py-2.5 rounded-full hover:bg-gray-50 transition-colors"
                  >
                    {QUICK_RESPONSES[1].label}
                  </button>
                  <button
                    onClick={() => sendMessage(QUICK_RESPONSES[2].label)}
                    className="bg-brand text-white text-xs font-semibold py-2.5 rounded-full hover:bg-brand/90 transition-colors"
                  >
                    {QUICK_RESPONSES[2].label}
                  </button>
                </div>
                {/* Row 3: outlined */}
                <button
                  onClick={() => sendMessage(QUICK_RESPONSES[3].label)}
                  className="w-full border border-gray-200 text-gray-700 text-xs font-semibold py-2.5 rounded-full hover:bg-gray-50 transition-colors"
                >
                  {QUICK_RESPONSES[3].label}
                </button>
              </div>
            </div>

            {/* Canned replies */}
            <div className="mx-4 mb-3 bg-white rounded-2xl shadow-sm px-4 py-4">
              <p className="text-sm font-semibold text-gray-800 mb-3">Canned replies</p>

              {/* Row 1: 3 chips */}
              <div className="grid grid-cols-3 gap-1.5 mb-1.5">
                {CANNED_REPLIES.slice(0, 3).map((r) => (
                  <button
                    key={r.id}
                    onClick={() => sendMessage(r.label)}
                    className="border border-gray-200 text-gray-600 text-[10px] font-medium py-2 px-1 rounded-lg hover:bg-gray-50 transition-colors text-center"
                  >
                    {r.label}
                  </button>
                ))}
              </div>

              {/* Row 2: 3 chips (one with checkbox) */}
              <div className="grid grid-cols-3 gap-1.5 mb-1.5">
                {CANNED_REPLIES.slice(3, 6).map((r) => (
                  <button
                    key={r.id}
                    onClick={() => sendMessage(r.label)}
                    className="border border-gray-200 text-gray-600 text-[10px] font-medium py-2 px-1 rounded-lg hover:bg-gray-50 transition-colors text-center flex items-center justify-center gap-1"
                  >
                    {r.hasCheckbox && (
                      <span className="w-3 h-3 border border-gray-400 rounded-sm flex-shrink-0" />
                    )}
                    {r.label}
                  </button>
                ))}
              </div>

              {/* Primary CTA */}
              <button
                onClick={() => sendMessage(CANNED_REPLIES[6].label)}
                className="w-full bg-brand text-white text-xs font-semibold py-2.5 rounded-full mb-1.5 hover:bg-brand/90 transition-colors"
              >
                {CANNED_REPLIES[6].label}
              </button>

              {/* Ghost / archive */}
              <button className="w-full text-gray-400 text-[10px] py-1 hover:text-gray-600 transition-colors">
                {CANNED_REPLIES[7].label}
              </button>
            </div>
          </>
        )}
      </div>

      {/* ── Fixed bottom: Quick draft ── */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 px-4 py-3 shadow-lg">
        <div className="flex items-center gap-2">
          <button className="text-gray-400 hover:text-brand transition-colors flex-shrink-0">
            <IoAttachOutline className="text-xl" />
          </button>
          <button className="text-gray-400 hover:text-brand transition-colors flex-shrink-0">
            <IoHappyOutline className="text-xl" />
          </button>

          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(draft)}
            placeholder="Type a 1-line reply..."
            className="flex-1 text-sm text-gray-700 placeholder-gray-300 outline-none bg-transparent"
          />

          <button className="text-gray-500 text-xs font-semibold hover:text-brand transition-colors flex-shrink-0">
            Preview
          </button>
          <button
            onClick={() => sendMessage(draft)}
            disabled={!draft.trim()}
            className="bg-brand text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-brand/90 transition-colors disabled:opacity-40 flex-shrink-0"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
