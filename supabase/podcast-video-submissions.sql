-- Podcast episode submission fields (mirror media table)
-- Run in Supabase SQL Editor

alter table public.podcast_episodes
  add column if not exists video_source text
    check (video_source is null or video_source in ('youtube_link'));

alter table public.podcast_episodes
  add column if not exists submission_status text not null default 'published'
    check (submission_status in ('pending', 'published', 'user_submitted'));

-- Backfill existing admin podcast episodes
update public.podcast_episodes
set
  video_source = coalesce(video_source, 'youtube_link'),
  submission_status = coalesce(submission_status, 'published')
where video_source is null or submission_status is null;

comment on column public.podcast_episodes.video_source is
  'youtube_link = admin YouTube embed (podcast only)';

comment on column public.podcast_episodes.submission_status is
  'published = live on /podcast; pending/user_submitted = awaiting review';
