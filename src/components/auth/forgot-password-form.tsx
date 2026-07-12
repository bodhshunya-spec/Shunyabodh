"use client";

import { useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/app/actions/auth";
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

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setError(null);
    setSuccess(false);

    const result = await requestPasswordReset(formData);

    if (result?.error) {
      setError(result.error);
      setIsPending(false);
      return;
    }

    setSuccess(true);
    setIsPending(false);
  }

  if (success) {
    return (
      <Card className="border-border/70 bg-card/90 shadow-sm backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-heading text-xl text-foreground">
            {ne.auth.forgotPasswordTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="rounded-lg border border-border/70 bg-muted/80 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
            {ne.auth.resetEmailSent}
          </p>
        </CardContent>
        <CardFooter className="border-t-0 bg-transparent">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/login">{ne.auth.backToSignIn}</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="border-border/70 bg-card/90 shadow-sm backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-heading text-xl text-foreground">
          {ne.auth.forgotPasswordTitle}
        </CardTitle>
        <CardDescription>{ne.auth.forgotPasswordDescription}</CardDescription>
      </CardHeader>
      <form action={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">{ne.auth.email}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={ne.auth.emailPlaceholder}
              required
              autoComplete="email"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 border-t-0 bg-transparent">
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? ne.auth.sendingResetLink : ne.auth.sendResetLink}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            <Link
              href="/login"
              className="text-primary underline-offset-4 hover:underline"
            >
              {ne.auth.backToSignIn}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
