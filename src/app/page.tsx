"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function BeginPage() {
  const router = useRouter();

  return (
    <main className="h-screen w-screen overflow-hidden">
      <div className="relative h-screen w-full">
        <Image
          src="/images/begin.jpeg"
          alt="Ellas Transforman"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute bottom-36 left-6 right-6 max-w-full text-white">
          <h1 className="mb-4 break-words text-4xl font-bold leading-tight">
            EllasTransforman
          </h1>

          <p className="text-lg leading-relaxed">
            Transform your career with trusted mentors, warm guidance, and a
            community that uplifts you.
          </p>
        </div>

        <button
          onClick={() => router.push("/welcome")}
          className="absolute bottom-10 left-6 right-6 rounded-2xl bg-brand py-4 text-lg font-semibold text-white shadow-lg hover:bg-brand-dark transition-colors"
        >
          Comenzar
        </button>
      </div>
    </main>
  );
}