"use client";

import { useState } from "react";
import Link from "next/link";
import { createComment } from "@/app/actions/comments";
import { CommentList, type CommentWithAuthor } from "@/components/comments/comment-list";
import { ne } from "@/lib/i18n/ne";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type CommentThreadProps = {
  initialComments: CommentWithAuthor[];
  isAuthenticated: boolean;
  articleId?: string;
  mediaId?: string;
};

export function CommentThread({
  initialComments,
  isAuthenticated,
  articleId,
  mediaId,
}: CommentThreadProps) {
  const [comments, setComments] = useState(initialComments);
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

    if (result.comment) {
      setComments((current) => [...current, result.comment!]);
    }

    setContent("");
    setIsPending(false);
  }

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-border/70 bg-card/50 p-5 sm:p-6">
        <h3 className="text-sm font-medium text-foreground">
          {comments.length} {ne.comments.count}
        </h3>
        <div className="mt-5">
          <CommentList comments={comments} />
        </div>
      </div>

      <div className="rounded-xl border border-border/70 bg-card/50 p-5 sm:p-6">
        {isAuthenticated ? (
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
                onChange={(event) => setContent(event.target.value)}
                placeholder={ne.comments.placeholder}
                rows={4}
                required
              />
            </div>
            <Button type="submit" disabled={isPending || !content.trim()}>
              {isPending ? ne.comments.posting : ne.comments.post}
            </Button>
          </form>
        ) : (
          <p className="text-sm text-muted-foreground">
            <Link
              href="/login"
              className="text-primary underline-offset-4 hover:underline"
            >
              {ne.comments.signInToJoin}
            </Link>{" "}
            {ne.comments.signInSuffix}
          </p>
        )}
      </div>
    </div>
  );
}
