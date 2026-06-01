"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PrimaryButton from "@/components/PrimaryButton";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: conectar con tu auth (Firebase / Supabase / API propia)
      console.log({ email, password });
      router.push("/role-selection");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white flex flex-col px-6 py-10 max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-center space-y-5">
        {/* Email */}
        <div>
          <label className="block text-sm text-foreground mb-2">
            Correo electrónico
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tania@ejemplo.com"
            required
            className="w-full border border-gray-300 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-brand"
          />
        </div>

        {/* Password con toggle */}
        <div>
          <label className="block text-sm text-foreground mb-2">Contraseña</label>
          <div className="flex items-center gap-3">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Introduce tu contraseña"
              required
              className="flex-1 border border-gray-300 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-brand"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Mostrar/ocultar contraseña"
              className={`relative w-12 h-6 rounded-full border-2 border-brand transition-colors ${
                showPassword ? "bg-brand" : "bg-white"
              }`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-brand transition-transform ${
                  showPassword ? "translate-x-6 bg-white" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Forgot password */}
        <Link
          href="/forgot-password"
          className="text-center text-sm font-semibold text-foreground hover:text-brand"
        >
          ¿Olvidaste tu contraseña?
        </Link>

        {/* Continuar */}
        <PrimaryButton type="submit">
          {loading ? "Cargando..." : "Continuar"}
        </PrimaryButton>

        {/* Crear cuenta */}
        <Link
          href="/register"
          className="text-center text-sm font-semibold text-foreground hover:text-brand"
        >
          Crear una cuenta
        </Link>

        {/* Disclaimer */}
        <p className="text-center text-xs text-gray-500 leading-relaxed px-4">
          Al continuar aceptas los lineamientos de seguridad y pagos seguros.
          Todas las mentoras están verificadas por el equipo de EllasTransforman.
        </p>
      </form>
    </main>
  );
}