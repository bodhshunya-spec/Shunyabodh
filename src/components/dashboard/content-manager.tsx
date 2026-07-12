import Link from "next/link";
import { DeleteButton } from "@/components/dashboard/delete-button";
import { formatDate } from "@/lib/format";
import { ne } from "@/lib/i18n/ne";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ArticleItem = {
  id: string;
  title: string;
  slug: string;
  is_published: boolean;
  created_at: string;
};

type MediaItem = {
  id: string;
  type: "photo" | "video";
  title: string | null;
  created_at: string;
  is_published?: boolean;
  submission_status?: "pending" | "published" | "user_submitted" | null;
};

function getMediaStatusLabel(item: MediaItem) {
  if (item.type === "video" && item.submission_status === "pending") {
    return ne.dashboard.pending;
  }
  if (item.type === "video" && item.submission_status === "user_submitted") {
    return ne.dashboard.userSubmitted;
  }
  if (item.is_published === false) {
    return ne.dashboard.pending;
  }
  return ne.dashboard.published;
}

type PodcastItem = {
  id: string;
  title: string;
  created_at: string;
  video_source?: string | null;
  submission_status?: "pending" | "published" | "user_submitted" | null;
};

function getPodcastStatusLabel(item: PodcastItem) {
  if (item.submission_status === "published") {
    return ne.dashboard.published;
  }
  if (item.submission_status === "user_submitted") {
    return ne.dashboard.userSubmitted;
  }
  if (item.submission_status === "pending") {
    return ne.dashboard.pending;
  }
  return ne.dashboard.published;
}

type ContentManagerProps = {
  articles: ArticleItem[];
  media: MediaItem[];
  podcasts: PodcastItem[];
  title?: string;
  description?: string;
};

export function ContentManager({
  articles,
  media,
  podcasts,
  title = ne.dashboard.myContent,
  description = ne.dashboard.myContentDesc,
}: ContentManagerProps) {
  if (articles.length === 0 && media.length === 0 && podcasts.length === 0) {
    return null;
  }

  return (
    <Card className="border-border/70 bg-card/90 shadow-sm">
      <CardHeader>
        <CardTitle className="font-heading text-lg text-foreground">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {articles.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-medium text-foreground/90">
              {ne.feeds.articles.title}
            </h3>
            <ul className="divide-y divide-border/40">
              {articles.map((article) => (
                <li
                  key={article.id}
                  className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm text-foreground/90">{article.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {article.is_published
                        ? ne.dashboard.published
                        : ne.dashboard.draft}{" "}
                      · {formatDate(article.created_at)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {article.is_published && (
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/articles/${article.slug}`}>
                          {ne.dashboard.view}
                        </Link>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/my-profile/articles/${article.id}/edit`}>
                        {ne.dashboard.edit}
                      </Link>
                    </Button>
                    <DeleteButton
                      type="article"
                      itemId={article.id}
                      confirmMessage={ne.dashboard.deleteConfirmArticle}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {media.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-medium text-foreground/90">
              {ne.mediaUploader.photo} / {ne.mediaUploader.video}
            </h3>
            <ul className="divide-y divide-border/40">
              {media.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm text-foreground/90">
                      {item.title ?? ne.dashboard.untitled}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.type === "photo"
                        ? ne.mediaUploader.photo
                        : ne.mediaUploader.video}{" "}
                      · {getMediaStatusLabel(item)} · {formatDate(item.created_at)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {(item.is_published !== false &&
                      item.submission_status !== "pending") && (
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/media/${item.id}`}>{ne.dashboard.view}</Link>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/my-profile/media/${item.id}/edit`}>
                        {ne.dashboard.edit}
                      </Link>
                    </Button>
                    <DeleteButton
                      type="media"
                      itemId={item.id}
                      confirmMessage={ne.dashboard.deleteConfirmMedia}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {podcasts.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-medium text-foreground/90">
              {ne.podcast.title}
            </h3>
            <ul className="divide-y divide-border/40">
              {podcasts.map((episode) => (
                <li
                  key={episode.id}
                  className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm text-foreground/90">{episode.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {getPodcastStatusLabel(episode)} · {formatDate(episode.created_at)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/podcast">{ne.dashboard.view}</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/my-profile/podcast/${episode.id}/edit`}>
                        {ne.dashboard.edit}
                      </Link>
                    </Button>
                    <DeleteButton
                      type="podcast"
                      itemId={episode.id}
                      confirmMessage={ne.dashboard.deleteConfirmPodcast}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
