"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateMedia } from "@/app/actions/media";
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

type MediaEditorProps = {
  mediaId: string;
  initialTitle: string;
  initialDescription: string;
};

export function MediaEditor({
  mediaId,
  initialTitle,
  initialDescription,
}: MediaEditorProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setError(null);

    const result = await updateMedia(mediaId, formData);

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
          {ne.mediaEditor.title}
        </CardTitle>
        <CardDescription>{ne.mediaEditor.description}</CardDescription>
      </CardHeader>
      <form action={handleSubmit}>
        <CardContent className="space-y-5">
          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="title">{ne.mediaUploader.titleLabel}</Label>
            <Input
              id="title"
              name="title"
              defaultValue={initialTitle}
              placeholder={ne.mediaUploader.titlePlaceholder}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">{ne.mediaUploader.descriptionLabel}</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={initialDescription}
              placeholder={ne.mediaUploader.descriptionPlaceholder}
              rows={4}
            />
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? ne.mediaEditor.saving : ne.mediaEditor.save}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
