"use server";

import { createClient } from "@/lib/supabase/server";
import { sendContactNotification } from "@/lib/email";
import { ne } from "@/lib/i18n/ne";

export async function submitContactMessage(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();

  if (!name || !email || !message) {
    return { error: ne.contact.requiredFields };
  }

  if (name.length < 2) {
    return { error: ne.contact.nameTooShort };
  }

  if (message.length < 5) {
    return { error: ne.contact.messageTooShort };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return { error: ne.contact.invalidEmail };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("contact_messages").insert({
    name,
    email,
    message,
  });

  if (error) {
    return { error: error.message };
  }

  await sendContactNotification({ name, email, message });

  return { success: true };
}
