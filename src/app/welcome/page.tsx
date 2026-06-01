"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import PrimaryButton from "@/components/PrimaryButton";
import GoogleButton from "@/components/GoogleButton";

export default function WelcomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white flex flex-col px-6 py-10 max-w-md mx-auto">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <h1 className="text-5xl font-extrabold text-foreground">¡Bienvenida!</h1>
        <p className="mt-4 text-base text-foreground px-4">
          Empoderando tu camino profesional a través de la mentoría guiada.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3 shadow-sm">
        <PrimaryButton onClick={() => router.push("/register")}>
          Regístrate
        </PrimaryButton>
        <PrimaryButton onClick={() => router.push("/login")}>
          Iniciar sesión
        </PrimaryButton>

        <div className="flex items-center gap-2 my-1">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-500">O continúa con</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <GoogleButton />
      </div>

      <div className="flex justify-between mt-6 text-xs text-gray-500">
        <Link href="/privacy">Política de privacidad</Link>
        <Link href="/terms">Términos</Link>
      </div>
    </main>
  );
}
