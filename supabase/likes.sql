-- Likes for articles and uploaded media (photos / uploaded videos)
-- Run in Supabase SQL Editor

create table if not exists public.likes (
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

create unique index if not exists likes_user_article_idx
  on public.likes (user_id, article_id)
  where article_id is not null;

create unique index if not exists likes_user_media_idx
  on public.likes (user_id, media_id)
  where media_id is not null;

create index if not exists likes_article_id_idx on public.likes (article_id);
create index if not exists likes_media_id_idx on public.likes (media_id);

alter table public.likes enable row level security;

drop policy if exists "Likes are viewable by everyone" on public.likes;
create policy "Likes are viewable by everyone"
  on public.likes for select
  using (true);

drop policy if exists "Authenticated users can like content" on public.likes;
create policy "Authenticated users can like content"
  on public.likes for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can remove their own likes" on public.likes;
create policy "Users can remove their own likes"
  on public.likes for delete
  using (auth.uid() = user_id);
