import { Resend } from "resend";
import { getSiteUrl } from "@/lib/site-url";
import { ne } from "@/lib/i18n/ne";

type ContactNotificationInput = {
  name: string;
  email: string;
  message: string;
};

export async function sendContactNotification(input: ContactNotificationInput) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.ADMIN_NOTIFY_EMAIL?.trim();
  const from =
    process.env.RESEND_FROM_EMAIL?.trim() ??
    "Shunya Bodha <onboarding@resend.dev>";

  if (!apiKey || !to) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[contact-email] Skipped — set RESEND_API_KEY and ADMIN_NOTIFY_EMAIL in .env.local"
      );
    }
    return { sent: false as const, reason: "not_configured" as const };
  }

  const resend = new Resend(apiKey);
  const siteUrl = getSiteUrl();

  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: input.email,
    subject: `${ne.email.contactSubject} — ${input.name}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #2c2c2c;">
        <h2 style="font-weight: 500; margin-bottom: 8px;">${ne.email.contactHeading}</h2>
        <p style="color: #666; font-size: 14px; margin-top: 0;">${ne.site.nameEn} / ${ne.site.nameNe}</p>
        <hr style="border: none; border-top: 1px solid #e8e4dc; margin: 24px 0;" />
        <p style="font-size: 13px; color: #888; margin: 0 0 4px;">${ne.email.contactName}</p>
        <p style="margin: 0 0 16px; font-size: 16px;">${escapeHtml(input.name)}</p>
        <p style="font-size: 13px; color: #888; margin: 0 0 4px;">${ne.email.contactEmail}</p>
        <p style="margin: 0 0 16px; font-size: 16px;">
          <a href="mailto:${escapeHtml(input.email)}">${escapeHtml(input.email)}</a>
        </p>
        <p style="font-size: 13px; color: #888; margin: 0 0 4px;">${ne.email.contactMessage}</p>
        <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">${escapeHtml(input.message)}</p>
        <p style="font-size: 13px; color: #888;">
          <a href="${siteUrl}/my-profile">${ne.email.viewInDashboard}</a>
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("[contact-email] Failed:", error);
    return { sent: false as const, reason: "send_failed" as const };
  }

  return { sent: true as const };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
