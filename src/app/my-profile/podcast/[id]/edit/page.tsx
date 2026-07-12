import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import { PodcastEditor } from "@/components/dashboard/podcast-editor";
import { ne } from "@/lib/i18n/ne";
import { Button } from "@/components/ui/button";

type EditPodcastPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPodcastPage({ params }: EditPodcastPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/my-profile");

  if (!isAdmin(user.id)) notFound();

  const { data: episode } = await supabase
    .from("podcast_episodes")
    .select("id, title, description, youtube_url, user_id")
    .eq("id", id)
    .single();

  if (!episode || episode.user_id !== user.id) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 py-12">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link href="/my-profile">{ne.nav.backToMyProfile}</Link>
      </Button>
      <PodcastEditor
        episodeId={episode.id}
        initialTitle={episode.title}
        initialDescription={episode.description ?? ""}
        initialYoutubeUrl={episode.youtube_url}
      />
    </div>
  );
}
