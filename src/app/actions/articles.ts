"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import { ne } from "@/lib/i18n/ne";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createArticle(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: ne.common.signInRequired };
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const excerpt = (formData.get("excerpt") as string) || null;
  const isPublished = formData.get("isPublished") === "on";

  if (!title?.trim() || !content?.trim()) {
    return { error: "शीर्षक र विषयवस्तु आवश्यक छ।" };
  }

  const slug = `${slugify(title)}-${Date.now().toString(36)}`;

  const { error } = await supabase.from("articles").insert({
    user_id: user.id,
    title: title.trim(),
    slug,
    content: content.trim(),
    excerpt: excerpt?.trim() || null,
    is_published: isPublished,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/my-profile");
  revalidatePath("/articles");

  if (formData.get("embedded") === "true") {
    return { success: true };
  }

  redirect("/my-profile");
}

export async function updateArticle(articleId: string, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: ne.common.signInRequired };
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const excerpt = (formData.get("excerpt") as string) || null;
  const isPublished = formData.get("isPublished") === "on";

  if (!title?.trim() || !content?.trim()) {
    return { error: "शीर्षक र विषयवस्तु आवश्यक छ।" };
  }

  const { data: existing } = await supabase
    .from("articles")
    .select("slug, user_id")
    .eq("id", articleId)
    .single();

  if (!existing || existing.user_id !== user.id) {
    return { error: ne.common.notAuthorized };
  }

  const { error } = await supabase
    .from("articles")
    .update({
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt?.trim() || null,
      is_published: isPublished,
    })
    .eq("id", articleId)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/my-profile");
  revalidatePath("/articles");
  revalidatePath(`/articles/${existing.slug}`);

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  if (profile?.username) {
    revalidatePath(`/profile/${profile.username}`);
  }

  redirect("/my-profile");
}

export async function deleteArticle(articleId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: ne.common.signInRequired };
  }

  const userIsAdmin = isAdmin(user.id);

  const { data: article } = await supabase
    .from("articles")
    .select("slug, user_id")
    .eq("id", articleId)
    .single();

  if (!article) {
    return { error: ne.common.notFound };
  }

  if (!userIsAdmin && article.user_id !== user.id) {
    return { error: ne.common.notAuthorized };
  }

  let deleteQuery = supabase.from("articles").delete().eq("id", articleId);
  if (!userIsAdmin) {
    deleteQuery = deleteQuery.eq("user_id", user.id);
  }

  const { error } = await deleteQuery;

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/my-profile");
  revalidatePath("/articles");
  revalidatePath(`/articles/${article.slug}`);

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", article.user_id)
    .single();

  if (profile?.username) {
    revalidatePath(`/profile/${profile.username}`);
  }

  return { success: true };
}
