"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isEngageableMedia } from "@/lib/engagement";
import { getLikeErrorMessage } from "@/lib/like-errors";
import { ne } from "@/lib/i18n/ne";

type ToggleLikeInput = {
  articleId?: string;
  mediaId?: string;
};

async function revalidateLikePaths(
  supabase: Awaited<ReturnType<typeof createClient>>,
  input: ToggleLikeInput
) {
  if (input.articleId) {
    const { data: article } = await supabase
      .from("articles")
      .select("slug")
      .eq("id", input.articleId)
      .single();

    if (article?.slug) {
      revalidatePath(`/articles/${article.slug}`);
    }
    return;
  }

  if (input.mediaId) {
    revalidatePath(`/media/${input.mediaId}`);
  }
}

export async function toggleLike(input: ToggleLikeInput) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: ne.engagement.signInToLike };
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

  const existingQuery = supabase
    .from("likes")
    .select("id")
    .eq("user_id", user.id);

  const { data: existing } = input.articleId
    ? await existingQuery.eq("article_id", input.articleId).maybeSingle()
    : await existingQuery.eq("media_id", input.mediaId!).maybeSingle();

  if (existing) {
    const { error } = await supabase.from("likes").delete().eq("id", existing.id);

    if (error) {
      return { error: getLikeErrorMessage(error.message) };
    }

    await revalidateLikePaths(supabase, input);
    return { success: true, liked: false };
  }

  const { error } = await supabase.from("likes").insert({
    user_id: user.id,
    article_id: input.articleId ?? null,
    media_id: input.mediaId ?? null,
  });

  if (error) {
    return { error: getLikeErrorMessage(error.message) };
  }

  await revalidateLikePaths(supabase, input);
  return { success: true, liked: true };
}
