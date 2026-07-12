"use client";

import { useState } from "react";
import Link from "next/link";
import { updatePassword } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ne } from "@/lib/i18n/ne";

type UpdatePasswordFormProps = {
  hasSession: boolean;
};

export function UpdatePasswordForm({ hasSession }: UpdatePasswordFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  if (!hasSession) {
    return (
      <Card className="border-border/70 bg-card/90 shadow-sm backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-heading text-xl text-foreground">
            {ne.auth.updatePasswordTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {ne.auth.resetSessionExpired}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 border-t-0 bg-transparent">
          <Button className="w-full" asChild>
            <Link href="/forgot-password">{ne.auth.forgotPasswordTitle}</Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/login">{ne.auth.backToSignIn}</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setError(null);

    const result = await updatePassword(formData);

    if (result?.error) {
      setError(result.error);
      setIsPending(false);
    }
  }

  return (
    <Card className="border-border/70 bg-card/90 shadow-sm backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-heading text-xl text-foreground">
          {ne.auth.updatePasswordTitle}
        </CardTitle>
        <CardDescription>{ne.auth.updatePasswordDescription}</CardDescription>
      </CardHeader>
      <form action={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="password">{ne.auth.newPassword}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder={ne.auth.passwordPlaceholder}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{ne.auth.confirmPassword}</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder={ne.auth.passwordPlaceholder}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>
        </CardContent>
        <CardFooter className="border-t-0 bg-transparent">
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? ne.auth.updatingPassword : ne.auth.updatePassword}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
