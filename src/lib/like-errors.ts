import { ne } from "@/lib/i18n/ne";

export function getLikeErrorMessage(message: string): string {
  const normalized = message.toLowerCase();

  if (
    normalized.includes("likes") &&
    (normalized.includes("schema cache") ||
      normalized.includes("does not exist") ||
      normalized.includes("could not find"))
  ) {
    return ne.engagement.likesNotConfigured;
  }

  return message || ne.engagement.likeFailed;
}
