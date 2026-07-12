import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate, getAuthorName } from "@/lib/format";
import type { Profile } from "@/types/database";

type ArticleCardProps = {
  article: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    created_at: string;
    profiles:
      | Pick<Profile, "full_name" | "username">
      | Pick<Profile, "full_name" | "username">[]
      | null;
  };
};

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/articles/${article.slug}`} className="group block">
      <Card className="h-full border-border/50 bg-card/95 shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-md">
        <CardHeader>
          <CardTitle className="font-heading text-lg text-foreground group-hover:text-primary">
            {article.title}
          </CardTitle>
          <CardDescription className="flex flex-wrap gap-x-2 gap-y-1">
            <span>{getAuthorName(article.profiles)}</span>
            <span aria-hidden>·</span>
            <time dateTime={article.created_at}>{formatDate(article.created_at)}</time>
          </CardDescription>
        </CardHeader>
        {article.excerpt && (
          <CardContent>
            <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
              {article.excerpt}
            </p>
          </CardContent>
        )}
      </Card>
    </Link>
  );
}
