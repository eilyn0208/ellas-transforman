import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  console.log("[auth/callback] code present:", !!code, "| origin:", origin);

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    console.log("[auth/callback] exchange error:", error ?? "none");
    if (error) {
      console.log("[auth/callback] error.message:", error.message);
      console.log("[auth/callback] error.status:", error.status);
      console.log("[auth/callback] error.code:", (error as { code?: string }).code ?? "n/a");
    }

    if (!error) {
      const meta = data.user?.user_metadata ?? {};

      if (meta.onboarding_completed) {
        return NextResponse.redirect(`${origin}/home`);
      }

      const nombre = meta.full_name ?? meta.name ?? "";
      const params = nombre ? `?nombre=${encodeURIComponent(nombre)}` : "";
      return NextResponse.redirect(`${origin}/role-selection${params}`);
    }
  }

  return NextResponse.redirect(`${origin}/welcome?error=auth`);
}