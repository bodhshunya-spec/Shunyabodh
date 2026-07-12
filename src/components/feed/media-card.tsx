import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate, getAuthorName } from "@/lib/format";
import { ne } from "@/lib/i18n/ne";
import type { Profile } from "@/types/database";

type MediaCardProps = {
  item: {
    id: string;
    type: "photo" | "video";
    title: string | null;
    description: string | null;
    url: string;
    created_at: string;
    profiles:
      | Pick<Profile, "full_name" | "username">
      | Pick<Profile, "full_name" | "username">[]
      | null;
  };
};

export function MediaCard({ item }: MediaCardProps) {
  return (
    <Link href={`/media/${item.id}`} className="group block">
      <Card className="h-full overflow-hidden border-border/50 bg-card/95 shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-md">
        <div className="aspect-[4/3] overflow-hidden bg-muted">
          {item.type === "photo" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.url}
              alt={item.title ?? ne.media.photoAlt}
              className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <video
              src={item.url}
              preload="metadata"
              muted
              className="size-full object-cover"
            >
              {ne.media.videoUnsupported}
            </video>
          )}
        </div>
        <CardHeader>
          <CardTitle className="font-heading text-base text-foreground group-hover:text-primary">
            {item.title ?? ne.media.untitled}
          </CardTitle>
          <CardDescription className="flex flex-wrap gap-x-2 gap-y-1">
            <span>{getAuthorName(item.profiles)}</span>
            <span aria-hidden>·</span>
            <time dateTime={item.created_at}>{formatDate(item.created_at)}</time>
          </CardDescription>
        </CardHeader>
        {item.description && (
          <CardContent>
            <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {item.description}
            </p>
          </CardContent>
        )}
      </Card>
    </Link>
  );
}
