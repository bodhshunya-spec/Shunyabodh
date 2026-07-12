import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import { ArticleBody } from "@/components/article/article-body";
import { CommentSection } from "@/components/comments/comment-section";
import { DeleteButton } from "@/components/dashboard/delete-button";
import { EngagementBar } from "@/components/engagement/engagement-bar";
import { formatDate, getAuthorName } from "@/lib/format";
import { getEngagementData } from "@/lib/engagement-data";
import { getSiteUrl } from "@/lib/site-url";
import { ne } from "@/lib/i18n/ne";
import { Button } from "@/components/ui/button";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: article } = await supabase
    .from("articles")
    .select("title, excerpt")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!article) return { title: ne.article.notFound };

  return {
    title: article.title,
    description: article.excerpt ?? undefined,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: article } = await supabase
    .from("articles")
    .select(
      "id, title, slug, content, excerpt, created_at, profiles(full_name, username)"
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!article) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userIsAdmin = isAdmin(user?.id);

  const engagement = await getEngagementData({ articleId: article.id });
  const shareUrl = `${getSiteUrl()}/articles/${article.slug}`;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Button variant="ghost" size="sm" asChild className="mb-8 -ml-2">
        <Link href="/articles">{ne.nav.backToArticles}</Link>
      </Button>

      <article>
        <header className="mb-12 border-b border-border/60 pb-10">
          <p className="text-xs tracking-widest text-muted-foreground uppercase">
            {ne.article.reading}
          </p>
          <h1 className="mt-3 font-heading text-3xl leading-[1.2] text-foreground sm:text-[2.5rem]">
            {article.title}
          </h1>
          <p className="mt-5 text-sm text-muted-foreground">
            {getAuthorName(article.profiles)} ·{" "}
            <time dateTime={article.created_at}>
              {formatDate(article.created_at)}
            </time>
          </p>
          {article.excerpt && (
            <p className="mt-8 border-l-2 border-border pl-5 text-lg leading-relaxed text-muted-foreground italic">
              {article.excerpt}
            </p>
          )}
        </header>

        <ArticleBody content={article.content} />

        <EngagementBar
          shareUrl={shareUrl}
          shareTitle={article.title}
          likeCount={engagement.likeCount}
          commentCount={engagement.commentCount}
          isLiked={engagement.isLiked}
          isAuthenticated={engagement.isAuthenticated}
          articleId={article.id}
        />

        <CommentSection articleId={article.id} />

        {userIsAdmin && (
          <div className="mt-10 border-t border-border/60 pt-8">
            <DeleteButton
              type="article"
              itemId={article.id}
              confirmMessage={ne.dashboard.deleteConfirmArticle}
            />
          </div>
        )}
      </article>
    </div>
  );
}
