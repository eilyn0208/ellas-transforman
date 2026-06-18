import { NextRequest, NextResponse } from "next/server";
import { store, getConvForUser } from "@/lib/message-store";
import type { Message } from "@/types/messages";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const convs = Array.from(store.conversations.values())
    .filter((conv) => conv.participantIds.includes(userId))
    .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime())
    .map((conv) => getConvForUser(conv, userId));

  return NextResponse.json({ conversations: convs });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { mentorId, menteeId } = body as { mentorId?: string; menteeId?: string };

  if (!mentorId || !menteeId) {
    return NextResponse.json({ error: "Missing mentorId or menteeId" }, { status: 400 });
  }

  const existing = Array.from(store.conversations.values()).find(
    (c) => c.mentorId === mentorId && c.menteeId === menteeId
  );
  if (existing) {
    return NextResponse.json({ conversation: getConvForUser(existing, menteeId) });
  }

  const mentor = store.users.get(mentorId);
  const mentee = store.users.get(menteeId);
  const convId = `conv-${Date.now()}`;

  const conv = {
    id: convId,
    mentorId,
    menteeId,
    mentorName: mentor?.name ?? "Mentora",
    mentorAvatar: mentor?.avatar ?? "👩‍💻",
    mentorRole: "Mentora",
    menteeName: mentee?.name ?? "Mentee",
    menteeAvatar: mentee?.avatar ?? "👩‍🎓",
    menteeRole: "Mentee",
    menteeLocation: "",
    menteeGoal: "",
    menteeAvailability: "",
    matchContext: "Conexión directa",
    matchLabel: "Conectadas vía",
    messageNumber: 1,
    status: "active" as const,
    lastMessage: "",
    lastMessageAt: new Date().toISOString(),
    participantIds: [mentorId, menteeId],
    unreadForMentor: 0,
    unreadForMentee: 0,
  };

  store.conversations.set(convId, conv);

  const sysMsg: Message = {
    id: `sys-${convId}`,
    conversationId: convId,
    senderId: "system",
    senderRole: "system",
    senderName: "Sistema",
    content: "Conexión establecida · Nueva sesión de mentoría",
    type: "system",
    createdAt: new Date().toISOString(),
    isRead: true,
  };
  store.messages.set(convId, [sysMsg]);

  return NextResponse.json({ conversation: getConvForUser(conv, menteeId) });
}
