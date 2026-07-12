"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { YoutubeEmbedForm } from "@/components/dashboard/youtube-embed-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ne } from "@/lib/i18n/ne";

type PodcastSubmitFormProps = {
  isAuthenticated: boolean;
  isAdmin: boolean;
};

export function PodcastSubmitForm({
  isAuthenticated,
  isAdmin,
}: PodcastSubmitFormProps) {
  const router = useRouter();

  if (!isAuthenticated) {
    return (
      <Card className="border-border/70 bg-card/80 shadow-sm">
        <CardContent className="py-6 text-center text-sm text-muted-foreground">
          <Link href="/login" className="text-primary underline-offset-4 hover:underline">
            {ne.podcast.signInToSubmit}
          </Link>{" "}
          {ne.podcast.signInSuffix}
        </CardContent>
      </Card>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Card className="border-border/70 bg-card/80 shadow-sm">
      <CardHeader>
        <CardTitle className="font-heading text-lg text-foreground">
          {ne.podcast.submitTitle}
        </CardTitle>
        <CardDescription>{ne.podcast.submitDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <YoutubeEmbedForm
          embedded
          onSuccess={() => router.refresh()}
        />
      </CardContent>
    </Card>
  );
}
