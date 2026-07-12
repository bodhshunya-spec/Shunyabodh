import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import { AdminModeration } from "@/components/dashboard/admin-moderation";
import { ContentManager } from "@/components/dashboard/content-manager";
import { MessageList } from "@/components/dashboard/message-list";
import { ProfileSettings } from "@/components/dashboard/profile-settings";
import { PublishHub } from "@/components/dashboard/publish-hub";
import { AccountDetails } from "@/components/profile/account-details";
import { ne } from "@/lib/i18n/ne";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: ne.profile.title,
};

export default async function MyProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/my-profile");

  const userIsAdmin = isAdmin(user.id);

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, full_name, bio")
    .eq("id", user.id)
    .single();

  const { data: articles } = await supabase
    .from("articles")
    .select("id, title, slug, is_published, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const { data: media } = await supabase
    .from("media")
    .select("id, type, title, created_at, is_published, submission_status, video_source")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const { data: podcasts } = await supabase
    .from("podcast_episodes")
    .select("id, title, created_at, video_source, submission_status")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const { data: contactMessages } = userIsAdmin
    ? await supabase
        .from("contact_messages")
        .select("id, name, email, message, created_at")
        .order("created_at", { ascending: false })
    : { data: null };

  const [{ data: moderationArticles }, { data: moderationMedia }] = userIsAdmin
    ? await Promise.all([
        supabase
          .from("articles")
          .select("id, title, slug, created_at, profiles(full_name, username)")
          .eq("is_published", true)
          .order("created_at", { ascending: false })
          .limit(40),
        supabase
          .from("media")
          .select("id, type, title, created_at, profiles(full_name, username)")
          .eq("is_published", true)
          .order("created_at", { ascending: false })
          .limit(40),
      ])
    : [{ data: null }, { data: null }];

  return (
    <div className="mx-auto max-w-3xl space-y-10 px-6 py-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl text-foreground">{ne.profile.title}</h1>
          <p className="mt-2 text-muted-foreground">{ne.profile.hubDescription}</p>
        </div>
        {profile?.username ? (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/profile/${profile.username}`}>
              {ne.profile.viewPublicProfile}
            </Link>
          </Button>
        ) : (
          <p className="text-xs text-muted-foreground">{ne.profile.setUsernameFirst}</p>
        )}
      </div>

      <AccountDetails
        email={user.email ?? "—"}
        fullName={profile?.full_name ?? null}
        username={profile?.username ?? null}
        bio={profile?.bio ?? null}
      />

      <div className="space-y-3">
        <h2 className="font-heading text-xl text-foreground">{ne.dashboard.publish}</h2>
        <PublishHub isAdmin={userIsAdmin} />
      </div>

      <ProfileSettings
        initialUsername={profile?.username ?? ""}
        initialFullName={profile?.full_name ?? ""}
        initialBio={profile?.bio ?? ""}
      />

      <ContentManager
        articles={articles ?? []}
        media={media ?? []}
        podcasts={podcasts ?? []}
        title={ne.profile.publications}
        description={ne.profile.publicationsDesc}
      />

      {userIsAdmin && <MessageList messages={contactMessages ?? []} />}

      {userIsAdmin && (
        <AdminModeration
          articles={moderationArticles ?? []}
          media={moderationMedia ?? []}
        />
      )}
    </div>
  );
}
