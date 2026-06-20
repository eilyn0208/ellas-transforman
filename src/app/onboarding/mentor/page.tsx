"use client";

import { useState } from "react";
import { mentorQuestions } from "@/constants/mentor-questions";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/AppLayout";
import { supabase } from "@/lib/supabase/client";

export default function MentorOnboardingPage() {
  const [paso, setPaso] = useState(0);
  const router = useRouter();

  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [scaleValue, setScaleValue] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState("");

  const preguntaActual = mentorQuestions[paso];
  const porcentaje = ((paso + 1) / mentorQuestions.length) * 100;

  const handleContinue = async () => {
    const nuevasRespuestas = { ...answers };

    if (preguntaActual.type === "single") {
      nuevasRespuestas[preguntaActual.id] = selectedOptions[0];
    }
    if (preguntaActual.type === "multiple") {
      nuevasRespuestas[preguntaActual.id] = selectedOptions;
    }
    if (preguntaActual.type === "scale") {
      nuevasRespuestas[preguntaActual.id] = scaleValue;
    }
    if (preguntaActual.type === "text") {
      nuevasRespuestas[preguntaActual.id] = textAnswer;
    }

    setAnswers(nuevasRespuestas);

    if (paso < mentorQuestions.length - 1) {
      setPaso(paso + 1);
      setSelectedOptions([]);
      setScaleValue(null);
      setTextAnswer("");
    } else {
      localStorage.setItem("ellas_role", "mentor");
      localStorage.setItem("ellas_mentor_answers", JSON.stringify(nuevasRespuestas));
      await supabase.auth.updateUser({ data: { role: "mentor", onboarding_completed: true } });
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const full_name = user.user_metadata?.full_name ?? user.user_metadata?.name ?? "";
          const { error } = await supabase.from("profiles").upsert(
            { id: user.id, full_name, email: user.email ?? "", role: "mentor" },
            { onConflict: "id" }
          );
          if (error) {
            console.error("profiles upsert failed:", error);
          }
        }
      } catch (e) {
        console.error("profiles upsert failed:", e);
      }
      router.push("/onboarding/mentor/results");
    }
  };

  const canContinue =
    (preguntaActual.type === "single" && selectedOptions.length > 0) ||
    (preguntaActual.type === "multiple" && selectedOptions.length > 0) ||
    (preguntaActual.type === "scale" && scaleValue !== null) ||
    preguntaActual.type === "text";

  return (
    <AppLayout showNav={false} bg="bg-white">
      <main className="flex-1 min-h-0 overflow-y-auto px-5 py-10">
        <div className="mx-auto max-w-md">
          {/* Barra de progreso */}
          <div className="mb-8">
            <div className="mb-2 flex justify-between text-sm text-gray-400">
              <span>Paso {paso + 1} de {mentorQuestions.length}</span>
              <span>{Math.round(porcentaje)}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-brand-soft">
              <div
                className="h-2 rounded-full bg-brand transition-all duration-300"
                style={{ width: `${porcentaje}%` }}
              />
            </div>
          </div>

          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            {preguntaActual.question}
          </h1>

          {preguntaActual.type === "multiple" && (
            <p className="mb-8 text-lg text-gray-400">
              Puedes seleccionar hasta {preguntaActual.maxSelections || 3} opciones.
            </p>
          )}

          {preguntaActual.type === "single" && (
            <p className="mb-8 text-lg text-gray-400">
              Selecciona la opción que mejor te represente.
            </p>
          )}

          {preguntaActual.type === "text" && (
            <p className="mb-8 text-lg text-gray-400">
              Tu respuesta nos ayudará a conocerte mejor.
            </p>
          )}

          {/* Single select */}
          {preguntaActual.type === "single" && (
            <div className="space-y-4">
              {preguntaActual.options?.map((opcion) => (
                <button
                  key={opcion}
                  onClick={() => setSelectedOptions([opcion])}
                  className={`w-full rounded-2xl border p-5 text-left text-lg font-semibold text-gray-900 transition-colors ${
                    selectedOptions.includes(opcion)
                      ? "border-brand bg-brand-light"
                      : "border-gray-200 hover:border-brand/40"
                  }`}
                >
                  {opcion}
                </button>
              ))}
            </div>
          )}

          {/* Multiple select */}
          {preguntaActual.type === "multiple" && (
            <div className="flex flex-wrap gap-3">
              {preguntaActual.options?.map((opcion) => {
                const selected = selectedOptions.includes(opcion);
                return (
                  <button
                    key={opcion}
                    onClick={() => {
                      if (selected) {
                        setSelectedOptions(selectedOptions.filter((o) => o !== opcion));
                      } else if (selectedOptions.length < (preguntaActual.maxSelections || 3)) {
                        setSelectedOptions([...selectedOptions, opcion]);
                      }
                    }}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      selected
                        ? "bg-brand text-white"
                        : "bg-gray-100 text-gray-900 hover:bg-brand-light"
                    }`}
                  >
                    {opcion}
                  </button>
                );
              })}
            </div>
          )}

          {/* Scale */}
          {preguntaActual.type === "scale" && (
            <div>
              <div className="mb-4 flex justify-between text-sm text-gray-400">
                <span>Nada segura</span>
                <span>Muy segura</span>
              </div>
              <div className="flex justify-center gap-4">
                {[1, 2, 3, 4, 5].map((valor) => (
                  <button
                    key={valor}
                    onClick={() => setScaleValue(valor)}
                    className={`h-14 w-14 rounded-full border text-lg font-semibold transition-colors ${
                      scaleValue === valor
                        ? "bg-brand text-white border-brand"
                        : "bg-white border-gray-200 hover:border-brand"
                    }`}
                  >
                    {valor}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Text */}
          {preguntaActual.type === "text" && (
            <div>
              <textarea
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                maxLength={250}
                rows={6}
                placeholder={preguntaActual.placeholder || "Cuéntanos un poco más..."}
                className="w-full rounded-2xl border border-gray-200 p-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
              <div className="mt-2 text-right text-sm text-gray-400">
                {textAnswer.length}/250
              </div>
            </div>
          )}

          <button
            disabled={!canContinue}
            onClick={handleContinue}
            className="mt-10 w-full rounded-2xl bg-brand py-4 text-lg font-semibold text-white disabled:opacity-40 hover:bg-brand-dark transition-colors"
          >
            Continuar
          </button>

          <div className="mt-10 rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <h3 className="mb-2 text-base font-semibold text-gray-900">
              ¿Por qué preguntamos esto?
            </h3>
            <p className="text-sm leading-relaxed text-gray-700">
              Queremos entender tu experiencia, estilo y disponibilidad para
              conectarte con mentees que realmente puedan beneficiarse de tu guía.
            </p>
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
