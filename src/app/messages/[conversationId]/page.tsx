"use client";

import { use, useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  IoMoonOutline,
  IoNotificationsOutline,
  IoAttachOutline,
  IoHappyOutline,
  IoSparklesOutline,
  IoChevronDownOutline,
  IoChevronUpOutline,
} from "react-icons/io5";
import { QUICK_RESPONSES, CANNED_REPLIES } from "@/constants/messages";
import type { Conversation, Message, MenteeSummary, MentorSummary } from "@/types/messages";
import AppHeader from "@/components/AppHeader";
import AppLayout from "@/components/AppLayout";

interface Props {
  params: Promise<{ conversationId: string }>;
}

function timeLabel(iso: string): string {
  return new Date(iso).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" });
}

function formatTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Ahora";
  if (mins < 60) return `Hace ${mins}m`;
  return timeLabel(iso);
}

// ── Summary card for mentor view (shows mentee profile) ──────────────────────
function MenteeSummaryCard({ summary }: { summary: MenteeSummary }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="mx-5 mb-3 bg-white rounded-2xl shadow-sm overflow-hidden border border-brand/20">
      <button
        onClick={() => setCollapsed((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <IoSparklesOutline className="text-brand text-base flex-shrink-0" />
          <span className="text-sm font-semibold text-gray-800">Resumen IA · Mentee</span>
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
          <SummaryRow label="Objetivo" value={summary.professionalGoal} />
          <SummaryRow label="Ruta actual" value={summary.currentRoadmapTitle} />
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
              <span className="text-xs font-bold text-brand">{summary.progressPercent}%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{summary.progressNote}</p>
          </div>
          <SummaryRow label="Próxima sesión" value={summary.nextSessionFocus} accent />
          <SummaryRow label="Disponible" value={summary.availableHours} />
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

// ── Summary card for mentee view (shows mentor profile) ──────────────────────
function MentorSummaryCard({ summary }: { summary: MentorSummary }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="mx-5 mb-3 bg-white rounded-2xl shadow-sm overflow-hidden border border-purple-200">
      <button
        onClick={() => setCollapsed((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <IoSparklesOutline className="text-purple-500 text-base flex-shrink-0" />
          <span className="text-sm font-semibold text-gray-800">Resumen IA · Mentora</span>
          {!summary.isAiGenerated && (
            <span className="text-[9px] bg-purple-50 text-purple-500 font-medium px-1.5 py-0.5 rounded-full">
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
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">
              Perfil
            </p>
            <p className="text-sm font-bold text-purple-600">{summary.profileTitle}</p>
            <p className="text-xs text-gray-600 mt-0.5">{summary.description}</p>
          </div>
          <SummaryRow label="Estilo de mentoría" value={summary.mentoringStyle} />
          {summary.specialties.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
                Especialidades
              </p>
              <div className="flex flex-wrap gap-1">
                {summary.specialties.map((s) => (
                  <span
                    key={s}
                    className="bg-purple-50 text-purple-600 text-[10px] font-medium px-2 py-0.5 rounded-full"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
          {summary.mentoringAreas.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
                Áreas de mentoría
              </p>
              <div className="space-y-1">
                {summary.mentoringAreas.map((a) => (
                  <div key={a} className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-purple-400 flex-shrink-0" />
                    <span className="text-xs text-gray-700">{a}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SummaryRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">
        {label}
      </p>
      <p className={`text-xs ${accent ? "text-brand font-medium" : "text-gray-700"}`}>{value}</p>
    </div>
  );
}

function SystemMessage({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 px-5 my-3">
      <div className="flex-1 h-px bg-gray-200" />
      <p className="text-[10px] text-gray-400 text-center whitespace-nowrap px-1">{text}</p>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
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

// ── Loading skeleton for the summary card ────────────────────────────────────
function SummarySkeleton({ isMentor }: { isMentor: boolean }) {
  return (
    <div
      className={`mx-5 mb-3 rounded-2xl px-4 py-3 border animate-pulse ${
        isMentor ? "border-brand/20 bg-brand-soft/30" : "border-purple-200 bg-purple-50/30"
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-4 h-4 rounded-full bg-gray-200" />
        <div className="h-3 w-32 bg-gray-200 rounded" />
      </div>
      <div className="space-y-1.5">
        <div className="h-2 bg-gray-200 rounded w-3/4" />
        <div className="h-2 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function ConversationPage({ params }: Props) {
  const { conversationId } = use(params);
  const router = useRouter();

  const [role, setRole] = useState<string>("mentee");
  const [userId, setUserId] = useState<string>("");
  const [conv, setConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [menteeSummary, setMenteeSummary] = useState<MenteeSummary | null>(null);
  const [mentorSummary, setMentorSummary] = useState<MentorSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [sending, setSending] = useState(false);

  // Initialise user identity
  useEffect(() => {
    const storedRole = localStorage.getItem("ellas_role") ?? "mentee";
    const uid = storedRole === "mentor" ? "demo-mentor" : "demo-mentee";
    setRole(storedRole);
    setUserId(uid);
  }, []);

  // Fetch conversation data
  useEffect(() => {
    if (!userId) return;
    fetch(`/api/conversations/${conversationId}?userId=${userId}`)
      .then((r) => r.json())
      .then((d) => setConv(d.conversation ?? null))
      .catch(console.error);
  }, [conversationId, userId]);

  // Poll messages every 3 s
  const fetchMessages = useCallback(async () => {
    if (!userId) return;
    try {
      const r = await fetch(
        `/api/conversations/${conversationId}/messages?userId=${userId}`
      );
      if (r.ok) {
        const d = await r.json();
        setMessages(d.messages ?? []);
      }
    } catch { /* ignore */ }
  }, [conversationId, userId]);

  useEffect(() => {
    if (!userId) return;
    fetchMessages();
    const id = setInterval(fetchMessages, 3000);
    return () => clearInterval(id);
  }, [userId, fetchMessages]);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load AI summary once conv is available
  useEffect(() => {
    if (!conv || !userId) return;
    const isMentor = role === "mentor";
    setSummaryLoading(true);

    const endpoint = isMentor ? "/api/mentee-summary" : "/api/mentor-summary";
    const body = isMentor
      ? { menteeId: conv.menteeId }
      : { mentorId: conv.mentorId };

    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((r) => r.json())
      .then((d) => {
        if (isMentor) setMenteeSummary(d.summary ?? null);
        else setMentorSummary(d.summary ?? null);
      })
      .catch(console.error)
      .finally(() => setSummaryLoading(false));
  }, [conv, userId, role]);

  const isMentor = role === "mentor";

  async function sendMessage(text: string) {
    if (!text.trim() || !conv || sending) return;
    setSending(true);
    setDraft("");

    try {
      await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: userId,
          senderRole: isMentor ? "mentor" : "mentee",
          senderName: isMentor ? conv.mentorName : conv.menteeName,
          content: text.trim(),
        }),
      });
      await fetchMessages();
    } catch { /* ignore */ } finally {
      setSending(false);
    }
  }

  if (!conv) {
    return (
      <AppLayout showNav={false}>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-brand-soft border-t-brand animate-spin" />
        </div>
      </AppLayout>
    );
  }

  const otherName = isMentor ? conv.menteeName : conv.mentorName;
  const otherAvatar = isMentor ? conv.menteeAvatar : conv.mentorAvatar;
  const otherRole = isMentor ? conv.menteeRole : conv.mentorRole;

  const rightSlot = (
    <>
      <button className="relative w-9 h-9 rounded-full bg-brand-soft flex items-center justify-center text-brand hover:bg-brand-light transition-colors">
        <IoNotificationsOutline className="text-lg" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full" />
      </button>
      <button className="w-9 h-9 rounded-full bg-brand-soft flex items-center justify-center text-brand hover:bg-brand-light transition-colors">
        <IoMoonOutline className="text-lg" />
      </button>
    </>
  );

  return (
    <AppLayout showNav={false}>
      <AppHeader showBack rightSlot={rightSlot} />

      <div className="flex-1 overflow-y-auto pb-24">
        {/* Profile card */}
        <div className="bg-white mx-5 mt-4 mb-3 rounded-2xl shadow-sm px-4 py-4">
          <div className="flex items-start gap-3">
            <div className="w-14 h-14 rounded-full bg-brand-soft flex items-center justify-center text-3xl flex-shrink-0">
              {otherAvatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-sm text-gray-900">{otherName}</p>
                  <p className="text-xs text-gray-500">
                    {otherRole}
                    {conv.menteeLocation ? ` · ${conv.menteeLocation}` : ""}
                  </p>
                </div>
                <span className="text-[10px] text-gray-400 flex-shrink-0 mt-0.5">
                  {formatTime(conv.lastMessageAt)}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-2.5">
                <span className="bg-brand text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                  {isMentor ? "Nueva mentee" : "Tu mentora"}
                </span>
                {conv.menteeGoal && (
                  <span className="bg-gray-100 text-gray-600 text-[10px] font-medium px-2.5 py-1 rounded-full">
                    Goal: {conv.menteeGoal}
                  </span>
                )}
                {conv.menteeAvailability && (
                  <span className="bg-gray-100 text-gray-600 text-[10px] font-medium px-2.5 py-1 rounded-full">
                    Available: {conv.menteeAvailability}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* AI Summary card — shown for both roles */}
        {summaryLoading && <SummarySkeleton isMentor={isMentor} />}
        {!summaryLoading && isMentor && menteeSummary && (
          <MenteeSummaryCard summary={menteeSummary} />
        )}
        {!summaryLoading && !isMentor && mentorSummary && (
          <MentorSummaryCard summary={mentorSummary} />
        )}

        {/* Messages */}
        <div className="py-2">
          {messages.map((msg) => {
            if (msg.type === "system") {
              return <SystemMessage key={msg.id} text={msg.content} />;
            }
            const isSelf = msg.senderId === userId;
            return <MessageBubble key={msg.id} msg={msg} isSelf={isSelf} />;
          })}
          <div ref={bottomRef} />
        </div>

        {/* Match context bar */}
        <div className="flex items-center justify-between px-5 py-2.5 mx-5 mb-3 bg-white rounded-xl shadow-sm">
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
            Mensaje #{conv.messageNumber}
          </p>
        </div>

        {/* Mentor tools */}
        {isMentor && (
          <>
            <div className="mx-5 mb-3 bg-white rounded-2xl shadow-sm px-4 py-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-800">Quick responses</p>
                <p className="text-[10px] text-gray-400">Tap para enviar</p>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => sendMessage(QUICK_RESPONSES[0].label)}
                  className="w-full bg-brand text-white text-xs font-semibold py-2.5 rounded-full hover:bg-brand/90 transition-colors"
                >
                  {QUICK_RESPONSES[0].label}
                </button>
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
                <button
                  onClick={() => sendMessage(QUICK_RESPONSES[3].label)}
                  className="w-full border border-gray-200 text-gray-700 text-xs font-semibold py-2.5 rounded-full hover:bg-gray-50 transition-colors"
                >
                  {QUICK_RESPONSES[3].label}
                </button>
              </div>
            </div>

            <div className="mx-5 mb-3 bg-white rounded-2xl shadow-sm px-4 py-4">
              <p className="text-sm font-semibold text-gray-800 mb-3">Canned replies</p>
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
              <button
                onClick={() => sendMessage(CANNED_REPLIES[6].label)}
                className="w-full bg-brand text-white text-xs font-semibold py-2.5 rounded-full mb-1.5 hover:bg-brand/90 transition-colors"
              >
                {CANNED_REPLIES[6].label}
              </button>
              <button className="w-full text-gray-400 text-[10px] py-1 hover:text-gray-600 transition-colors">
                {CANNED_REPLIES[7].label}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Fixed input bar */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 px-5 py-3 shadow-lg">
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
            placeholder="Escribe un mensaje..."
            className="flex-1 text-sm text-gray-700 placeholder-gray-300 outline-none bg-transparent"
          />

          <button
            onClick={() => sendMessage(draft)}
            disabled={!draft.trim() || sending}
            className="bg-brand text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-brand/90 transition-colors disabled:opacity-40 flex-shrink-0"
          >
            {sending ? "..." : "Enviar"}
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
