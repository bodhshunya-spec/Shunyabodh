export type Profile = {
  id: string;
  username: string | null;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Article = {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  cover_image_url: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type VideoSource = "upload" | "external_link" | "youtube_link";

export type SubmissionStatus = "pending" | "published" | "user_submitted";

export type Media = {
  id: string;
  user_id: string;
  type: "photo" | "video";
  title: string | null;
  description: string | null;
  url: string;
  storage_path: string | null;
  video_source: VideoSource | null;
  submission_status: SubmissionStatus;
  is_published: boolean;
  created_at: string;
};

export type PodcastEpisode = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  youtube_url: string;
  youtube_video_id: string;
  video_source: VideoSource;
  submission_status: SubmissionStatus;
  created_at: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

export type Comment = {
  id: string;
  user_id: string;
  article_id: string | null;
  media_id: string | null;
  content: string;
  created_at: string;
  updated_at: string;
};

export type Like = {
  id: string;
  user_id: string;
  article_id: string | null;
  media_id: string | null;
  created_at: string;
};
