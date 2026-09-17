import { supabase } from "@/integrations/supabase/client";
import { formatMoney } from "@/lib/domain";

export type FacebookSettings = {
  id: string;
  page_id: string | null;
  page_name: string | null;
  page_access_token: string | null;
  is_active: boolean;
  auto_publish: boolean;
};

export type PublishableProject = {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  budget: number;
  currency: "USD" | "HTG";
  location: string | null;
  featured_image: string | null;
};

const GRAPH_VERSION = "v19.0";

export function buildProjectMessage(project: PublishableProject) {
  const lines = [
    `📢 ${project.title}`,
    project.short_description ? project.short_description : null,
    project.location ? `📍 ${project.location}` : null,
    `💰 Budget : ${formatMoney(project.budget, project.currency)}`,
    "",
    "Suivez ce projet et contribuez sur Terrier-Rouge Commune.",
  ].filter(Boolean);
  return lines.join("\n");
}

export function projectPublicUrl(slug: string) {
  if (typeof window === "undefined") return `/projects/${slug}`;
  return `${window.location.origin}/projects/${slug}`;
}

/**
 * Publishes a single project to the configured Facebook Page feed.
 * Throws with a human-readable message on failure.
 */
export async function publishProjectToFacebook(
  project: PublishableProject,
  settings: FacebookSettings,
) {
  if (!settings.page_id || !settings.page_access_token) {
    throw new Error("Facebook n'est pas configuré (Page ID ou token manquant).");
  }

  const link = projectPublicUrl(project.slug);
  const message = buildProjectMessage(project);

  const endpoint = project.featured_image
    ? `https://graph.facebook.com/${GRAPH_VERSION}/${settings.page_id}/photos`
    : `https://graph.facebook.com/${GRAPH_VERSION}/${settings.page_id}/feed`;

  const body = new URLSearchParams({
    access_token: settings.page_access_token,
    message,
    link,
  });
  if (project.featured_image) {
    body.set("url", project.featured_image);
    body.delete("link");
    body.append("caption", link);
  }

  const res = await fetch(endpoint, { method: "POST", body });
  const json = (await res.json().catch(() => null)) as
    | { id?: string; post_id?: string; error?: { message?: string } }
    | null;

  if (!res.ok || !json || json.error) {
    throw new Error(json?.error?.message ?? "Échec de la publication Facebook.");
  }

  const postId = json.post_id ?? json.id ?? null;

  const { error: updateError } = await supabase
    .from("projects")
    .update({
      facebook_post_id: postId,
      facebook_published_at: new Date().toISOString(),
    })
    .eq("id", project.id);
  if (updateError) throw updateError;

  return postId;
}

export async function fetchActiveFacebookSettings() {
  const { data, error } = await supabase
    .from("facebook_settings")
    .select("*")
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data as FacebookSettings | null;
}
