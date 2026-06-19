import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import AppHeader from "@/components/AppHeader";
import GoogleButton from "@/components/GoogleButton";

export default function WelcomePage() {
  return (
    <AppLayout showNav={false} bg="bg-white">
      <AppHeader />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-10 text-center">
        <h1 className="text-5xl font-extrabold text-brand-dark">¡Bienvenida!</h1>
        <p className="mt-4 text-base text-foreground px-4">
          Empoderando tu camino profesional a través de la mentoría guiada.
        </p>
      </main>

      <div className="px-6 pb-10">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3 shadow-sm">
          <GoogleButton />
          <p className="text-center text-xs text-gray-500 leading-relaxed px-2">
            Al continuar aceptas nuestros{" "}
            <Link href="/terms" className="underline text-gray-700 hover:text-brand">
              Términos de Servicio
            </Link>{" "}
            y{" "}
            <Link href="/privacy" className="underline text-gray-700 hover:text-brand">
              Política de Privacidad
            </Link>
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
