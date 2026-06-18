"use client";

import { useRouter } from "next/navigation";
import {
  IoTrophyOutline,
  IoTimeOutline,
  IoPeopleOutline,
  IoStarOutline,
  IoSparklesOutline,
  IoRibbonOutline,
  IoSchoolOutline,
  IoTrendingUpOutline,
  IoNotificationsOutline,
  IoChatbubbleOutline,
  IoCheckmarkCircle,
} from "react-icons/io5";
import AppHeader from "@/components/AppHeader";
import AppLayout from "@/components/AppLayout";
import { mockMentorImpact } from "@/constants/mentor-impact";
import type { MentorBadge, MentorCertification, MenteeAchievement } from "@/types/mentor";

const MENTOR_GREEN = "#2d6a4f";
const MENTOR_MID = "#40916c";

function Sparkline({ data, color = MENTOR_MID }: { data: number[]; color?: string }) {
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
  const gradId = `sg-impact`;

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
        style={{ width: `${percent}%`, background: MENTOR_MID }}
      />
    </div>
  );
}

function SectionHeader({ title, icon }: { title: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span style={{ color: MENTOR_MID }}>{icon}</span>
      <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">{title}</h2>
    </div>
  );
}

function HeroStatsBand() {
  const d = mockMentorImpact;
  const stats = [
    { icon: <IoTrophyOutline className="text-xl" />, value: d.totalSessions, label: "Sesiones" },
    { icon: <IoTimeOutline className="text-xl" />, value: `${d.totalHours}h`, label: "Horas" },
    { icon: <IoPeopleOutline className="text-xl" />, value: d.menteesActive, label: "Activas" },
    { icon: <IoStarOutline className="text-xl" />, value: d.avgRating, label: "Rating" },
  ];

  return (
    <div
      className="rounded-2xl p-5 relative overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${MENTOR_GREEN} 0%, ${MENTOR_MID} 100%)` }}
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
  const { level } = mockMentorImpact;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{level.currentEmoji}</span>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Nivel actual</p>
            <p className="text-sm font-bold text-gray-900">{level.current}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Siguiente</p>
          <p className="text-xs font-semibold" style={{ color: MENTOR_MID }}>{level.nextLevel}</p>
        </div>
      </div>
      <ProgressBar percent={level.progressPercent} />
      <div className="flex items-center justify-between mt-2">
        <p className="text-[10px] text-gray-400">{level.points} pts</p>
        <p className="text-[10px] text-gray-400">Faltan {level.pointsToNext} pts</p>
      </div>
    </div>
  );
}

function GrowthTrendCard() {
  const d = mockMentorImpact;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-gray-400">{d.growthTrendLabel}</p>
        <span
          className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
          style={{ color: MENTOR_MID, background: "#d1fae5" }}
        >
          Sesiones
        </span>
      </div>
      <Sparkline data={d.growthTrend} />
      <div className="flex items-center justify-between border-t border-gray-50 pt-3 mt-2">
        <div>
          <p className="text-xs text-gray-400">Total acumulado</p>
          <p className="text-sm font-bold" style={{ color: MENTOR_MID }}>{d.totalSessions} sesiones</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Graduadas</p>
          <p className="text-sm font-bold text-emerald-600">{d.menteesGraduated} mentees</p>
        </div>
      </div>
    </div>
  );
}

function BadgesSection() {
  const { badges } = mockMentorImpact;

  return (
    <section>
      <SectionHeader title="Reconocimientos" icon={<IoRibbonOutline className="text-base" />} />
      <div className="grid grid-cols-3 gap-2">
        {badges.map((badge: MentorBadge) => (
          <div key={badge.id} className="bg-white rounded-xl p-3 shadow-sm text-center">
            <span className="text-2xl">{badge.emoji}</span>
            <p className="text-[11px] font-bold text-gray-800 mt-1 leading-tight">{badge.title}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{badge.earnedAt}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function MenteeAchievementsSection() {
  const { menteeAchievements } = mockMentorImpact;

  return (
    <section>
      <SectionHeader title="Logros de mis mentees" icon={<IoTrophyOutline className="text-base" />} />
      <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-50">
        {menteeAchievements.map((a: MenteeAchievement) => (
          <div key={a.id} className="px-4 py-3 flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-base flex-shrink-0">
              {a.menteeAvatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <IoCheckmarkCircle className="text-emerald-500 text-sm flex-shrink-0" />
                <p className="text-xs font-semibold text-gray-900 leading-snug">{a.menteeName}</p>
              </div>
              <p className="text-xs text-gray-600 leading-snug">{a.achievement}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{a.dateLabel}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CertificationsSection() {
  const { certifications } = mockMentorImpact;

  return (
    <section>
      <SectionHeader title="Certificaciones" icon={<IoSchoolOutline className="text-base" />} />
      <div className="space-y-2">
        {certifications.map((cert: MentorCertification) => (
          <div key={cert.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
            <span className="text-2xl flex-shrink-0">{cert.badge}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 leading-tight">{cert.title}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{cert.issuer} · {cert.issuedAt}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function AIRecommendationCard() {
  const { aiRecommendation } = mockMentorImpact;
  const router = useRouter();

  return (
    <div
      className="rounded-2xl p-4 shadow-sm border"
      style={{ borderColor: "#d1fae5", background: "#f0fdf4" }}
    >
      <div className="flex items-center gap-2 mb-2">
        <IoSparklesOutline style={{ color: MENTOR_MID }} className="text-base" />
        <p className="text-xs font-bold uppercase tracking-wide" style={{ color: MENTOR_MID }}>
          Recomendación IA
        </p>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed mb-3">{aiRecommendation}</p>
      <button
        onClick={() => router.push("/mentor/mentees")}
        className="text-xs font-semibold hover:underline flex items-center gap-1"
        style={{ color: MENTOR_MID }}
      >
        Ver mis mentees →
      </button>
    </div>
  );
}

export default function MiImpactoPage() {
  const router = useRouter();

  const rightSlot = (
    <>
      <button className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 hover:bg-emerald-100 transition-colors relative">
        <IoNotificationsOutline className="text-lg" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full" />
      </button>
      <button
        onClick={() => router.push("/messages")}
        className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 hover:bg-emerald-100 transition-colors"
      >
        <IoChatbubbleOutline className="text-lg" />
      </button>
    </>
  );

  return (
    <AppLayout>
      <AppHeader rightSlot={rightSlot} />

      <main className="flex-1 overflow-y-auto px-5 py-5 space-y-5 pb-28">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Mi Impacto</h1>
          <p className="text-xs text-gray-500 mt-0.5">Tu huella como mentora en EllasTransforman</p>
        </div>

        <HeroStatsBand />

        <MentorLevelCard />

        <section>
          <SectionHeader title="Tendencia de crecimiento" icon={<IoTrendingUpOutline className="text-base" />} />
          <GrowthTrendCard />
        </section>

        <BadgesSection />

        <MenteeAchievementsSection />

        <CertificationsSection />

        <AIRecommendationCard />
      </main>
    </AppLayout>
  );
}
