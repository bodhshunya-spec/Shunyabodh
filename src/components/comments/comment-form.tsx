"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createComment } from "@/app/actions/comments";
import { ne } from "@/lib/i18n/ne";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type CommentFormProps = {
  articleId?: string;
  mediaId?: string;
};

export function CommentForm({ articleId, mediaId }: CommentFormProps) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsPending(true);
    setError(null);

    const result = await createComment({ content, articleId, mediaId });

    if (result?.error) {
      setError(result.error);
      setIsPending(false);
      return;
    }

    setContent("");
    setIsPending(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
      <div className="space-y-2">
        <Label htmlFor="comment-content">{ne.comments.yourReflection}</Label>
        <Textarea
          id="comment-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={ne.comments.placeholder}
          rows={4}
          required
        />
      </div>
      <Button type="submit" disabled={isPending || !content.trim()}>
        {isPending ? ne.comments.posting : ne.comments.post}
      </Button>
    </form>
  );
}

type CommentFormGateProps = CommentFormProps & {
  isAuthenticated: boolean;
};

export function CommentFormGate({
  isAuthenticated,
  articleId,
  mediaId,
}: CommentFormGateProps) {
  if (!isAuthenticated) {
    return (
      <p className="text-sm text-muted-foreground">
        <Link href="/login" className="text-primary underline-offset-4 hover:underline">
          {ne.comments.signInToJoin}
        </Link>{" "}
        {ne.comments.signInSuffix}
      </p>
    );
  }

  return <CommentForm articleId={articleId} mediaId={mediaId} />;
}
