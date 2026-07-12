import { createClient } from "@/lib/supabase/server";
import { CommentThread } from "@/components/comments/comment-thread";
import { ne } from "@/lib/i18n/ne";

type CommentSectionProps = {
  articleId?: string;
  mediaId?: string;
};

export async function CommentSection({ articleId, mediaId }: CommentSectionProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let query = supabase
    .from("comments")
    .select("id, content, created_at, profiles(full_name, username)")
    .order("created_at", { ascending: true });

  if (articleId) {
    query = query.eq("article_id", articleId);
  } else if (mediaId) {
    query = query.eq("media_id", mediaId);
  }

  const { data: comments } = await query;

  return (
    <section id="discussion" className="mt-10 scroll-mt-24">
      <h2 className="font-heading text-2xl text-foreground">{ne.comments.title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{ne.comments.description}</p>

      <div className="mt-6">
        <CommentThread
          key={(comments ?? []).map((comment) => comment.id).join("-") || "empty"}
          initialComments={comments ?? []}
          isAuthenticated={Boolean(user)}
          articleId={articleId}
          mediaId={mediaId}
        />
      </div>
    </section>
  );
}
