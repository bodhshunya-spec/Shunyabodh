import { createClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/feed/empty-state";
import { FeedHeader } from "@/components/feed/feed-header";
import { MediaCard } from "@/components/feed/media-card";
import { ne } from "@/lib/i18n/ne";

export const metadata = {
  title: ne.feeds.photos.title,
  description: ne.feeds.photos.description,
};

export default async function PhotosPage() {
  const supabase = await createClient();

  const { data: photos } = await supabase
    .from("media")
    .select(
      "id, type, title, description, url, storage_path, created_at, profiles(full_name, username)"
    )
    .eq("type", "photo")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <FeedHeader
        title={ne.feeds.photos.title}
        description={ne.feeds.photos.description}
      />

      {photos && photos.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo) => (
            <MediaCard key={photo.id} item={photo} />
          ))}
        </div>
      ) : (
        <EmptyState message={ne.feeds.photos.empty} />
      )}
    </div>
  );
}
