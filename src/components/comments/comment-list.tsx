import { formatDate, getAuthorName } from "@/lib/format";
import { ne } from "@/lib/i18n/ne";
import type { Profile } from "@/types/database";

export type CommentWithAuthor = {
  id: string;
  content: string;
  created_at: string;
  profiles:
    | Pick<Profile, "full_name" | "username">
    | Pick<Profile, "full_name" | "username">[]
    | null;
};

type CommentListProps = {
  comments: CommentWithAuthor[];
};

export function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">{ne.comments.empty}</p>
    );
  }

  return (
    <ul className="space-y-6">
      {comments.map((comment) => (
        <li
          key={comment.id}
          className="border-b border-border/40 pb-6 last:border-0 last:pb-0"
        >
          <div className="mb-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-sm font-medium text-foreground/90">
              {getAuthorName(comment.profiles)}
            </span>
            <time
              dateTime={comment.created_at}
              className="text-xs text-muted-foreground"
            >
              {formatDate(comment.created_at)}
            </time>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
            {comment.content}
          </p>
        </li>
      ))}
    </ul>
  );
}
