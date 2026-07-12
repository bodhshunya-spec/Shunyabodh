-- ============================================================
-- Shunya — Supabase Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- Extensions
create extension if not exists "pgcrypto";

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  username    text unique,
  full_name   text,
  bio         text,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint username_length check (char_length(username) >= 3)
);

-- Auto-create profile when a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ============================================================
-- ARTICLES
-- ============================================================
create table public.articles (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.profiles (id) on delete cascade,
  title            text not null,
  slug             text not null unique,
  content          text not null,
  excerpt          text,
  cover_image_url  text,
  is_published     boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint title_length check (char_length(title) >= 3)
);

create index articles_user_id_idx on public.articles (user_id);
create index articles_published_idx on public.articles (is_published, created_at desc);

create trigger articles_updated_at
  before update on public.articles
  for each row execute function public.set_updated_at();

-- ============================================================
-- MEDIA (photos & videos)
-- ============================================================
create table public.media (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles (id) on delete cascade,
  type              text not null check (type in ('photo', 'video')),
  title             text,
  description       text,
  url               text not null,
  storage_path      text,
  video_source      text
    check (video_source is null or video_source in ('upload', 'external_link', 'youtube_link')),
  submission_status text not null default 'published'
    check (submission_status in ('pending', 'published', 'user_submitted')),
  is_published      boolean not null default true,
  created_at        timestamptz not null default now()
);

create index media_user_id_idx on public.media (user_id);
create index media_type_idx on public.media (type, created_at desc);

-- ============================================================
-- COMMENTS (on articles OR media — never both)
-- ============================================================
create table public.comments (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  article_id  uuid references public.articles (id) on delete cascade,
  media_id    uuid references public.media (id) on delete cascade,
  content     text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint comment_target check (
    (article_id is not null and media_id is null)
    or (article_id is null and media_id is not null)
  ),
  constraint content_length check (char_length(content) >= 1)
);

create index comments_article_id_idx on public.comments (article_id);
create index comments_media_id_idx on public.comments (media_id);

create trigger comments_updated_at
  before update on public.comments
  for each row execute function public.set_updated_at();

-- ============================================================
-- LIKES (on articles OR media — never both)
-- ============================================================
create table public.likes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  article_id  uuid references public.articles (id) on delete cascade,
  media_id    uuid references public.media (id) on delete cascade,
  created_at  timestamptz not null default now(),
  constraint like_target check (
    (article_id is not null and media_id is null)
    or (article_id is null and media_id is not null)
  )
);

create unique index likes_user_article_idx
  on public.likes (user_id, article_id)
  where article_id is not null;

create unique index likes_user_media_idx
  on public.likes (user_id, media_id)
  where media_id is not null;

create index likes_article_id_idx on public.likes (article_id);
create index likes_media_id_idx on public.likes (media_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles  enable row level security;
alter table public.articles  enable row level security;
alter table public.media     enable row level security;
alter table public.comments  enable row level security;
alter table public.likes     enable row level security;

-- PROFILES policies
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ARTICLES policies
create policy "Published articles are viewable by everyone"
  on public.articles for select
  using (is_published = true or auth.uid() = user_id);

create policy "Authenticated users can create articles"
  on public.articles for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own articles"
  on public.articles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own articles"
  on public.articles for delete
  using (auth.uid() = user_id);

-- MEDIA policies
create policy "Published media is viewable by everyone"
  on public.media for select
  using (is_published = true or auth.uid() = user_id);

create policy "Authenticated users can upload media"
  on public.media for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own media"
  on public.media for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own media"
  on public.media for delete
  using (auth.uid() = user_id);

-- COMMENTS policies
create policy "Comments are viewable by everyone"
  on public.comments for select
  using (true);

create policy "Authenticated users can post comments"
  on public.comments for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own comments"
  on public.comments for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own comments"
  on public.comments for delete
  using (auth.uid() = user_id);

-- LIKES policies
create policy "Likes are viewable by everyone"
  on public.likes for select
  using (true);

create policy "Authenticated users can like content"
  on public.likes for insert
  with check (auth.uid() = user_id);

create policy "Users can remove their own likes"
  on public.likes for delete
  using (auth.uid() = user_id);

-- ============================================================
-- PODCAST EPISODES (YouTube)
-- ============================================================
create table public.podcast_episodes (
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
  constraint podcast_title_length check (char_length(title) >= 2),
  constraint youtube_video_id_length check (char_length(youtube_video_id) = 11)
);

create index podcast_episodes_user_id_idx on public.podcast_episodes (user_id);
create index podcast_episodes_created_at_idx on public.podcast_episodes (created_at desc);

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

-- ============================================================
-- CONTACT MESSAGES
-- ============================================================
create table public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  message     text not null,
  created_at  timestamptz not null default now(),
  constraint contact_name_length check (char_length(name) >= 2),
  constraint contact_message_length check (char_length(message) >= 5)
);

create index contact_messages_created_at_idx
  on public.contact_messages (created_at desc);

alter table public.contact_messages enable row level security;

create policy "Anyone can submit contact messages"
  on public.contact_messages for insert
  with check (true);

-- Only the site owner (admin UUID) can read messages.
-- Replace YOUR_ADMIN_UUID with your Supabase auth user id before running.
create policy "Only admin can view contact messages"
  on public.contact_messages for select
  using (auth.uid() = 'YOUR_ADMIN_UUID'::uuid);

--============================================================
 --STORAGE BUCKET (run after creating bucket in Dashboard)
 --Dashboard → Storage → New bucket → name: "media", public: true
 --============================================================
 insert into storage.buckets (id, name, public)
 values ('media', 'media', true)
 on conflict do nothing;

 create policy "Anyone can view media files"
  on storage.objects for select
  using (bucket_id = 'media');

 create policy "Authenticated users can upload media"
 on storage.objects for insert
  with check (
     bucket_id = 'media'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

 create policy "Users can update their own uploads"
  on storage.objects for update
  using (
     bucket_id = 'media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

 create policy "Users can delete their own uploads"
  on storage.objects for delete
  using (
    bucket_id = 'media'
   and (storage.foldername(name))[1] = auth.uid()::text
  );
