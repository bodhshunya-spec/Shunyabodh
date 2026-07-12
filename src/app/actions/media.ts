"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import { ne } from "@/lib/i18n/ne";
import { SUBMISSION_STATUS, VIDEO_SOURCE } from "@/lib/constants";
type SaveMediaInput = {
  type: "photo" | "video";
  title: string | null;
  description: string | null;
  url: string;
  storagePath: string;
};

export async function saveMediaRecord(input: SaveMediaInput) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: ne.common.signInRequired };
  }

  const { error } = await supabase.from("media").insert({
    user_id: user.id,
    type: input.type,
    title: input.title,
    description: input.description,
    url: input.url,
    storage_path: input.storagePath,
    is_published: true,
    submission_status: SUBMISSION_STATUS.PUBLISHED,
    video_source: input.type === "video" ? VIDEO_SOURCE.UPLOAD : null,
  });
  if (error) {
    return { error: error.message };
  }

  revalidatePath("/my-profile");
  revalidatePath("/photos");
  revalidatePath("/videos");

  return { success: true };
}

export async function updateMedia(mediaId: string, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: ne.common.signInRequired };
  }

  const title = (formData.get("title") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim() || null;

  const { error } = await supabase
    .from("media")
    .update({ title, description })
    .eq("id", mediaId)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/my-profile");
  revalidatePath("/photos");
  revalidatePath("/videos");
  revalidatePath(`/media/${mediaId}`);

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  if (profile?.username) {
    revalidatePath(`/profile/${profile.username}`);
  }

  return { success: true };
}

export async function deleteMedia(mediaId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: ne.common.signInRequired };
  }

  const userIsAdmin = isAdmin(user.id);

  const { data: media } = await supabase
    .from("media")
    .select("storage_path, type, user_id")
    .eq("id", mediaId)
    .single();

  if (!media) {
    return { error: ne.common.notFound };
  }

  if (!userIsAdmin && media.user_id !== user.id) {
    return { error: ne.common.notAuthorized };
  }

  let deleteQuery = supabase.from("media").delete().eq("id", mediaId);
  if (!userIsAdmin) {
    deleteQuery = deleteQuery.eq("user_id", user.id);
  }

  const { error: dbError } = await deleteQuery;

  if (dbError) {
    return { error: dbError.message };
  }

  if (media.storage_path) {
    await supabase.storage.from("media").remove([media.storage_path]);
  }

  revalidatePath("/my-profile");
  revalidatePath("/photos");
  revalidatePath("/videos");
  revalidatePath(`/media/${mediaId}`);

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", media.user_id)
    .single();

  if (profile?.username) {
    revalidatePath(`/profile/${profile.username}`);
  }

  return { success: true };
}
