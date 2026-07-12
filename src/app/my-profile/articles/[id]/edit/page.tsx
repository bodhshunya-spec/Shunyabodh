import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ArticleEditor } from "@/components/dashboard/article-editor";
import { ne } from "@/lib/i18n/ne";
import { Button } from "@/components/ui/button";

type EditArticlePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/my-profile");

  const { data: article } = await supabase
    .from("articles")
    .select("id, title, excerpt, content, is_published, user_id")
    .eq("id", id)
    .single();

  if (!article || article.user_id !== user.id) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 py-12">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link href="/my-profile">{ne.nav.backToMyProfile}</Link>
      </Button>
      <ArticleEditor
        articleId={article.id}
        initialData={{
          title: article.title,
          excerpt: article.excerpt ?? "",
          content: article.content,
          isPublished: article.is_published,
        }}
      />
    </div>
  );
}
