import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/message-store";
import type { Message } from "@/types/messages";

interface Params {
  params: Promise<{ conversationId: string }>;
}

export async function GET(req: NextRequest, { params }: Params) {
  const { conversationId } = await params;
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const msgs = store.messages.get(conversationId) ?? [];

  // Mark read for this user
  if (userId) {
    const conv = store.conversations.get(conversationId);
    if (conv) {
      if (userId === conv.mentorId) conv.unreadForMentor = 0;
      else if (userId === conv.menteeId) conv.unreadForMentee = 0;
    }
  }

  return NextResponse.json({ messages: msgs });
}

export async function POST(req: NextRequest, { params }: Params) {
  const { conversationId } = await params;
  const body = await req.json();
  const { senderId, senderRole, senderName, content } = body as {
    senderId: string;
    senderRole: string;
    senderName: string;
    content: string;
  };

  const conv = store.conversations.get(conversationId);
  if (!conv) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }

  const msg: Message = {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    conversationId,
    senderId,
    senderRole: senderRole as Message["senderRole"],
    senderName,
    content,
    type: "text",
    createdAt: new Date().toISOString(),
    isRead: false,
  };

  const msgs = store.messages.get(conversationId) ?? [];
  msgs.push(msg);
  store.messages.set(conversationId, msgs);

  conv.lastMessage = content;
  conv.lastMessageAt = msg.createdAt;

  if (senderRole === "mentor") {
    conv.unreadForMentee = (conv.unreadForMentee || 0) + 1;
  } else {
    conv.unreadForMentor = (conv.unreadForMentor || 0) + 1;
  }

  return NextResponse.json({ message: msg });
}
