export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("ne-NP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("ne-NP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getAuthorName(
  profile:
    | { full_name: string | null; username: string | null }
    | { full_name: string | null; username: string | null }[]
    | null
): string {
  const resolved = Array.isArray(profile) ? profile[0] : profile;
  if (!resolved) return "समुदाय सदस्य";
  return resolved.full_name?.trim() || resolved.username || "समुदाय सदस्य";
}

export function normalizeProfile<T extends { full_name: string | null; username: string | null }>(
  profile: T | T[] | null
): T | null {
  if (Array.isArray(profile)) return profile[0] ?? null;
  return profile;
}
