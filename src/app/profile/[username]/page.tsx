import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";
import { ne } from "@/lib/i18n/ne";

type ProfilePageProps = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: ProfilePageProps) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, username")
    .eq("username", username)
    .single();

  if (!profile) return { title: ne.profile.notFound };

  return {
    title: profile.full_name || profile.username || username,
    description: ne.profile.publicProfileDesc,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, full_name, bio, avatar_url, created_at")
    .eq("username", username)
    .single();

  if (!profile) notFound();

  const displayName = profile.full_name?.trim() || profile.username;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <header className="border-b border-border/60 pb-8">
        <div className="flex items-start gap-5">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-full border border-border bg-muted font-heading text-2xl text-muted-foreground">
            {displayName?.charAt(0).toUpperCase() ?? "?"}
          </div>
          <div>
            <h1 className="font-heading text-3xl text-foreground">{displayName}</h1>
            <p className="mt-1 text-sm text-muted-foreground">@{profile.username}</p>
            {profile.bio ? (
              <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
                {profile.bio}
              </p>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">
                {ne.profile.publicProfileEmptyBio}
              </p>
            )}
            <p className="mt-3 text-xs text-muted-foreground">
              {ne.profile.memberSince} {formatDate(profile.created_at)}
            </p>
          </div>
        </div>
      </header>
    </div>
  );
}
