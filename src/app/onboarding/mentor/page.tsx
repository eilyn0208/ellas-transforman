"use client";

import { useState } from "react";
import { mentorQuestions } from "@/constants/mentor-questions";
import { useRouter } from "next/navigation";

export default function MentorOnboardingPage() {
  const [paso, setPaso] = useState(0);
  const router = useRouter();

  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [scaleValue, setScaleValue] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [completed, setCompleted] = useState(false);

  const preguntaActual = mentorQuestions[paso];
  const porcentaje = ((paso + 1) / mentorQuestions.length) * 100;

  const handleContinue = () => {
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
      console.log(nuevasRespuestas);
      setCompleted(true);
    }
  };

  const canContinue =
    (preguntaActual.type === "single" && selectedOptions.length > 0) ||
    (preguntaActual.type === "multiple" && selectedOptions.length > 0) ||
    (preguntaActual.type === "scale" && scaleValue !== null) ||
    preguntaActual.type === "text";

  if (completed) {
    return (
      <main className="min-h-screen bg-white px-6 py-10 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-10">
            <h2 className="text-[#824BE5] font-semibold text-lg mb-2">
              Tu perfil de mentora
            </h2>

            <h1 className="text-5xl font-bold text-black mb-4">
              Strategic Guide
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed">
              Tienes una forma clara, humana y estratégica de acompañar a otras
              mujeres. Puedes ayudarles a tomar mejores decisiones, ganar
              confianza y convertir sus metas en pasos concretos.
            </p>
          </div>

          <div className="rounded-3xl bg-[#DACDF2] p-6 mb-6">
            <h3 className="font-bold text-xl mb-4 text-black">
              Tus fortalezas como mentora
            </h3>

            <ul className="space-y-3 text-black">
              <li>✓ Claridad profesional</li>
              <li>✓ Acompañamiento humano</li>
              <li>✓ Experiencia práctica</li>
              <li>✓ Guía para tomar acción</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-gray-200 p-6 mb-8">
            <h3 className="font-bold text-xl mb-4 text-black">
              Podrías conectar mejor con mentees que:
            </h3>

            <ul className="space-y-3 text-black">
              <li>✓ Buscan claridad profesional</li>
              <li>✓ Quieren ganar confianza</li>
              <li>✓ Necesitan guía para sus próximos pasos</li>
            </ul>
          </div>

          <button
            className="w-full rounded-2xl bg-[#824BE5] py-4 text-lg font-semibold text-white hover:opacity-90"
            onClick={() => router.push("/profile")}
          >
            Ver mi perfil
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-6 py-10">
      <div className="mx-auto max-w-xl">
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-sm text-[#909090]">
            <span>
              Paso {paso + 1} de {mentorQuestions.length}
            </span>

            <span>{Math.round(porcentaje)}%</span>
          </div>

          <div className="h-2 w-full rounded-full bg-[#DACDF2]">
            <div
              className="h-2 rounded-full bg-[#824BE5]"
              style={{ width: `${porcentaje}%` }}
            />
          </div>
        </div>

        <h1 className="mb-4 text-4xl font-bold text-black">
          {preguntaActual.question}
        </h1>

        {preguntaActual.type === "multiple" && (
          <p className="mb-8 text-lg text-[#909090]">
            Puedes seleccionar hasta {preguntaActual.maxSelections || 3} opciones.
          </p>
        )}

        {preguntaActual.type === "single" && (
          <p className="mb-8 text-lg text-[#909090]">
            Selecciona la opción que mejor te represente.
          </p>
        )}

        {preguntaActual.type === "text" && (
          <p className="mb-8 text-lg text-[#909090]">
            Tu respuesta nos ayudará a conocerte mejor.
          </p>
        )}

        {preguntaActual.type === "single" && (
          <div className="space-y-4">
            {preguntaActual.options?.map((opcion) => (
              <button
                key={opcion}
                onClick={() => setSelectedOptions([opcion])}
                className={`w-full rounded-2xl border p-5 text-left text-lg font-semibold text-black ${
                  selectedOptions.includes(opcion)
                    ? "border-[#824BE5] bg-[#DACDF2]"
                    : "border-gray-200"
                }`}
              >
                {opcion}
              </button>
            ))}
          </div>
        )}

        {preguntaActual.type === "multiple" && (
          <div className="flex flex-wrap gap-3">
            {preguntaActual.options?.map((opcion) => {
              const selected = selectedOptions.includes(opcion);

              return (
                <button
                  key={opcion}
                  onClick={() => {
                    if (selected) {
                      setSelectedOptions(
                        selectedOptions.filter((o) => o !== opcion)
                      );
                    } else if (
                      selectedOptions.length <
                      (preguntaActual.maxSelections || 3)
                    ) {
                      setSelectedOptions([...selectedOptions, opcion]);
                    }
                  }}
                  className={`rounded-full px-4 py-2 text-sm font-medium ${
                    selected
                      ? "bg-[#824BE5] text-white"
                      : "bg-gray-100 text-black"
                  }`}
                >
                  {opcion}
                </button>
              );
            })}
          </div>
        )}

        {preguntaActual.type === "scale" && (
          <div>
            <div className="mb-4 flex justify-between text-sm text-[#909090]">
              <span>Nada segura</span>
              <span>Muy segura</span>
            </div>

            <div className="flex justify-center gap-4">
              {[1, 2, 3, 4, 5].map((valor) => (
                <button
                  key={valor}
                  onClick={() => setScaleValue(valor)}
                  className={`h-14 w-14 rounded-full border text-lg font-semibold ${
                    scaleValue === valor ? "bg-[#824BE5] text-white" : "bg-white"
                  }`}
                >
                  {valor}
                </button>
              ))}
            </div>
          </div>
        )}

        {preguntaActual.type === "text" && (
          <div>
            <textarea
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              maxLength={250}
              rows={6}
              placeholder={
                preguntaActual.placeholder || "Cuéntanos un poco más..."
              }
              className="w-full rounded-2xl border p-4 text-black"
            />

            <div className="mt-2 text-right text-sm text-[#909090]">
              {textAnswer.length}/250
            </div>
          </div>
        )}

        <button
          disabled={!canContinue}
          onClick={handleContinue}
          className="mt-10 w-full rounded-2xl bg-[#824BE5] py-4 text-lg font-semibold text-white disabled:opacity-40"
        >
          Continuar
        </button>

        <div className="mt-10 rounded-2xl border border-gray-200 bg-gray-50 p-5">
          <h3 className="mb-2 text-base font-semibold text-black">
            ¿Por qué preguntamos esto?
          </h3>

          <p className="text-sm leading-relaxed text-gray-700">
            Queremos entender tu experiencia, estilo y disponibilidad para
            conectarte con mentees que realmente puedan beneficiarse de tu guía.
          </p>
        </div>
      </div>
    </main>
  );
}