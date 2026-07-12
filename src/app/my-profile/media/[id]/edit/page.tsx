import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MediaEditor } from "@/components/dashboard/media-editor";
import { ne } from "@/lib/i18n/ne";
import { Button } from "@/components/ui/button";

type EditMediaPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditMediaPage({ params }: EditMediaPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/my-profile");

  const { data: media } = await supabase
    .from("media")
    .select("id, title, description, user_id")
    .eq("id", id)
    .single();

  if (!media || media.user_id !== user.id) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 py-12">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link href="/my-profile">{ne.nav.backToMyProfile}</Link>
      </Button>
      <MediaEditor
        mediaId={media.id}
        initialTitle={media.title ?? ""}
        initialDescription={media.description ?? ""}
      />
    </div>
  );
}
