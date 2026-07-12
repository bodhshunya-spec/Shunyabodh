import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { ne } from "@/lib/i18n/ne";

export const metadata = {
  title: ne.auth.forgotPasswordTitle,
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
