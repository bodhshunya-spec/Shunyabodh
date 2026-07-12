import { BrandMark } from "@/components/brand/brand-mark";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import { PodcastEpisodeCard } from "@/components/podcast/podcast-episode-card";
import { PodcastSubmitForm } from "@/components/podcast/podcast-submit-form";
import { ne } from "@/lib/i18n/ne";

export const metadata = {
  title: ne.podcast.title,
  description: ne.podcast.description,
};

export default async function PodcastPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userIsAdmin = isAdmin(user?.id);

  const { data: episodes } = await supabase
    .from("podcast_episodes")
    .select(
      "id, title, description, youtube_video_id, created_at, profiles(full_name, username)"
    )
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-10 flex justify-center">
        <BrandMark size="lg" />
      </div>

      <header className="mb-10 border-b border-border/60 pb-8 text-center">
        <h1 className="font-heading text-3xl text-foreground sm:text-4xl">
          {ne.podcast.title}
        </h1>
        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted-foreground">
          {ne.podcast.description}
        </p>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
          {ne.podcast.intro}
        </p>
      </header>

      {userIsAdmin && (
        <div className="mb-12">
          <PodcastSubmitForm
            isAuthenticated={Boolean(user)}
            isAdmin={userIsAdmin}
          />
        </div>
      )}

      <section className="space-y-8">
        <h2 className="font-heading text-xl text-foreground">{ne.podcast.episodes}</h2>

        {episodes && episodes.length > 0 ? (
          episodes.map((episode) => (
            <PodcastEpisodeCard key={episode.id} episode={episode} />
          ))
        ) : (
          <p className="rounded-xl border border-dashed border-border bg-card/60 px-6 py-12 text-center text-muted-foreground">
            {ne.podcast.empty}
          </p>
        )}
      </section>
    </div>
  );
}
