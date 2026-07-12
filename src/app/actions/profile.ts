"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { ne } from "@/lib/i18n/ne";

type UpdateProfileInput = {
  username: string;
  fullName: string;
  bio: string;
};

export async function updateProfile(input: UpdateProfileInput) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: ne.common.signInRequired };
  }

  const username = input.username.trim().toLowerCase();
  const fullName = input.fullName.trim();
  const bio = input.bio.trim();

  if (!username || username.length < 3) {
    return { error: "प्रयोगकर्ता नाम कम्तीमा ३ अक्षरको हुनुपर्छ।" };
  }

  if (!/^[a-z0-9_]+$/.test(username)) {
    return {
      error: "प्रयोगकर्ता नाममा अङ्ग्रेजी अक्षर, संख्या र अन्डरस्कोर मात्र प्रयोग गर्नुहोस्।",
    };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      username,
      full_name: fullName || null,
      bio: bio || null,
    })
    .eq("id", user.id);

  if (error) {
    if (error.code === "23505") {
      return { error: "यो प्रयोगकर्ता नाम पहिले नै लिइसकिएको छ।" };
    }
    return { error: error.message };
  }

  revalidatePath("/my-profile");
  revalidatePath(`/profile/${username}`);

  return { success: true, username };
}
