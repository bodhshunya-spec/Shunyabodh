import { ne } from "@/lib/i18n/ne";

export function getAuthErrorMessage(message: string): string {
  const normalized = message.toLowerCase();

  if (
    normalized.includes("invalid login credentials") ||
    normalized.includes("invalid email or password")
  ) {
    return ne.auth.invalidLoginCredentials;
  }

  if (normalized.includes("email not confirmed")) {
    return ne.auth.emailNotConfirmed;
  }

  if (normalized.includes("too many requests")) {
    return ne.auth.tooManyAttempts;
  }

  return ne.auth.authFailed;
}
