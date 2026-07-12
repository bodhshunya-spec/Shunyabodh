"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import { ne } from "@/lib/i18n/ne";
import {
  SUBMISSION_STATUS,
  VIDEO_SOURCE,
  VIDEO_TYPE,
  type VideoType,
} from "@/lib/constants";
import { extractYouTubeVideoId } from "@/lib/youtube";

async function insertPodcastEpisode(formData: FormData, userId: string) {
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

  const supabase = await createClient();

  const { error } = await supabase.from("podcast_episodes").insert({
    user_id: userId,
    title,
    description,
    youtube_url: youtubeUrl,
    youtube_video_id: videoId,
    video_source: VIDEO_SOURCE.YOUTUBE_LINK,
    submission_status: SUBMISSION_STATUS.PUBLISHED,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/podcast");
  revalidatePath("/my-profile");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", userId)
    .single();

  if (profile?.username) {
    revalidatePath(`/profile/${profile.username}`);
  }

  return { success: true };
}

async function insertUserMediaVideo(formData: FormData, userId: string) {
  const videoType = formData.get("videoType") as VideoType;
  const title = (formData.get("title") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim() || null;

  let url: string;
  let storagePath: string | null = null;
  let videoSource: typeof VIDEO_SOURCE.UPLOAD | typeof VIDEO_SOURCE.EXTERNAL_LINK;

  if (videoType === VIDEO_TYPE.UPLOAD) {
    url = (formData.get("url") as string)?.trim();
    storagePath = (formData.get("storagePath") as string)?.trim() || null;
    videoSource = VIDEO_SOURCE.UPLOAD;

    if (!url || !storagePath) {
      return { error: ne.videoUploader.uploadRequired };
    }
  } else if (videoType === VIDEO_TYPE.EXTERNAL_LINK) {
    url = (formData.get("externalUrl") as string)?.trim();
    videoSource = VIDEO_SOURCE.EXTERNAL_LINK;

    if (!url) {
      return { error: ne.videoUploader.linkRequired };
    }

    try {
      new URL(url);
    } catch {
      return { error: ne.videoUploader.invalidLink };
    }

    if (extractYouTubeVideoId(url)) {
      return { error: ne.videoUploader.youtubeNotAllowed };
    }
  } else {
    return { error: ne.common.notAuthorized };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("media").insert({
    user_id: userId,
    type: "video",
    title,
    description,
    url,
    storage_path: storagePath,
    video_source: videoSource,
    submission_status: SUBMISSION_STATUS.PUBLISHED,
    is_published: true,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/my-profile");
  revalidatePath("/videos");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", userId)
    .single();

  if (profile?.username) {
    revalidatePath(`/profile/${profile.username}`);
  }

  return { success: true };
}

/**
 * Unified video publish action.
 * - youtube_link → podcast_episodes (admin-only, video_source: youtube_link)
 * - upload / external_link → media (published immediately on /videos)
 */
export async function publishVideo(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: ne.common.signInRequired };
  }

  const videoType = formData.get("videoType") as VideoType;

  if (videoType === VIDEO_TYPE.YOUTUBE_LINK) {
    if (!isAdmin(user.id)) {
      return { error: ne.videoUploader.youtubeNotAllowed };
    }
    return insertPodcastEpisode(formData, user.id);
  }

  if (
    videoType === VIDEO_TYPE.UPLOAD ||
    videoType === VIDEO_TYPE.EXTERNAL_LINK
  ) {
    return insertUserMediaVideo(formData, user.id);
  }

  return { error: ne.common.notAuthorized };
}

/** @deprecated Use publishVideo with videoType=youtube_link */
export async function submitVideo(formData: FormData) {
  formData.set("videoType", VIDEO_TYPE.YOUTUBE_LINK);
  return publishVideo(formData);
}
