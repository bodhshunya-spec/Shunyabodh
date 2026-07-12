import { redirect } from "next/navigation";

type DashboardEditRedirectProps = {
  params: Promise<{ id: string }>;
};

export default async function DashboardMediaEditRedirect({
  params,
}: DashboardEditRedirectProps) {
  const { id } = await params;
  redirect(`/my-profile/media/${id}/edit`);
}
