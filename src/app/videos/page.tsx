import { createClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/feed/empty-state";
import { FeedHeader } from "@/components/feed/feed-header";
import { MediaCard } from "@/components/feed/media-card";
import { ne } from "@/lib/i18n/ne";

export const metadata = {
  title: ne.feeds.videos.title,
  description: ne.feeds.videos.description,
};

export default async function VideosPage() {
  const supabase = await createClient();

  const { data: videos } = await supabase
    .from("media")
    .select(
      "id, type, title, description, url, storage_path, created_at, profiles(full_name, username)"
    )
    .eq("type", "video")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <FeedHeader
        title={ne.feeds.videos.title}
        description={ne.feeds.videos.description}
      />

      {videos && videos.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {videos.map((video) => (
            <MediaCard key={video.id} item={video} />
          ))}
        </div>
      ) : (
        <EmptyState message={ne.feeds.videos.empty} />
      )}
    </div>
  );
}
