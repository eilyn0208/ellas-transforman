import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/message-store";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, role, name, avatar, onboardingAnswers } = body as {
    userId?: string;
    role?: string;
    name?: string;
    avatar?: string;
    onboardingAnswers?: Record<string, unknown>;
  };

  if (!userId || !role) {
    return NextResponse.json({ error: "Missing userId or role" }, { status: 400 });
  }

  const existing = store.users.get(userId);
  store.users.set(userId, {
    userId,
    role: role as "mentor" | "mentee",
    name: name || existing?.name || (role === "mentor" ? "Mentora" : "Mentee"),
    avatar: avatar || existing?.avatar || (role === "mentor" ? "👩‍💻" : "👩‍🎓"),
    onboardingAnswers: onboardingAnswers || existing?.onboardingAnswers,
  });

  return NextResponse.json({ success: true });
}
