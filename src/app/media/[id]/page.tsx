import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import { CommentSection } from "@/components/comments/comment-section";
import { DeleteButton } from "@/components/dashboard/delete-button";
import { EngagementBar } from "@/components/engagement/engagement-bar";
import { formatDate, getAuthorName } from "@/lib/format";
import { isEngageableMedia } from "@/lib/engagement";
import { getEngagementData } from "@/lib/engagement-data";
import { getSiteUrl } from "@/lib/site-url";
import { ne } from "@/lib/i18n/ne";
import { Button } from "@/components/ui/button";

type MediaPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: MediaPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: media } = await supabase
    .from("media")
    .select("title, description, type")
    .eq("id", id)
    .eq("is_published", true)
    .single();

  if (!media) return { title: ne.media.notFound };

  return {
    title: media.title ?? (media.type === "photo" ? ne.media.photo : ne.media.video),
    description: media.description ?? undefined,
  };
}

export default async function MediaPage({ params }: MediaPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: media } = await supabase
    .from("media")
    .select(
      "id, type, title, description, url, video_source, created_at, profiles(full_name, username)"
    )
    .eq("id", id)
    .eq("is_published", true)
    .single();

  if (!media) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userIsAdmin = isAdmin(user?.id);

  const backHref = media.type === "photo" ? "/photos" : "/videos";
  const backLabel =
    media.type === "photo" ? ne.nav.backToPhotos : ne.nav.backToVideos;

  const canEngage = isEngageableMedia(media.type, media.video_source);
  const engagement = canEngage
    ? await getEngagementData({ mediaId: media.id })
    : null;
  const shareUrl = `${getSiteUrl()}/media/${media.id}`;
  const displayTitle = media.title ?? ne.media.untitled;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Button variant="ghost" size="sm" asChild className="mb-8 -ml-2">
        <Link href={backHref}>{backLabel}</Link>
      </Button>

      <article>
        <div className="overflow-hidden rounded-xl border border-border/70 bg-muted">
          {media.type === "photo" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={media.url}
              alt={media.title ?? ne.media.photoAlt}
              className="w-full object-contain"
            />
          ) : (
            <video src={media.url} controls preload="metadata" className="w-full">
              {ne.media.videoUnsupported}
            </video>
          )}
        </div>

        <header className="mt-8 border-b border-border/60 pb-8">
          <h1 className="font-heading text-2xl text-foreground sm:text-3xl">
            {media.title ?? ne.media.untitled}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {getAuthorName(media.profiles)} ·{" "}
            <time dateTime={media.created_at}>
              {formatDate(media.created_at)}
            </time>
          </p>
          {media.description && (
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              {media.description}
            </p>
          )}
        </header>

        {canEngage && engagement && (
          <EngagementBar
            shareUrl={shareUrl}
            shareTitle={displayTitle}
            likeCount={engagement.likeCount}
            commentCount={engagement.commentCount}
            isLiked={engagement.isLiked}
            isAuthenticated={engagement.isAuthenticated}
            mediaId={media.id}
          />
        )}

        {canEngage && <CommentSection mediaId={media.id} />}

        {userIsAdmin && (
          <div className="mt-10 border-t border-border/60 pt-8">
            <DeleteButton
              type="media"
              itemId={media.id}
              confirmMessage={ne.dashboard.deleteConfirmMedia}
            />
          </div>
        )}
      </article>
    </div>
  );
}
