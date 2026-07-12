import { createClient } from "@/lib/supabase/server";

type EngagementTarget = {
  articleId?: string;
  mediaId?: string;
};

export async function getEngagementData(target: EngagementTarget) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let likeCountQuery = supabase
    .from("likes")
    .select("*", { count: "exact", head: true });

  let commentCountQuery = supabase
    .from("comments")
    .select("id", { count: "exact", head: true });

  if (target.articleId) {
    likeCountQuery = likeCountQuery.eq("article_id", target.articleId);
    commentCountQuery = commentCountQuery.eq("article_id", target.articleId);
  } else if (target.mediaId) {
    likeCountQuery = likeCountQuery.eq("media_id", target.mediaId);
    commentCountQuery = commentCountQuery.eq("media_id", target.mediaId);
  }

  const [
    { count: likeCount, error: likeCountError },
    { count: commentCount },
  ] = await Promise.all([likeCountQuery, commentCountQuery]);

  let isLiked = false;

  if (user) {
    let likedQuery = supabase
      .from("likes")
      .select("id")
      .eq("user_id", user.id);

    if (target.articleId) {
      likedQuery = likedQuery.eq("article_id", target.articleId);
    } else if (target.mediaId) {
      likedQuery = likedQuery.eq("media_id", target.mediaId);
    }

    const { data: liked } = await likedQuery.maybeSingle();
    isLiked = Boolean(liked);
  }

  return {
    likeCount: likeCountError ? 0 : (likeCount ?? 0),
    commentCount: commentCount ?? 0,
    isLiked,
    isAuthenticated: Boolean(user),
    likesAvailable: !likeCountError,
  };
}
