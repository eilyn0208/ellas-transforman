"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ProfileView } from "@/types/profile";
import { mockMenteeProfile, mockMentorProfile } from "@/constants/profile";
import { IoAddOutline, IoCheckmarkCircle, IoSparklesOutline } from "react-icons/io5";
import AppHeader from "@/components/AppHeader";
import AppLayout from "@/components/AppLayout";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import { supabase } from "@/lib/supabase/client";

interface AssessmentResultRow {
  profile_name: string | null;
  profile_description: string | null;
  recommendations: { helpfulPoints: string[]; mentorTraits: string[] } | null;
}

function useProfileData(): {
  profile: ProfileView;
  loading: boolean;
  assessmentResult: AssessmentResultRow | null;
  mentorRole: string | null;
  availability: string | null;
} {
  const [profile, setProfile] = useState<ProfileView>(mockMenteeProfile);
  const [loading, setLoading] = useState(true);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResultRow | null>(null);
  const [mentorRole, setMentorRole] = useState<string | null>(null);
  const [availability, setAvailability] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();

      const role = user?.user_metadata?.role ?? localStorage.getItem("ellas_role");
      const isMentor = role === "mentor" || role === "mentora";

      const authName =
        user?.user_metadata?.full_name ??
        user?.user_metadata?.name ??
        user?.email ??
        "";

      if (isMentor) {
        const { data: mp, error: mpError } = user
          ? await supabase
              .from("mentor_profiles")
              .select("name, role, expertise, mentoring_style, availability")
              .eq("user_id", user.id)
              .maybeSingle()
          : { data: null, error: null };

        const expertise: string[] = Array.isArray(mp?.expertise)
          ? (mp!.expertise as unknown as string[])
          : [];
        const roleTag = mp?.role ? [mp.role as string] : [];
        const tags = [...roleTag, ...expertise].slice(0, 3);

        setMentorRole((mp?.role as string | null) ?? null);
        setAvailability((mp?.availability as string | null) ?? null);

        setProfile({
          ...mockMentorProfile,
          name: (mp?.name as string | null) || authName || mockMentorProfile.name,
          bio: (mp?.mentoring_style as string | null) ?? "",
          tags,
          specialties: expertise,
        });
      } else {
        const [profileRes, assessmentRes] = user
          ? await Promise.all([
              supabase
                .from("profiles")
                .select("full_name")
                .eq("id", user.id)
                .maybeSingle(),
              supabase
                .from("assessment_results")
                .select("profile_name, profile_description, recommendations")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false })
                .limit(1)
                .maybeSingle(),
            ])
          : [{ data: null, error: null }, { data: null, error: null }];

        const arRow = assessmentRes.data as AssessmentResultRow | null;
        const helpfulPoints = arRow?.recommendations?.helpfulPoints ?? [];

        setAssessmentResult(arRow);
        setProfile({
          ...mockMenteeProfile,
          name:
            (profileRes.data?.full_name as string | null) ||
            authName ||
            mockMenteeProfile.name,
          bio: arRow?.profile_description ?? "",
          tags: helpfulPoints.slice(0, 3),
        });
      }

      setLoading(false);
    }
    load();
  }, []);

  return { profile, loading, assessmentResult, mentorRole, availability };
}

function MenteeAssessmentCard({ result }: { result: AssessmentResultRow }) {
  const helpfulPoints = result.recommendations?.helpfulPoints ?? [];
  const mentorTraits = result.recommendations?.mentorTraits ?? [];

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 bg-brand rounded-full" />
        <span className="text-sm font-semibold text-gray-700">Tu perfil</span>
      </div>

      {result.profile_name && (
        <div>
          <p className="text-sm font-bold text-brand">{result.profile_name}</p>
          {result.profile_description && (
            <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
              {result.profile_description}
            </p>
          )}
        </div>
      )}

      {helpfulPoints.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Cómo podemos ayudarte
          </p>
          <ul className="space-y-2">
            {helpfulPoints.map((pt, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                <IoCheckmarkCircle className="text-brand text-base flex-shrink-0 mt-0.5" />
                {pt}
              </li>
            ))}
          </ul>
        </div>
      )}

      {mentorTraits.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Tu mentora ideal
          </p>
          <ul className="space-y-2">
            {mentorTraits.map((tr, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                <IoSparklesOutline className="text-brand text-base flex-shrink-0 mt-0.5" />
                {tr}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { profile, loading, assessmentResult, mentorRole, availability } = useProfileData();
  const [bio, setBio] = useState("");

  async function handleSignOut() {
    await supabase.auth.signOut();
    localStorage.removeItem("ellas_role");
    router.push("/welcome");
  }

  useEffect(() => {
    if (profile) setBio(profile.bio);
  }, [profile]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-brand-soft border-t-brand animate-spin" />
        </div>
      </AppLayout>
    );
  }

  const isMentee = profile.role === "mentee";

  return (
    <AppLayout>
      <AppHeader showBack />

      <main className="flex-1 overflow-y-auto">
        {/* Photo + name block */}
        <div className="bg-white px-5 pt-7 pb-5 flex flex-col items-center gap-3">
          <div className="w-24 h-24 rounded-full bg-brand-soft flex items-center justify-center text-4xl border-4 border-white shadow-md select-none">
            {profile.avatar}
          </div>
          <p className="text-xs text-gray-400">Foto de perfil</p>
          <div className="flex gap-3">
            <button className="bg-brand text-white text-xs font-semibold px-5 py-2 rounded-full hover:bg-brand-dark transition-colors">
              Subir foto
            </button>
            <button className="border border-brand text-brand text-xs font-semibold px-5 py-2 rounded-full hover:bg-brand-light transition-colors">
              Tomar foto
            </button>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">
            {profile.name}
          </h1>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Tu perfil — card IA, solo mentees */}
          {isMentee && assessmentResult && (
            <MenteeAssessmentCard result={assessmentResult} />
          )}

          {/* Short bio */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">
                Descripción
              </span>
              <span className="text-xs text-gray-400">80–200 caracteres</span>
            </div>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={200}
              rows={4}
              className="w-full text-sm text-gray-600 resize-none focus:outline-none leading-relaxed"
            />
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
              {profile.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          </div>

          {/* Mentor: Información de mentoría */}
          {!isMentee && (mentorRole || availability) && (
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-4 bg-brand rounded-full" />
                <span className="text-sm font-semibold text-gray-700">
                  Información de mentoría
                </span>
              </div>
              {mentorRole && (
                <div className="mb-3">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                    Rol profesional
                  </p>
                  <p className="text-sm font-semibold text-gray-800">{mentorRole}</p>
                </div>
              )}
              {availability && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                    Disponibilidad
                  </p>
                  <p className="text-sm text-gray-700">{availability}</p>
                </div>
              )}
            </div>
          )}

          {/* Education */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-700">
                Educación
              </span>
              <span className="text-xs text-gray-400">Opcional</span>
            </div>
            {profile.education.map((edu) => (
              <div key={edu.id} className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center text-lg flex-shrink-0">
                  {edu.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 leading-tight">
                    {edu.institution}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {edu.degree} · {edu.year}
                  </p>
                </div>
                <button
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-brand hover:text-brand transition-colors flex-shrink-0"
                  aria-label="Editar educación"
                >
                  <IoAddOutline className="text-base" />
                </button>
              </div>
            ))}
            <button className="text-brand text-xs font-medium hover:underline">
              + Agregar institución o certificado
            </button>
          </div>

          {/* Mentee: Current Mentors | Mentor: Mentees actuales */}
          {isMentee && profile.role === "mentee" ? (
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-teal-400 rounded-full" />
                  <span className="text-sm font-semibold text-gray-700">
                    Mis mentoras
                  </span>
                </div>
                <button
                  onClick={() => router.push("/discover")}
                  className="text-brand text-xs font-medium hover:underline"
                >
                  Ver todas
                </button>
              </div>
              <div className="flex gap-4">
                {profile.connectedMentors.map((mentor) => (
                  <div
                    key={mentor.id}
                    className="flex-1 flex flex-col items-center text-center gap-1.5"
                  >
                    <div className="w-14 h-14 rounded-full bg-brand-soft flex items-center justify-center text-2xl">
                      {mentor.avatar}
                    </div>
                    <p className="text-xs font-semibold text-gray-800 leading-tight">
                      {mentor.name}
                    </p>
                    <p className="text-[10px] text-gray-500">{mentor.role}</p>
                    {mentor.isVerified && (
                      <span className="text-[10px] bg-teal-50 text-teal-600 font-semibold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        <IoCheckmarkCircle className="text-xs" />
                        Verificada
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            !isMentee &&
            profile.role === "mentor" && (
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-teal-400 rounded-full" />
                    <span className="text-sm font-semibold text-gray-700">
                      Mentees actuales
                    </span>
                  </div>
                  <button className="text-brand text-xs font-medium hover:underline">
                    Ver todas
                  </button>
                </div>
                <div className="flex gap-4">
                  {profile.currentMentees.map((mentee) => (
                    <div
                      key={mentee.id}
                      className="flex-1 flex flex-col items-center text-center gap-1.5"
                    >
                      <div className="w-14 h-14 rounded-full bg-brand-soft flex items-center justify-center text-2xl">
                        {mentee.avatar}
                      </div>
                      <p className="text-xs font-semibold text-gray-800 leading-tight">
                        {mentee.name}
                      </p>
                      <p className="text-[10px] text-gray-500">{mentee.goal}</p>
                      {mentee.isVerified && (
                        <span className="text-[10px] bg-teal-50 text-teal-600 font-semibold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                          <IoCheckmarkCircle className="text-xs" />
                          Verificada
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          )}

          {/* Mentor: Especialidades */}
          {!isMentee && profile.role === "mentor" && (
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-4 bg-brand rounded-full" />
                <span className="text-sm font-semibold text-gray-700">
                  Especialidades
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.specialties.map((s) => (
                  <Badge key={s}>{s}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Active Goals — solo para mentees */}
          {isMentee && (
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-brand rounded-full" />
                  <span className="text-sm font-semibold text-gray-700">
                    Metas activas
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {profile.activeGoal.inProgressCount} en progreso
                </span>
              </div>
              <p className="text-sm font-bold text-gray-800 mb-2.5">
                {profile.activeGoal.title}
              </p>
              <div className="flex items-center gap-2 mb-1.5">
                <ProgressBar
                  percent={profile.activeGoal.progressPercent}
                  size="md"
                  className="flex-1"
                />
                <span className="text-xs font-bold text-brand flex-shrink-0">
                  {profile.activeGoal.progressPercent}%
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                {profile.activeGoal.milestoneLabel}
              </p>
              <button
                onClick={() => router.push("/roadmap")}
                className="text-xs font-semibold text-brand border border-brand px-4 py-2 rounded-full hover:bg-brand-light transition-colors"
              >
                Ver Roadmap
              </button>
            </div>
          )}

          {/* Logros */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-yellow-400 rounded-full" />
                <span className="text-sm font-semibold text-gray-700">
                  Logros
                </span>
              </div>
              <span className="text-xs text-gray-400">{profile.updatedLabel}</span>
            </div>
            <div className="space-y-2">
              {profile.logros.map((logro) => (
                <div
                  key={logro.id}
                  className="flex items-center gap-3 bg-brand-soft/30 rounded-xl p-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center text-xl flex-shrink-0">
                    {logro.emoji}
                  </div>
                  <p className="flex-1 text-sm font-semibold text-gray-800">
                    {logro.title}
                  </p>
                  <button className="text-xs font-semibold text-brand hover:underline flex-shrink-0">
                    Ver
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Programas actuales */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-green-400 rounded-full" />
                <span className="text-sm font-semibold text-gray-700">
                  {isMentee ? "Programas actuales" : "Programas activos"}
                </span>
              </div>
              <button className="text-brand text-xs font-medium hover:underline">
                Ver todos
              </button>
            </div>
            <div className="space-y-3">
              {profile.activePrograms.map((prog) => (
                <div key={prog.id} className="flex gap-3 items-center">
                  <div className="w-14 h-14 rounded-xl bg-brand-soft flex items-center justify-center text-2xl flex-shrink-0">
                    {prog.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 leading-tight">
                      {prog.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {prog.coachInfo}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">
                        {prog.currentLesson} de {prog.totalLessons}
                      </span>
                      <button className="text-xs font-semibold text-white bg-brand px-4 py-1.5 rounded-full hover:bg-brand-dark transition-colors">
                        Continuar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comunidad */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-brand rounded-full" />
                <span className="text-sm font-semibold text-gray-700">
                  Comunidad
                </span>
              </div>
              <span className="text-xs text-gray-400">
                {profile.communityStats.totalLabel} /{" "}
                {profile.communityStats.onlineLabel}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-3 pl-3">
              Recursos, eventos y soporte
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => router.push("/explore")}
                className="flex-1 text-xs font-semibold text-brand border border-brand py-2.5 rounded-full hover:bg-brand-light transition-colors"
              >
                Explorar recursos
              </button>
              <button
                onClick={() =>
                  router.push(isMentee ? "/discover" : "/mentor/mentees")
                }
                className="flex-1 text-xs font-semibold text-white bg-brand py-2.5 rounded-full hover:bg-brand-dark transition-colors"
              >
                {isMentee ? "Conectar con mentora" : "Ver comunidad"}
              </button>
            </div>
          </div>
          {/* Cerrar sesión */}
          <button
            onClick={handleSignOut}
            className="w-full text-sm font-semibold text-red-500 border border-red-200 py-3 rounded-2xl hover:bg-red-50 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </main>
    </AppLayout>
  );
}
