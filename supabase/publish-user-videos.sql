-- Publish existing user-uploaded videos that were saved as unpublished
-- Run once in Supabase SQL Editor if older uploads are missing from /videos

update public.media
set
  is_published = true,
  submission_status = 'published'
where type = 'video'
  and is_published = false;
