-- ============================================================
-- PODCAST EPISODES (YouTube)
-- Run in Supabase SQL Editor if upgrading an existing project.
-- ============================================================

create table if not exists public.podcast_episodes (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles (id) on delete cascade,
  title             text not null,
  description       text,
  youtube_url       text not null,
  youtube_video_id  text not null,
  video_source      text check (video_source is null or video_source in ('youtube_link')),
  submission_status text not null default 'published'
    check (submission_status in ('pending', 'published', 'user_submitted')),
  created_at        timestamptz not null default now(),
  constraint title_length check (char_length(title) >= 2),
  constraint youtube_video_id_length check (char_length(youtube_video_id) = 11)
);

create index if not exists podcast_episodes_user_id_idx
  on public.podcast_episodes (user_id);

create index if not exists podcast_episodes_created_at_idx
  on public.podcast_episodes (created_at desc);

alter table public.podcast_episodes enable row level security;

create policy "Podcast episodes are viewable by everyone"
  on public.podcast_episodes for select
  using (true);

create policy "Authenticated users can submit podcast episodes"
  on public.podcast_episodes for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own podcast episodes"
  on public.podcast_episodes for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own podcast episodes"
  on public.podcast_episodes for delete
  using (auth.uid() = user_id);
