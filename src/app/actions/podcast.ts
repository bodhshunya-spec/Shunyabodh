"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import { publishVideo } from "@/app/actions/video";
import { ne } from "@/lib/i18n/ne";
import { SUBMISSION_STATUS, VIDEO_SOURCE, VIDEO_TYPE } from "@/lib/constants";
import { extractYouTubeVideoId } from "@/lib/youtube";

export async function createPodcastEpisode(formData: FormData) {
  formData.set("videoType", VIDEO_TYPE.YOUTUBE_LINK);
  return publishVideo(formData);
}

export async function updatePodcastEpisode(episodeId: string, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: ne.common.signInRequired };
  }

  if (!isAdmin(user.id)) {
    return { error: ne.common.notAuthorized };
  }

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const youtubeUrl = (formData.get("youtubeUrl") as string)?.trim();

  if (!title || !youtubeUrl) {
    return { error: ne.podcast.requiredFields };
  }

  const videoId = extractYouTubeVideoId(youtubeUrl);
  if (!videoId) {
    return { error: ne.podcast.invalidUrl };
  }

  const { error } = await supabase
    .from("podcast_episodes")
    .update({
      title,
      description,
      youtube_url: youtubeUrl,
      youtube_video_id: videoId,
      video_source: VIDEO_SOURCE.YOUTUBE_LINK,
      submission_status: SUBMISSION_STATUS.PUBLISHED,
    })
    .eq("id", episodeId)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/podcast");
  revalidatePath("/my-profile");

  return { success: true };
}

export async function deletePodcastEpisode(episodeId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: ne.common.signInRequired };
  }

  const userIsAdmin = isAdmin(user.id);

  const { data: episode } = await supabase
    .from("podcast_episodes")
    .select("user_id")
    .eq("id", episodeId)
    .single();

  if (!episode) {
    return { error: ne.common.notFound };
  }

  if (!userIsAdmin && episode.user_id !== user.id) {
    return { error: ne.common.notAuthorized };
  }

  let deleteQuery = supabase.from("podcast_episodes").delete().eq("id", episodeId);
  if (!userIsAdmin) {
    deleteQuery = deleteQuery.eq("user_id", user.id);
  }

  const { error } = await deleteQuery;

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/podcast");
  revalidatePath("/my-profile");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", episode.user_id)
    .single();

  if (profile?.username) {
    revalidatePath(`/profile/${profile.username}`);
  }

  return { success: true };
}
