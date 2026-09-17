import { supabase } from "@/integrations/supabase/client";

export type AuditAction =
  | "CREATE_PROJECT"
  | "UPDATE_PROJECT"
  | "DELETE_PROJECT"
  | "PUBLISH_PROJECT"
  | "UNPUBLISH_PROJECT"
  | "CONFIRM_DONATION"
  | "REJECT_DONATION"
  | "UPDATE_PROJECT_PROGRESS"
  | "ADD_PROJECT_UPDATE"
  | "UPDATE_ZELLE_SETTINGS"
  | "LOGIN";

export async function logAudit(
  action: AuditAction,
  options: {
    entityType?: string;
    entityId?: string | null;
    metadata?: Record<string, unknown>;
  } = {},
) {
  const { data } = await supabase.auth.getUser();
  const userId = data.user?.id;
  if (!userId) return;
  await supabase.from("audit_logs").insert({
    user_id: userId,
    action,
    entity_type: options.entityType ?? null,
    entity_id: options.entityId ?? null,
    metadata: (options.metadata ?? {}) as never,
  });
}
