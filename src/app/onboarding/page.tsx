"use client";

import { useState } from "react";
import { menteeQuestions } from "@/constants/mentee-questions";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const [paso, setPaso] = useState(0);
  const router = useRouter();

  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [scaleValue, setScaleValue] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [completed, setCompleted] = useState(false);

  const preguntaActual = menteeQuestions[paso];

  const porcentaje =
    ((paso + 1) / menteeQuestions.length) * 100;

  const handleContinue = () => {
    const nuevasRespuestas = { ...answers };

    if (preguntaActual.type === "single") {
      nuevasRespuestas[preguntaActual.id] =
        selectedOptions[0];
    }

    if (preguntaActual.type === "multiple") {
      nuevasRespuestas[preguntaActual.id] =
        selectedOptions;
    }

    if (preguntaActual.type === "scale") {
      nuevasRespuestas[preguntaActual.id] =
        scaleValue;
    }

    if (preguntaActual.type === "text") {
      nuevasRespuestas[preguntaActual.id] =
        textAnswer;
    }

    setAnswers(nuevasRespuestas);

    if (paso < menteeQuestions.length - 1) {
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
    (preguntaActual.type === "single" &&
      selectedOptions.length > 0) ||
    (preguntaActual.type === "multiple" &&
      selectedOptions.length > 0) ||
    (preguntaActual.type === "scale" &&
      scaleValue !== null) ||
    preguntaActual.type === "text";
    if (completed) {
  return (
    <main className="min-h-screen bg-white px-6 py-10 flex items-center justify-center">
      <div className="w-full max-w-2xl">

        <div className="text-center mb-10">
          <h2 className="text-[#824BE5] font-semibold text-lg mb-2">
            Tu perfil
          </h2>

          <h1 className="text-5xl font-bold text-black mb-4">
            Future Builder
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed">
            Tienes mucha curiosidad y ambición, pero todavía estás explorando
            qué camino profesional se siente correcto para ti. Probablemente
            buscas claridad, dirección y alguien que te ayude a convertir ideas
            en pasos concretos.
          </p>
        </div>

        <div className="rounded-3xl bg-[#DACDF2] p-6 mb-6">
          <h3 className="font-bold text-xl mb-4 text-black">
            Lo que más podría ayudarte ahora
          </h3>

          <ul className="space-y-3 text-black">
            <li>✓ Mentoría estructurada</li>
            <li>✓ Exposición a experiencias reales</li>
            <li>✓ Pequeñas metas accionables</li>
            <li>✓ Conversaciones honestas sobre carreras</li>
          </ul>
        </div>

        <div className="rounded-3xl border border-gray-200 p-6 mb-8">
          <h3 className="font-bold text-xl mb-4 text-black">
            Te recomendamos mentoras que:
          </h3>

          <ul className="space-y-3 text-black">
            <li>✓ Hayan explorado múltiples caminos</li>
            <li>✓ Trabajen con estudiantes o early career</li>
            <li>✓ Ofrezcan acompañamiento cercano</li>
          </ul>
        </div>

        <button
          className="w-full rounded-2xl bg-[#824BE5] py-4 text-lg font-semibold text-white hover:opacity-90"
        
          onClick={() => router.push("/discover")}
        >
            Conocer mentoras
        </button>

      </div>
    </main>
  );
}

  return (
    <main className="min-h-screen bg-white px-6 py-10">
      <div className="mx-auto max-w-xl">

        {/* Barra */}
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-sm text-[#909090]">
            <span>
              Paso {paso + 1} de {menteeQuestions.length}
            </span>

            <span>
              {Math.round(porcentaje)}%
            </span>
          </div>

          <div className="h-2 w-full rounded-full bg-[#DACDF2]">
            <div
              className="h-2 rounded-full bg-[#824BE5]"
              style={{
                width: `${porcentaje}%`,
              }}
            />
          </div>
        </div>

        {/* Título */}
        <h1 className="mb-3 text-4xl font-bold text-black">
          {preguntaActual.title}
        </h1>

        <p className="mb-8 text-lg text-[#909090]">
          {preguntaActual.subtitle}
        </p>

        {/* SINGLE */}
        {preguntaActual.type === "single" && (
          <div className="space-y-4">
            {preguntaActual.options?.map((opcion) => (
              <button
                key={opcion}
                onClick={() =>
                  setSelectedOptions([opcion])
                }
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

        {/* MULTIPLE */}
        {preguntaActual.type === "multiple" && (
          <div className="flex flex-wrap gap-3">
            {preguntaActual.options?.map((opcion) => {
              const selected =
                selectedOptions.includes(opcion);

              return (
                <button
                  key={opcion}
                  onClick={() => {
                    if (selected) {
                      setSelectedOptions(
                        selectedOptions.filter(
                          (o) => o !== opcion
                        )
                      );
                    } else if (
                      selectedOptions.length <
                      (preguntaActual.maxSelections || 3)
                    ) {
                      setSelectedOptions([
                        ...selectedOptions,
                        opcion,
                      ]);
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

        {/* SCALE */}
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
                  onClick={() =>
                    setScaleValue(valor)
                  }
                  className={`h-14 w-14 rounded-full border text-lg font-semibold ${
                    scaleValue === valor
                      ? "bg-[#824BE5] text-white"
                      : "bg-white"
                  }`}
                >
                  {valor}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TEXT */}
        {preguntaActual.type === "text" && (
          <div>
            <textarea
              value={textAnswer}
              onChange={(e) =>
                setTextAnswer(e.target.value)
              }
              maxLength={250}
              rows={6}
              placeholder="Cuéntanos un poco más..."
              className="w-full rounded-2xl border p-4"
            />

            <div className="mt-2 text-right text-sm text-[#909090]">
              {textAnswer.length}/250
            </div>
          </div>
        )}

        {/* Botón */}
        <button
          disabled={!canContinue}
          onClick={handleContinue}
          className="mt-10 w-full rounded-2xl bg-[#824BE5] py-4 text-lg font-semibold text-white disabled:opacity-40"
        >
          Continuar
        </button>

        {/* Ayuda */}
        <div className="mt-10 rounded-2xl border border-gray-200 bg-gray-50 p-5">
          <h3 className="mb-2 text-base font-semibold text-black">
            ¿Por qué preguntamos esto?
          </h3>

          <p className="text-sm leading-relaxed text-gray-700">
            Queremos entender mejor tu contexto para conectarte con mentoras y oportunidades que realmente te ayuden a crecer.
          </p>
        </div>
      </div>
    </main>
  );
}