-- ============================================================
-- Shunya Bodha — Database setup verification
-- Run in Supabase SQL Editor. All rows should show status = 'OK'
-- ============================================================

with checks as (
  select 'likes table' as item,
    case when exists (
      select 1 from information_schema.tables
      where table_schema = 'public' and table_name = 'likes'
    ) then 'OK' else 'MISSING — run likes.sql' end as status

  union all
  select 'media.video_source column',
    case when exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = 'media' and column_name = 'video_source'
    ) then 'OK' else 'MISSING — run media-video-submissions.sql' end

  union all
  select 'media.submission_status column',
    case when exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = 'media' and column_name = 'submission_status'
    ) then 'OK' else 'MISSING — run media-video-submissions.sql' end

  union all
  select 'podcast_episodes.video_source column',
    case when exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = 'podcast_episodes' and column_name = 'video_source'
    ) then 'OK' else 'MISSING — run podcast-video-submissions.sql' end

  union all
  select 'podcast_episodes.submission_status column',
    case when exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = 'podcast_episodes' and column_name = 'submission_status'
    ) then 'OK' else 'MISSING — run podcast-video-submissions.sql' end

  union all
  select 'comments table',
    case when exists (
      select 1 from information_schema.tables
      where table_schema = 'public' and table_name = 'comments'
    ) then 'OK' else 'MISSING — run schema.sql' end

  union all
  select 'contact_messages table',
    case when exists (
      select 1 from information_schema.tables
      where table_schema = 'public' and table_name = 'contact_messages'
    ) then 'OK' else 'MISSING — run contact.sql' end

  union all
  select 'admin contact RLS policy',
    case when exists (
      select 1 from pg_policies
      where schemaname = 'public'
        and tablename = 'contact_messages'
        and policyname = 'Only admin can view contact messages'
    ) then 'OK' else 'MISSING — run contact-rls-admin.sql' end

  union all
  select 'likes RLS policies',
    case when (
      select count(*) from pg_policies
      where schemaname = 'public' and tablename = 'likes'
    ) >= 3 then 'OK' else 'MISSING — run likes.sql' end
)
select * from checks order by item;

-- Optional: quick counts
select 'published videos' as metric, count(*)::text as value
from public.media where type = 'video' and is_published = true
union all
select 'podcast episodes', count(*)::text from public.podcast_episodes
union all
select 'total likes', count(*)::text from public.likes
union all
select 'total comments', count(*)::text from public.comments;
