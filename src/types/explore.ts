export interface Workshop {
  id: string;
  title: string;
  presenter: string;
  date: string;
  time: string;
  seats: number;
  emoji: string;
  imageUrl?: string; // TODO: Supabase Storage
}

export interface Story {
  id: string;
  title: string;
  authorName: string;
  emoji: string;
  thumbnailUrl?: string; // TODO: Supabase Storage
  videoUrl?: string;     // TODO: Supabase Storage
}

export interface RecommendedMentor {
  id: string;
  name: string;
  role: string;
  location: string;
  bio: string;
  avatar: string;
  avatarUrl?: string; // TODO: Supabase Storage
  rating: number;
  tags: string[];
}
