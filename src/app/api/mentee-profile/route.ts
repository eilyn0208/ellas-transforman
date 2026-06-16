import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Type } from "@google/genai";
import { gemini } from "@/lib/gemini/client";
import { menteeQuestions } from "@/constants/mentee-questions";

const menteeProfileSchema = z.object({
  title: z.string(),
  description: z.string(),
  helpfulPoints: z.array(z.string()),
  mentorTraits: z.array(z.string()),
});

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    description: { type: Type.STRING },
    helpfulPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
    mentorTraits: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ["title", "description", "helpfulPoints", "mentorTraits"],
};

const SYSTEM_PROMPT = `Eres parte de "Ellas Transforman", una plataforma que conecta a mujeres jóvenes (mentees) con mentoras profesionales.

A partir de las respuestas del cuestionario de onboarding de una mentee, genera un perfil personalizado y motivador en español.

Devuelve:
- title: un nombre corto e inspirador para su perfil (2-4 palabras, ej: "Future Builder", "Exploradora Curiosa", "Líder en Construcción").
- description: un párrafo cálido (3-4 frases), dirigido a ella en segunda persona ("tú"), que refleje su situación actual, intereses y lo que busca.
- helpfulPoints: una lista de 3 a 5 frases cortas sobre el tipo de apoyo que más le ayudaría ahora mismo, basadas en sus respuestas.
- mentorTraits: una lista de 2 a 4 frases cortas describiendo características que deberían tener las mentoras recomendadas para ella.

Mantén un tono cercano, cálido y motivador.`;

export async function POST(request: NextRequest) {
  let body: { answers?: Record<string, unknown> };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const { answers } = body;

  if (!answers || typeof answers !== "object") {
    return NextResponse.json({ error: "Respuestas inválidas" }, { status: 400 });
  }

  const respuestasTexto = menteeQuestions
    .map((pregunta) => {
      const respuesta = answers[pregunta.id];

      if (respuesta === undefined || respuesta === null || respuesta === "") {
        return null;
      }

      const valor = Array.isArray(respuesta)
        ? respuesta.join(", ")
        : String(respuesta);

      return `- ${pregunta.title}: ${valor}`;
    })
    .filter(Boolean)
    .join("\n");

  try {
    const response = await gemini.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: respuestasTexto,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema,
      },
    });

    const texto = response.text;

    if (!texto) {
      return NextResponse.json(
        { error: "No se pudo generar el perfil" },
        { status: 502 }
      );
    }

    const perfil = menteeProfileSchema.safeParse(JSON.parse(texto));

    if (!perfil.success) {
      return NextResponse.json(
        { error: "No se pudo generar el perfil" },
        { status: 502 }
      );
    }

    return NextResponse.json(perfil.data);
  } catch (error) {
    console.error("Error generando perfil con IA:", error);
    return NextResponse.json(
      { error: "Error generando el perfil" },
      { status: 500 }
    );
  }
}
