"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [message, setMessage] = useState("");

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);
        setMessage("");

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/update-password`,
        });

        setIsSending(false);

        if (error) {
            setMessage(error.message);
            return;
        }

        setMessage("Te enviamos un enlace para restablecer tu contraseña.");
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-white px-6">
            <form onSubmit={handleResetPassword} className="w-full max-w-sm">
                <h1 className="mb-3 text-3xl font-bold text-black">
                    Recuperar contraseña
                </h1>

                <p className="mb-8 text-gray-600">
                    Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.
                </p>

                <label className="mb-2 block text-sm font-medium text-black">
                    Correo electrónico
                </label>

                <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tania@ejemplo.com"
                    className="mb-5 w-full rounded-2xl border border-gray-200 px-4 py-3 text-black outline-none focus:border-[#824BE5]"
                />

                <button
                    type="submit"
                    disabled={isSending}
                    className="w-full rounded-2xl bg-[#824BE5] py-4 font-semibold text-white disabled:opacity-50"
                >
                    {isSending ? "Enviando..." : "Enviar enlace"}
                </button>

                {message && (
                    <p className="mt-5 text-center text-sm text-gray-700">{message}</p>
                )}

                <Link
                    href="/login"
                    className="mt-6 block text-center text-sm font-semibold text-[#824BE5]"
                >
                    Volver a iniciar sesión
                </Link>
            </form>
        </main>
    );
}