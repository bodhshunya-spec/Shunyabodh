"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteArticle } from "@/app/actions/articles";
import { deleteMedia } from "@/app/actions/media";
import { deletePodcastEpisode } from "@/app/actions/podcast";
import { Button } from "@/components/ui/button";
import { ne } from "@/lib/i18n/ne";

type DeleteType = "article" | "media" | "podcast";

type DeleteButtonProps = {
  label?: string;
  confirmMessage: string;
  type: DeleteType;
  itemId: string;
};

async function runDelete(type: DeleteType, itemId: string) {
  switch (type) {
    case "article":
      return deleteArticle(itemId);
    case "media":
      return deleteMedia(itemId);
    case "podcast":
      return deletePodcastEpisode(itemId);
  }
}

export function DeleteButton({
  label = ne.dashboard.delete,
  confirmMessage,
  type,
  itemId,
}: DeleteButtonProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (!window.confirm(confirmMessage)) return;

    setIsPending(true);
    setError(null);

    const result = await runDelete(type, itemId);

    if (result?.error) {
      setError(result.error);
      setIsPending(false);
      return;
    }

    setIsPending(false);
    router.refresh();
  }

  return (
    <div className="inline-flex flex-col items-end gap-1">
      <Button
        type="button"
        variant="destructive"
        size="sm"
        onClick={handleClick}
        disabled={isPending}
      >
        {isPending ? ne.dashboard.deleting : label}
      </Button>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}
