"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HeartIcon } from "lucide-react";
import { toggleLike } from "@/app/actions/likes";
import { ne } from "@/lib/i18n/ne";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LikeButtonProps = {
  likeCount: number;
  isLiked: boolean;
  isAuthenticated: boolean;
  articleId?: string;
  mediaId?: string;
};

export function LikeButton({
  likeCount,
  isLiked: initialLiked,
  isAuthenticated,
  articleId,
  mediaId,
}: LikeButtonProps) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [count, setCount] = useState(likeCount);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleToggle() {
    if (!isAuthenticated || isPending) return;

    const previousLiked = isLiked;
    const previousCount = count;
    const nextLiked = !isLiked;
    const nextCount = nextLiked ? count + 1 : Math.max(0, count - 1);

    setIsLiked(nextLiked);
    setCount(nextCount);
    setError(null);
    setIsPending(true);

    const result = await toggleLike({ articleId, mediaId });

    if (result?.error) {
      setIsLiked(previousLiked);
      setCount(previousCount);
      setError(result.error);
      setIsPending(false);
      return;
    }

    setIsPending(false);
    router.refresh();
  }

  if (!isAuthenticated) {
    return (
      <Button variant="outline" size="sm" asChild className="gap-2">
        <Link href="/login">
          <HeartIcon className="size-4" aria-hidden />
          <span>
            {count} {ne.engagement.likes}
          </span>
        </Link>
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className={cn("gap-2", isLiked && "border-primary/40 text-primary")}
        onClick={handleToggle}
        disabled={isPending}
        aria-pressed={isLiked}
        aria-label={isLiked ? ne.engagement.unlike : ne.engagement.like}
      >
        <HeartIcon
          className={cn("size-4", isLiked && "fill-current")}
          aria-hidden
        />
        <span>
          {count} {ne.engagement.likes}
        </span>
      </Button>
      {error && (
        <p className="max-w-xs text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}
