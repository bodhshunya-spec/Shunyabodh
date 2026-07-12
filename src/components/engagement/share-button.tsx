"use client";

import { useState } from "react";
import { Share2Icon } from "lucide-react";
import { ne } from "@/lib/i18n/ne";
import { Button } from "@/components/ui/button";

type ShareButtonProps = {
  url: string;
  title: string;
};

export function ShareButton({ url, title }: ShareButtonProps) {
  const [feedback, setFeedback] = useState<string | null>(null);

  async function handleShare() {
    setFeedback(null);

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ url, title });
        return;
      } catch {
        // User cancelled or share failed — fall through to copy.
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setFeedback(ne.engagement.linkCopied);
    } catch {
      setFeedback(ne.engagement.shareFailed);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={handleShare}
        aria-label={ne.engagement.share}
      >
        <Share2Icon className="size-4" aria-hidden />
        {ne.engagement.share}
      </Button>
      {feedback && (
        <span className="text-xs text-muted-foreground">{feedback}</span>
      )}
    </div>
  );
}
