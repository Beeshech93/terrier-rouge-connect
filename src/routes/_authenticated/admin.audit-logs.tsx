import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/lib/domain";

export const Route = createFileRoute("/_authenticated/admin/audit-logs")({
  component: AdminAuditLogs,
});

function AdminAuditLogs() {
  const logs = useQuery({
    queryKey: ["admin-audit"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("id, action, entity_type, entity_id, metadata, created_at, user_id")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Journal d'audit</h1>
        <p className="text-sm text-muted-foreground">200 dernières actions administratives.</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Entité</th>
              <th className="px-4 py-3">Détails</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(logs.data ?? []).map((l) => (
              <tr key={l.id}>
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                  {formatDate(l.created_at)}
                </td>
                <td className="px-4 py-3 font-medium">{l.action}</td>
                <td className="px-4 py-3 text-muted-foreground">{l.entity_type ?? "—"}</td>
                <td className="max-w-md truncate px-4 py-3 text-xs text-muted-foreground">
                  {JSON.stringify(l.metadata ?? {})}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(logs.data?.length ?? 0) === 0 ? (
          <p className="px-4 py-6 text-sm text-muted-foreground">Aucune action enregistrée.</p>
        ) : null}
      </div>
    </div>
  );
}
