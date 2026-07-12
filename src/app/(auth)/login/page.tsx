import { LoginForm } from "@/components/auth/login-form";
import { ne } from "@/lib/i18n/ne";

type LoginPageProps = {
  searchParams: Promise<{ redirect?: string; error?: string; reset?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <div className="space-y-6">
      {params.reset === "success" && (
        <p className="rounded-lg border border-border/70 bg-muted/80 px-4 py-3 text-center text-sm leading-relaxed text-muted-foreground">
          {ne.auth.passwordUpdated}
        </p>
      )}
      {params.error && (
        <p className="rounded-lg bg-destructive/10 px-4 py-3 text-center text-sm text-destructive">
          {ne.auth.authFailed}
        </p>
      )}
      <LoginForm redirectTo={params.redirect} />
    </div>
  );
}
