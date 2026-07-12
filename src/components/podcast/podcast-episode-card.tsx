import { formatDate, getAuthorName } from "@/lib/format";
import { YouTubeEmbed } from "@/components/podcast/youtube-embed";
import type { Profile } from "@/types/database";

type EpisodeWithAuthor = {
  id: string;
  title: string;
  description: string | null;
  youtube_video_id: string;
  created_at: string;
  profiles:
    | Pick<Profile, "full_name" | "username">
    | Pick<Profile, "full_name" | "username">[]
    | null;
};

type PodcastEpisodeCardProps = {
  episode: EpisodeWithAuthor;
};

export function PodcastEpisodeCard({ episode }: PodcastEpisodeCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-border/70 bg-card/80">
      <YouTubeEmbed videoId={episode.youtube_video_id} title={episode.title} />
      <div className="p-6">
        <h3 className="font-heading text-lg text-foreground">{episode.title}</h3>
        <p className="mt-2 text-xs text-muted-foreground">
          {getAuthorName(episode.profiles)} · {formatDate(episode.created_at)}
        </p>
        {episode.description && (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {episode.description}
          </p>
        )}
      </div>
    </article>
  );
}
