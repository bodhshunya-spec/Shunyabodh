"use client";

import { useState } from "react";
import { createArticle, updateArticle } from "@/app/actions/articles";
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
import { PublishGuidelines } from "@/components/dashboard/publish-guidelines";

type ArticleEditorProps = {
  articleId?: string;
  embedded?: boolean;
  onSuccess?: () => void;
  initialData?: {
    title: string;
    excerpt: string;
    content: string;
    isPublished: boolean;
  };
};

export function ArticleEditor({
  articleId,
  embedded,
  onSuccess,
  initialData,
}: ArticleEditorProps) {
  const isEditing = Boolean(articleId);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setError(null);

    if (embedded) {
      formData.set("embedded", "true");
    }

    const result = isEditing
      ? await updateArticle(articleId!, formData)
      : await createArticle(formData);

    if (result?.error) {
      setError(result.error);
      setIsPending(false);
      return;
    }

    if (embedded) {
      setIsPending(false);
      onSuccess?.();
    }
  }

  const form = (
    <form action={handleSubmit} className="space-y-4">
      {error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
      <div className="space-y-2">
        <Label htmlFor="title">{ne.articleEditor.titleLabel}</Label>
        <Input
          id="title"
          name="title"
          placeholder={ne.articleEditor.titlePlaceholder}
          defaultValue={initialData?.title}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="excerpt">{ne.articleEditor.excerptLabel}</Label>
        <Input
          id="excerpt"
          name="excerpt"
          placeholder={ne.articleEditor.excerptPlaceholder}
          defaultValue={initialData?.excerpt}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">{ne.articleEditor.contentLabel}</Label>
        <Textarea
          id="content"
          name="content"
          placeholder={ne.articleEditor.contentPlaceholder}
          rows={embedded ? 8 : 12}
          required
          defaultValue={initialData?.content}
          className="resize-y"
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input
          type="checkbox"
          name="isPublished"
          defaultChecked={initialData?.isPublished ?? false}
          className="size-4 rounded border-border accent-primary"
        />
        {ne.articleEditor.publishNow}
      </label>
      {embedded && !isEditing && <PublishGuidelines variant="compact" />}
      <Button type="submit" disabled={isPending} className={embedded ? "w-full" : undefined}>
        {isPending
          ? ne.articleEditor.saving
          : isEditing
            ? ne.articleEditor.update
            : ne.articleEditor.save}
      </Button>
    </form>
  );

  if (embedded) return form;

  return (
    <Card className="border-border/70 bg-card/90 shadow-sm">
      <CardHeader>
        <CardTitle className="font-heading text-lg text-foreground">
          {isEditing ? ne.articleEditor.editTitle : ne.articleEditor.title}
        </CardTitle>
        <CardDescription>{ne.articleEditor.description}</CardDescription>
      </CardHeader>
      <CardContent>{form}</CardContent>
    </Card>
  );
}
