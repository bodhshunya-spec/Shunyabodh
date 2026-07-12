"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ne } from "@/lib/i18n/ne";

type ProfileSettingsProps = {
  initialUsername: string;
  initialFullName: string;
  initialBio: string;
};

export function ProfileSettings({
  initialUsername,
  initialFullName,
  initialBio,
}: ProfileSettingsProps) {
  const router = useRouter();
  const [username, setUsername] = useState(initialUsername);
  const [fullName, setFullName] = useState(initialFullName);
  const [bio, setBio] = useState(initialBio);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsPending(true);
    setError(null);

    const result = await updateProfile({ username, fullName, bio });

    if (result?.error) {
      setError(result.error);
      setIsPending(false);
      return;
    }

    setIsPending(false);
    router.refresh();
  }

  return (
    <Card className="border-border/70 bg-card/90 shadow-sm">
      <CardHeader>
        <CardTitle className="font-heading text-lg text-foreground">
          {ne.profile.settingsTitle}
        </CardTitle>
        <CardDescription>{ne.profile.settingsDesc}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="username">{ne.profile.username}</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={ne.profile.usernamePlaceholder}
              required
              minLength={3}
              pattern="[a-z0-9_]+"
            />
            <p className="text-xs text-muted-foreground">{ne.profile.usernameHint}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullName">{ne.profile.fullName}</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={ne.auth.namePlaceholder}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">{ne.profile.bio}</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={ne.profile.bioPlaceholder}
              rows={3}
            />
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? ne.profile.saving : ne.profile.save}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
