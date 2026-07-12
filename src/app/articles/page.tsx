import { createClient } from "@/lib/supabase/server";
import { ArticleCard } from "@/components/feed/article-card";
import { EmptyState } from "@/components/feed/empty-state";
import { FeedHeader } from "@/components/feed/feed-header";
import { ne } from "@/lib/i18n/ne";

export const metadata = {
  title: ne.feeds.articles.title,
  description: ne.feeds.articles.description,
};

export default async function ArticlesPage() {
  const supabase = await createClient();

  const { data: articles } = await supabase
    .from("articles")
    .select(
      "id, title, slug, excerpt, created_at, user_id, profiles(full_name, username)"
    )
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <FeedHeader
        title={ne.feeds.articles.title}
        description={ne.feeds.articles.description}
      />

      {articles && articles.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <EmptyState message={ne.feeds.articles.empty} />
      )}
    </div>
  );
}
