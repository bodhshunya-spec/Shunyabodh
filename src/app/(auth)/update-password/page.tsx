import { createClient } from "@/lib/supabase/server";
import { UpdatePasswordForm } from "@/components/auth/update-password-form";
import { ne } from "@/lib/i18n/ne";

export const metadata = {
  title: ne.auth.updatePasswordTitle,
};

export default async function UpdatePasswordPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <UpdatePasswordForm hasSession={Boolean(user)} />;
}
