import { NextRequest, NextResponse } from "next/server";
import { store, getConvForUser } from "@/lib/message-store";

interface Params {
  params: Promise<{ conversationId: string }>;
}

export async function GET(req: NextRequest, { params }: Params) {
  const { conversationId } = await params;
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId") ?? "";

  const conv = store.conversations.get(conversationId);
  if (!conv) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ conversation: getConvForUser(conv, userId) });
}
