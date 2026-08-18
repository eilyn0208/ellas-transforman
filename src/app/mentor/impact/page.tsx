"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import {
  IoTrophyOutline,
  IoTimeOutline,
  IoPeopleOutline,
  IoStarOutline,
  IoSparklesOutline,
  IoRibbonOutline,
  IoSchoolOutline,
  IoTrendingUpOutline,
  IoChatbubbleOutline,
} from "react-icons/io5";
import AppHeader from "@/components/AppHeader";
import AppLayout from "@/components/AppLayout";
import NotificationBell from "@/components/NotificationBell";

const BRAND = "#824be5";

interface ImpactData {
  totalSessions: number;
  totalHours: number;
  menteesActive: number;
  growthTrend: number[];
}

function buildWeeklyTrend(bookings: { scheduled_at: string }[]): number[] {
  const counts = [0, 0, 0, 0, 0, 0];
  const now = Date.now();
  const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
  for (const b of bookings) {
    const diffWeeks = Math.floor((now - new Date(b.scheduled_at).getTime()) / WEEK_MS);
    const idx = 5 - diffWeeks;
    if (idx >= 0 && idx <= 5) counts[idx]++;
  }
  return counts;
}

function buildAIText(sessions: number, mentees: number): string {
  if (sessions === 0)
    return "Completa tu perfil y conecta con tu primera mentee para comenzar a generar impacto.";
  if (sessions === 1)
    return "Diste tu primera sesión. El primer paso siempre es el más importante.";
  if (sessions < 10)
    return `Llevas ${sessions} sesiones con ${mentees} ${mentees === 1 ? "mentee" : "mentees"}. La consistencia es la clave del impacto real.`;
  return `Con ${sessions} sesiones y ${mentees} ${mentees === 1 ? "mentee" : "mentees"} acompañadas, estás construyendo una huella real en EllasTransforman.`;
}

function Sparkline({ data, color = BRAND }: { data: number[]; color?: string }) {
  const W = 300;
  const H = 56;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * W,
    y: H - ((v - min) / range) * (H * 0.85),
  }));

  const line = pts.reduce(
    (d, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${d} L ${p.x} ${p.y}`),
    ""
  );
  const area = `${line} L ${W} ${H} L 0 ${H} Z`;
  const gradId = "sg-impact";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-14" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} />
      <path d={line} stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3.5" fill={color} />
      ))}
    </svg>
  );
}

function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${percent}%`, background: BRAND }}
      />
    </div>
  );
}

function SectionHeader({ title, icon }: { title: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span style={{ color: BRAND }}>{icon}</span>
      <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">{title}</h2>
    </div>
  );
}

function HeroStatsBand({ data }: { data: ImpactData }) {
  const stats = [
    { icon: <IoTrophyOutline className="text-xl" />, value: data.totalSessions, label: "Sesiones" },
    { icon: <IoTimeOutline className="text-xl" />, value: `${data.totalHours}h`, label: "Horas" },
    { icon: <IoPeopleOutline className="text-xl" />, value: data.menteesActive, label: "Activas" },
    { icon: <IoStarOutline className="text-xl" />, value: "—", label: "Calificación" },
  ];

  return (
    <div
      className="rounded-2xl p-5 relative overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${BRAND} 0%, #a06af0 100%)` }}
    >
      <div className="absolute right-3 top-2 text-6xl opacity-15 select-none leading-none">🌍</div>
      <div className="relative">
        <p className="text-white/70 text-xs font-semibold uppercase tracking-wide mb-1">
          Mi impacto acumulado
        </p>
        <p className="text-white text-lg font-bold mb-4">
          Transformando carreras, una sesión a la vez ✨
        </p>
        <div className="grid grid-cols-4 gap-2">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-white mx-auto mb-1">
                {s.icon}
              </div>
              <p className="text-white font-bold text-sm">{s.value}</p>
              <p className="text-white/60 text-[10px]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MentorLevelCard() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm text-center">
      <p className="text-3xl mb-2">🌱</p>
      <p className="text-sm font-semibold text-gray-700">Sistema de niveles</p>
      <p className="text-xs text-gray-400 mt-1 leading-relaxed">
        Tu nivel aparecerá cuando completes tus primeras sesiones de mentoría
      </p>
    </div>
  );
}

function GrowthTrendCard({ data }: { data: ImpactData }) {
  const allZero = data.growthTrend.every((v) => v === 0);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-gray-400">Sesiones acumuladas — últimas 6 semanas</p>
        <span
          className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
          style={{ color: BRAND, background: "#ede9fe" }}
        >
          Sesiones
        </span>
      </div>

      {allZero ? (
        <div className="h-14 flex items-center justify-center">
          <p className="text-xs text-gray-400">Sin sesiones registradas aún</p>
        </div>
      ) : (
        <Sparkline data={data.growthTrend} />
      )}

      <div className="flex items-center justify-between border-t border-gray-50 pt-3 mt-2">
        <div>
          <p className="text-xs text-gray-400">Total acumulado</p>
          <p className="text-sm font-bold" style={{ color: BRAND }}>{data.totalSessions} sesiones</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Mentees activas</p>
          <p className="text-sm font-bold text-gray-700">{data.menteesActive} mentees</p>
        </div>
      </div>
    </div>
  );
}

function BadgesSection() {
  return (
    <section>
      <SectionHeader title="Reconocimientos" icon={<IoRibbonOutline className="text-base" />} />
      <div className="bg-white rounded-2xl px-5 py-8 shadow-sm text-center">
        <p className="text-2xl mb-2">🏅</p>
        <p className="text-sm font-semibold text-gray-700">Sin reconocimientos aún</p>
        <p className="text-xs text-gray-400 mt-1 leading-relaxed">
          Tus logros como mentora aparecerán aquí conforme avances en el programa
        </p>
      </div>
    </section>
  );
}

function MenteeAchievementsSection() {
  return (
    <section>
      <SectionHeader title="Logros de mis mentees" icon={<IoTrophyOutline className="text-base" />} />
      <div className="bg-white rounded-2xl px-5 py-8 shadow-sm text-center">
        <p className="text-2xl mb-2">🎯</p>
        <p className="text-sm font-semibold text-gray-700">Aún no hay logros registrados</p>
        <p className="text-xs text-gray-400 mt-1 leading-relaxed">
          Los hitos de tus mentees aparecerán aquí cuando los alcancen
        </p>
      </div>
    </section>
  );
}

function CertificationsSection() {
  return (
    <section>
      <SectionHeader title="Certificaciones" icon={<IoSchoolOutline className="text-base" />} />
      <div className="bg-white rounded-2xl px-5 py-8 shadow-sm text-center">
        <p className="text-2xl mb-2">🎓</p>
        <p className="text-sm font-semibold text-gray-700">Sin certificaciones aún</p>
        <p className="text-xs text-gray-400 mt-1 leading-relaxed">
          Completa los programas de EllasTransforman para obtener tus primeras certificaciones
        </p>
      </div>
    </section>
  );
}

function AIRecommendationCard({ data }: { data: ImpactData }) {
  const router = useRouter();
  const text = buildAIText(data.totalSessions, data.menteesActive);

  return (
    <div className="rounded-2xl p-4 shadow-sm border border-brand-soft bg-brand-soft/30">
      <div className="flex items-center gap-2 mb-2">
        <IoSparklesOutline className="text-brand text-base" />
        <p className="text-xs font-bold uppercase tracking-wide text-brand">
          Acción recomendada
        </p>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed mb-3">{text}</p>
      <button
        onClick={() => router.push("/mentor/mentees")}
        className="text-xs font-semibold text-brand hover:underline flex items-center gap-1"
      >
        Ver mis mentees →
      </button>
    </div>
  );
}

export default function MiImpactoPage() {
  const router = useRouter();
  const [data, setData] = useState<ImpactData | null>(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setData({ totalSessions: 0, totalHours: 0, menteesActive: 0, growthTrend: [0, 0, 0, 0, 0, 0] });
        return;
      }

      const { data: rows } = await supabase
        .from("bookings")
        .select("mentee_id, duration_min, scheduled_at")
        .eq("mentor_id", user.id);

      const bookings = rows ?? [];
      const totalSessions = bookings.length;
      const totalMins = bookings.reduce((sum, b) => sum + (b.duration_min ?? 30), 0);
      const totalHours = Math.round((totalMins / 60) * 10) / 10;
      const uniqueMentees = new Set(bookings.map((b) => b.mentee_id)).size;
      const growthTrend = buildWeeklyTrend(bookings);

      setData({ totalSessions, totalHours, menteesActive: uniqueMentees, growthTrend });
    }
    load();
  }, []);

  const rightSlot = (
    <>
      <NotificationBell />
      <button
        onClick={() => router.push("/messages")}
        className="w-9 h-9 rounded-full bg-brand-soft flex items-center justify-center text-brand hover:bg-brand-soft/80 transition-colors"
      >
        <IoChatbubbleOutline className="text-lg" />
      </button>
    </>
  );

  if (!data) {
    return (
      <AppLayout>
        <AppHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-soft border-t-brand" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <AppHeader rightSlot={rightSlot} />
      <main className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Mi Impacto</h1>
          <p className="text-xs text-gray-500 mt-0.5">Tu huella como mentora en EllasTransforman</p>
        </div>
        <HeroStatsBand data={data} />
        <MentorLevelCard />
        <section>
          <SectionHeader title="Tendencia de crecimiento" icon={<IoTrendingUpOutline className="text-base" />} />
          <GrowthTrendCard data={data} />
        </section>
        <BadgesSection />
        <MenteeAchievementsSection />
        <CertificationsSection />
        <AIRecommendationCard data={data} />
      </main>
    </AppLayout>
  );
}
