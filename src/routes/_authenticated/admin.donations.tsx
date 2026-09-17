import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, Download, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { logAudit } from "@/lib/audit";
import {
  DONATION_STATUS_CLASSES,
  DONATION_STATUS_LABELS,
  formatDate,
  formatMoney,
  type Currency,
  type DonationStatus,
} from "@/lib/domain";

export const Route = createFileRoute("/_authenticated/admin/donations")({
  component: AdminDonations,
});

function AdminDonations() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<"all" | DonationStatus>("all");
  const [search, setSearch] = useState("");

  const donations = useQuery({
    queryKey: ["admin-donations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("donations")
        .select(
          "id, donor_name, donor_email, amount, currency, status, zelle_reference, message, created_at, confirmed_at, projects(title)",
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (donations.data ?? []).filter((d) => {
      if (status !== "all" && d.status !== status) return false;
      if (!q) return true;
      return (
        d.donor_name.toLowerCase().includes(q) ||
        d.donor_email.toLowerCase().includes(q) ||
        d.zelle_reference.toLowerCase().includes(q)
      );
    });
  }, [donations.data, status, search]);

  const setDonationStatus = async (id: string, next: DonationStatus) => {
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("donations")
      .update({
        status: next,
        confirmed_at: next === "confirmee" ? new Date().toISOString() : null,
        confirmed_by: userData.user?.id ?? null,
      })
      .eq("id", id);
    if (error) {
      toast.error("Mise à jour impossible.");
      return;
    }
    await logAudit(next === "confirmee" ? "CONFIRM_DONATION" : "REJECT_DONATION", {
      entityType: "donation",
      entityId: id,
    });
    toast.success(next === "confirmee" ? "Don confirmé" : "Don rejeté");
    void queryClient.invalidateQueries({ queryKey: ["admin-donations"] });
  };

  const exportCsv = () => {
    const header = [
      "Date",
      "Donateur",
      "Email",
      "Projet",
      "Montant",
      "Devise",
      "Reference",
      "Statut",
    ];
    const lines = rows.map((d) =>
      [
        new Date(d.created_at).toISOString(),
        d.donor_name,
        d.donor_email,
        d.projects?.title ?? "",
        String(d.amount),
        d.currency,
        d.zelle_reference,
        DONATION_STATUS_LABELS[d.status as DonationStatus],
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(","),
    );
    const blob = new Blob([[header.join(","), ...lines].join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dons-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Gestion des dons</h1>
          <p className="text-sm text-muted-foreground">
            Seuls les dons confirmés augmentent les fonds collectés.
          </p>
        </div>
        <Button variant="outline" onClick={exportCsv}>
          <Download /> Exporter CSV
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Rechercher un donateur, email ou référence"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="en_attente">En attente</SelectItem>
            <SelectItem value="confirmee">Confirmée</SelectItem>
            <SelectItem value="rejetee">Rejetée</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Donateur</th>
              <th className="px-4 py-3">Projet</th>
              <th className="px-4 py-3">Montant</th>
              <th className="px-4 py-3">Référence</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((d) => (
              <tr key={d.id}>
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                  {formatDate(d.created_at)}
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium">{d.donor_name}</p>
                  <p className="text-xs text-muted-foreground">{d.donor_email}</p>
                </td>
                <td className="px-4 py-3">{d.projects?.title ?? "—"}</td>
                <td className="whitespace-nowrap px-4 py-3 font-semibold">
                  {formatMoney(d.amount, d.currency as Currency)}
                </td>
                <td className="px-4 py-3 text-xs">{d.zelle_reference}</td>
                <td className="px-4 py-3">
                  <Badge className={DONATION_STATUS_CLASSES[d.status as DonationStatus]}>
                    {DONATION_STATUS_LABELS[d.status as DonationStatus]}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={d.status === "confirmee"}
                      onClick={() => setDonationStatus(d.id, "confirmee")}
                    >
                      <Check /> Confirmer
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={d.status === "rejetee"}
                      onClick={() => setDonationStatus(d.id, "rejetee")}
                    >
                      <X /> Rejeter
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 ? (
          <p className="px-4 py-6 text-sm text-muted-foreground">Aucun don pour ces filtres.</p>
        ) : null}
      </div>
    </div>
  );
}
