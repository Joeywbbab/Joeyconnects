import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// 只在有环境变量时创建客户端
export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export interface Memo {
  id: string;
  content: string;
  hashtags: string[];
  image_url?: string | null;
  image_name?: string | null;
  image_path?: string | null;
  created_at: string;
  updated_at: string;
}

export type VideoCategory = 'ytb tutorials' | 'cartoon' | 'life';

export interface Video {
  id: string;
  youtube_id: string;
  title?: string | null;
  description?: string | null;
  category: VideoCategory;
  thumbnail_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface YouTubeVideoInfo {
  title: string;
  description: string;
  thumbnailUrl: string;
}
