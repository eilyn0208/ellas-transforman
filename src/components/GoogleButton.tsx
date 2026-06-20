"use client";

import { supabase } from "@/lib/supabase/client";

type Props = { onClick?: () => void };

export default function GoogleButton({ onClick }: Props) {
  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          prompt: "select_account",
        },
      },
    });

    if (error) {
      console.error("Error con Google Sign-In:", error.message);
      alert("Hubo un problema al iniciar sesión con Google");
    }
    // No hace falta hacer router.push aquí — Supabase redirige a Google
    // y luego Google redirige a /auth/callback automáticamente
  };

  return (
    <button
      onClick={onClick ?? handleGoogleSignIn}
      className="w-full bg-brand hover:bg-brand-dark text-white font-semibold py-3 rounded-full flex items-center justify-center gap-2 transition-colors"
    >
      <svg width="20" height="20" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3l5.7-5.7C34.5 6.1 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
        <path fill="#4CAF50" d="M24 44c5.4 0 10.3-2.1 14-5.5l-6.5-5.5c-2 1.4-4.5 2.3-7.5 2.3-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.5l6.5 5.5c-.5.4 7.5-5.5 7.5-15 0-1.3-.1-2.4-.4-3.5z"/>
      </svg>
      Continuar con Google
    </button>
  );
}