import { supabase } from "@/lib/supabase/client";

export interface MentorProfileSummary {
  user_id: string;
  name: string;
}

export async function getMentorProfile(
  mentorId: string
): Promise<MentorProfileSummary | null> {
  const { data, error } = await supabase
    .from("mentor_profiles")
    .select("user_id, name")
    .eq("user_id", mentorId)
    .single();

  if (error || !data) return null;
  return data;
}
