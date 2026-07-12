import { redirect } from "next/navigation";

type DashboardEditRedirectProps = {
  params: Promise<{ id: string }>;
};

export default async function DashboardPodcastEditRedirect({
  params,
}: DashboardEditRedirectProps) {
  const { id } = await params;
  redirect(`/my-profile/podcast/${id}/edit`);
}
