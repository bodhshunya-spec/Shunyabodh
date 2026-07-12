import Link from "next/link";
import { DeleteButton } from "@/components/dashboard/delete-button";
import { formatDate, getAuthorName } from "@/lib/format";
import { ne } from "@/lib/i18n/ne";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Profile } from "@/types/database";

type ProfileSnippet =
  | Pick<Profile, "full_name" | "username">
  | Pick<Profile, "full_name" | "username">[]
  | null;

type ModerationArticle = {
  id: string;
  title: string;
  slug: string;
  created_at: string;
  profiles: ProfileSnippet;
};

type ModerationMedia = {
  id: string;
  type: "photo" | "video";
  title: string | null;
  created_at: string;
  profiles: ProfileSnippet;
};

type AdminModerationProps = {
  articles: ModerationArticle[];
  media: ModerationMedia[];
};

export function AdminModeration({ articles, media }: AdminModerationProps) {
  if (articles.length === 0 && media.length === 0) {
    return null;
  }

  return (
    <Card className="border-destructive/20 bg-card/90 shadow-sm">
      <CardHeader>
        <CardTitle className="font-heading text-lg text-foreground">
          {ne.dashboard.moderationTitle}
        </CardTitle>
        <CardDescription>{ne.dashboard.moderationDesc}</CardDescription>
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
                      {getAuthorName(article.profiles)} · {formatDate(article.created_at)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/articles/${article.slug}`}>{ne.dashboard.view}</Link>
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
                      · {getAuthorName(item.profiles)} · {formatDate(item.created_at)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/media/${item.id}`}>{ne.dashboard.view}</Link>
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
      </CardContent>
    </Card>
  );
}
