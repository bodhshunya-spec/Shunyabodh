import type { VideoSource } from "@/lib/constants";

/** Photos, uploaded videos, and articles — not external/YouTube links. */
export function isEngageableMedia(
  type: "photo" | "video",
  videoSource: VideoSource | null | undefined
): boolean {
  if (type === "photo") return true;
  if (videoSource === "upload" || videoSource == null) return true;
  return false;
}
