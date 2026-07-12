"use client";

import { useState } from "react";
import { publishVideo } from "@/app/actions/video";
import { VIDEO_TYPE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ne } from "@/lib/i18n/ne";

type YoutubeEmbedFormProps = {
  embedded?: boolean;
  onSuccess?: () => void;
};

export function YoutubeEmbedForm({ embedded, onSuccess }: YoutubeEmbedFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setError(null);
    formData.set("videoType", VIDEO_TYPE.YOUTUBE_LINK);

    const result = await publishVideo(formData);

    if (result?.error) {
      setError(result.error);
      setIsPending(false);
      return;
    }

    setIsPending(false);
    onSuccess?.();
  }

  const form = (
    <form action={handleSubmit} className="space-y-4">
      {error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
      <div className="space-y-2">
        <Label htmlFor="youtube-title">{ne.podcast.titleLabel}</Label>
        <Input
          id="youtube-title"
          name="title"
          placeholder={ne.podcast.titlePlaceholder}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="youtube-url">{ne.podcast.youtubeUrl}</Label>
        <Input
          id="youtube-url"
          name="youtubeUrl"
          type="url"
          placeholder={ne.podcast.youtubeUrlPlaceholder}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="youtube-description">{ne.podcast.descriptionLabel}</Label>
        <Textarea
          id="youtube-description"
          name="description"
          placeholder={ne.podcast.descriptionPlaceholder}
          rows={3}
        />
      </div>
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? ne.podcast.submitting : ne.podcast.submit}
      </Button>
    </form>
  );

  if (embedded) return form;

  return (
    <div className="surface-card p-6">
      <h3 className="mb-1 font-heading text-lg text-foreground">
        {ne.dashboard.publishPodcast}
      </h3>
      <p className="mb-4 text-sm text-muted-foreground">
        {ne.podcast.submitDescription}
      </p>
      {form}
    </div>
  );
}
