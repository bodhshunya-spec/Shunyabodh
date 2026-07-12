import { redirect } from "next/navigation";

type DashboardEditRedirectProps = {
  params: Promise<{ id: string }>;
};

export default async function DashboardArticleEditRedirect({
  params,
}: DashboardEditRedirectProps) {
  const { id } = await params;
  redirect(`/my-profile/articles/${id}/edit`);
}
