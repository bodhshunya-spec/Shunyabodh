import Link from "next/link";
import { MessageCircleIcon } from "lucide-react";
import { LikeButton } from "@/components/engagement/like-button";
import { ShareButton } from "@/components/engagement/share-button";
import { ne } from "@/lib/i18n/ne";
import { Button } from "@/components/ui/button";

type EngagementBarProps = {
  shareUrl: string;
  shareTitle: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  isAuthenticated: boolean;
  articleId?: string;
  mediaId?: string;
};

export function EngagementBar({
  shareUrl,
  shareTitle,
  likeCount,
  commentCount,
  isLiked,
  isAuthenticated,
  articleId,
  mediaId,
}: EngagementBarProps) {
  return (
    <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border/60 pt-6">
      <LikeButton
        key={`${likeCount}-${isLiked}`}
        likeCount={likeCount}
        isLiked={isLiked}
        isAuthenticated={isAuthenticated}
        articleId={articleId}
        mediaId={mediaId}
      />

      <Button variant="outline" size="sm" className="gap-2" asChild>
        <Link href="#discussion">
          <MessageCircleIcon className="size-4" aria-hidden />
          <span>
            {commentCount} {ne.engagement.comments}
          </span>
        </Link>
      </Button>

      <ShareButton url={shareUrl} title={shareTitle} />
    </div>
  );
}
