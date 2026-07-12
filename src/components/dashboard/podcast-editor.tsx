"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updatePodcastEpisode } from "@/app/actions/podcast";
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

type PodcastEditorProps = {
  episodeId: string;
  initialTitle: string;
  initialDescription: string;
  initialYoutubeUrl: string;
};

export function PodcastEditor({
  episodeId,
  initialTitle,
  initialDescription,
  initialYoutubeUrl,
}: PodcastEditorProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setError(null);

    const result = await updatePodcastEpisode(episodeId, formData);

    if (result?.error) {
      setError(result.error);
      setIsPending(false);
      return;
    }

    setIsPending(false);
    router.push("/my-profile");
    router.refresh();
  }

  return (
    <Card className="border-border/70 bg-card/90 shadow-sm">
      <CardHeader>
        <CardTitle className="font-heading text-lg text-foreground">
          {ne.podcast.editTitle}
        </CardTitle>
        <CardDescription>{ne.podcast.editDescription}</CardDescription>
      </CardHeader>
      <form action={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="title">{ne.podcast.titleLabel}</Label>
            <Input
              id="title"
              name="title"
              defaultValue={initialTitle}
              placeholder={ne.podcast.titlePlaceholder}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="youtubeUrl">{ne.podcast.youtubeUrl}</Label>
            <Input
              id="youtubeUrl"
              name="youtubeUrl"
              type="url"
              defaultValue={initialYoutubeUrl}
              placeholder={ne.podcast.youtubeUrlPlaceholder}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">{ne.podcast.descriptionLabel}</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={initialDescription}
              placeholder={ne.podcast.descriptionPlaceholder}
              rows={3}
            />
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? ne.podcast.saving : ne.podcast.save}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
