/**
 * Returns true only when the signed-in user matches ADMIN_USER_ID.
 * Set ADMIN_USER_ID in .env.local to your Supabase auth user UUID.
 * All admin access (YouTube publish, contact messages, etc.) must use this helper.
 */
export function isAdmin(userId: string | undefined | null): boolean {
  const adminId = process.env.ADMIN_USER_ID?.trim();
  const normalizedUserId = userId?.trim();
  if (!adminId || !normalizedUserId) return false;
  return normalizedUserId === adminId;
}
