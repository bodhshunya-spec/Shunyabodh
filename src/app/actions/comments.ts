"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isEngageableMedia } from "@/lib/engagement";
import { ne } from "@/lib/i18n/ne";

type CreateCommentInput = {
  content: string;
  articleId?: string;
  mediaId?: string;
};

export async function createComment(input: CreateCommentInput) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: ne.comments.signInRequired };
  }

  const content = input.content.trim();

  if (!content) {
    return { error: ne.comments.emptyComment };
  }

  const hasArticle = Boolean(input.articleId);
  const hasMedia = Boolean(input.mediaId);

  if (hasArticle === hasMedia) {
    return { error: ne.engagement.invalidTarget };
  }

  if (input.mediaId) {
    const { data: media } = await supabase
      .from("media")
      .select("type, video_source, is_published")
      .eq("id", input.mediaId)
      .single();

    if (!media?.is_published || !isEngageableMedia(media.type, media.video_source)) {
      return { error: ne.engagement.notAllowed };
    }
  }

  const { data: comment, error } = await supabase
    .from("comments")
    .insert({
      user_id: user.id,
      content,
      article_id: input.articleId ?? null,
      media_id: input.mediaId ?? null,
    })
    .select("id, content, created_at, profiles(full_name, username)")
    .single();

  if (error) {
    return { error: error.message || ne.comments.postFailed };
  }

  if (input.articleId) {
    const { data: article } = await supabase
      .from("articles")
      .select("slug")
      .eq("id", input.articleId)
      .single();

    if (article?.slug) {
      revalidatePath(`/articles/${article.slug}`);
    }
  }

  if (input.mediaId) {
    revalidatePath(`/media/${input.mediaId}`);
  }

  return { success: true, comment };
}
