"use server";

import { createClient } from "@/lib/supabase/server";
import { sendContactNotification } from "@/lib/email";
import { ne } from "@/lib/i18n/ne";

export async function submitContactMessage(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const rawMessage = (formData.get("message") as string)?.trim();
  const source = (formData.get("source") as string)?.trim();

  if (!name || !email || !rawMessage) {
    return { error: ne.contact.requiredFields };
  }

  if (name.length < 2) {
    return { error: ne.contact.nameTooShort };
  }

  if (rawMessage.length < 5) {
    return { error: ne.contact.messageTooShort };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return { error: ne.contact.invalidEmail };
  }

  const message =
    source === "consultation"
      ? `[परामर्श अनुरोध]\n\n${rawMessage}`
      : rawMessage;

  const supabase = await createClient();

  const { error } = await supabase.from("contact_messages").insert({
    name,
    email,
    message,
  });

  if (error) {
    return { error: error.message };
  }

  const mail = await sendContactNotification({
    name,
    email,
    message,
    subjectPrefix:
      source === "consultation"
        ? ne.email.consultationSubject
        : ne.email.contactSubject,
    heading:
      source === "consultation"
        ? ne.email.consultationHeading
        : ne.email.contactHeading,
  });
  if (!mail.sent) {
    console.warn(
      source === "consultation" ? "[consultation]" : "[contact]",
      "Message saved, but email notify failed:",
      mail.reason,
      "error" in mail ? mail.error : undefined
    );
  }

  return { success: true };
}
