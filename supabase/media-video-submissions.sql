-- Video submission fields for user uploads and external links
-- Run in Supabase SQL Editor

alter table public.media
  add column if not exists video_source text
    check (video_source is null or video_source in ('upload', 'external_link', 'youtube_link'));

alter table public.media
  add column if not exists submission_status text not null default 'published'
    check (submission_status in ('pending', 'published', 'user_submitted'));

alter table public.media
  alter column storage_path drop not null;

-- Existing rows: mark published media as published
update public.media
set submission_status = 'published'
where submission_status is null or submission_status = 'published';

-- User-submitted videos awaiting review default to pending + unpublished
comment on column public.media.submission_status is
  'pending = awaiting review; user_submitted = submitted by member; published = live on feeds';
