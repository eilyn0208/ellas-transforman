"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setMensaje("");

    if (!nombre || !correo || !password) {
      setMensaje("Completa todos los campos.");
      return;
    }

    if (password.length < 8) {
      setMensaje("La contraseña debe tener mínimo 8 caracteres.");
      return;
    }

    if (!aceptaTerminos) {
      setMensaje("Debes aceptar los términos y condiciones.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: correo,
      password,
      options: {
        data: {
          nombre,
        },
      },
    });

    setLoading(false);

    if (error) {
      setMensaje(error.message);
      return;
    }

    setMensaje("Cuenta creada correctamente. Revisa tu correo.");
  };

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto w-full max-w-md px-6 py-10">
        <div className="space-y-6">
          {/* Título */}
          <div>
            <h1 className="text-4xl font-bold text-black">
              Crea tu cuenta.
            </h1>

            <p className="mt-4 text-lg leading-relaxed text-gray-500">
              Únete a nuestros mentores verificados y empieza sesiones uno a
              uno, talleres y planes de crecimiento.
            </p>
          </div>

          {/* Nombre */}
          <div>
            <input
              type="text"
              placeholder="Nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full rounded-3xl border border-gray-300 px-5 py-4 text-base outline-none focus:border-purple-600"
            />

            <p className="mt-2 text-sm text-gray-500">
              Para una mejor experiencia usa tu nombre real.
            </p>
          </div>

          {/* Correo */}
          <div>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full rounded-3xl border border-gray-300 px-5 py-4 text-base outline-none focus:border-purple-600"
            />

            <p className="mt-2 text-sm text-gray-500">
              Enviaremos un correo de verificación.
            </p>
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Crear contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-3xl border border-gray-300 px-5 py-4 text-base outline-none focus:border-purple-600"
            />

            <p className="mt-2 text-sm text-gray-500">
              Mínimo 8 caracteres, números y caracteres especiales.
            </p>
          </div>

          {/* Términos */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-black">
              Acepto los términos y condiciones
            </span>

            <button
              type="button"
              onClick={() => setAceptaTerminos(!aceptaTerminos)}
              className={`relative h-8 w-16 rounded-full transition ${
                aceptaTerminos ? "bg-purple-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-1 h-6 w-6 rounded-full bg-white transition-all ${
                  aceptaTerminos ? "left-9" : "left-1"
                }`}
              />
            </button>
          </div>

          {/* Botón */}
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full rounded-3xl bg-purple-600 py-4 text-lg font-medium text-white transition hover:opacity-90"
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>

          {/* Mensaje */}
          {mensaje && (
            <p className="text-center text-sm text-purple-600">
              {mensaje}
            </p>
          )}

          {/* Login */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            <p className="text-gray-500">
              ¿Ya tienes una cuenta?
            </p>

            <Link
              href="/login"
              className="rounded-full bg-purple-600 px-4 py-1 text-white"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}