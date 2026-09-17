import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { formatDate, formatMoney, type Currency } from "@/lib/domain";

export const Route = createFileRoute("/_authenticated/admin/expenses")({
  component: AdminExpenses,
});

function AdminExpenses() {
  const queryClient = useQueryClient();
  const [projectId, setProjectId] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const projects = useQuery({
    queryKey: ["admin-projects-lite"],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("id, title").order("title");
      if (error) throw error;
      return data ?? [];
    },
  });

  const expenses = useQuery({
    queryKey: ["admin-expenses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_expenses")
        .select("id, description, amount, currency, expense_date, projects(title)")
        .order("expense_date", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const add = async () => {
    const value = Number(amount);
    if (!projectId || description.trim().length < 3 || !Number.isFinite(value) || value <= 0) {
      toast.error("Projet, description et montant valides requis");
      return;
    }
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase.from("project_expenses").insert({
      project_id: projectId,
      description: description.trim(),
      amount: value,
      currency,
      expense_date: date,
      created_by: userData.user?.id ?? null,
    });
    if (error) {
      toast.error("Enregistrement impossible.");
      return;
    }
    setDescription("");
    setAmount("");
    toast.success("Dépense enregistrée");
    void queryClient.invalidateQueries({ queryKey: ["admin-expenses"] });
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("project_expenses").delete().eq("id", id);
    if (error) {
      toast.error("Suppression impossible.");
      return;
    }
    void queryClient.invalidateQueries({ queryKey: ["admin-expenses"] });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Dépenses</h1>

      <div className="rounded-xl border border-border bg-card p-5">
        <div className="grid gap-4 lg:grid-cols-5 lg:items-end">
          <div className="space-y-1.5">
            <Label>Projet</Label>
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir" />
              </SelectTrigger>
              <SelectContent>
                {(projects.data ?? []).map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="exp-desc">Description</Label>
            <Input
              id="exp-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={200}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="exp-amount">Montant</Label>
            <Input
              id="exp-amount"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Devise</Label>
            <Select value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="HTG">HTG</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="exp-date">Date</Label>
            <Input
              id="exp-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>
        <Button className="mt-4" onClick={add}>
          Enregistrer la dépense
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <ul className="divide-y divide-border">
          {(expenses.data ?? []).map((e) => (
            <li key={e.id} className="flex items-center justify-between gap-3 px-5 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{e.description}</p>
                <p className="text-xs text-muted-foreground">
                  {e.projects?.title ?? "—"} · {formatDate(e.expense_date)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold">
                  {formatMoney(e.amount, e.currency as Currency)}
                </span>
                <Button size="icon" variant="ghost" onClick={() => remove(e.id)} aria-label="Supprimer">
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
        {(expenses.data?.length ?? 0) === 0 ? (
          <p className="px-5 py-6 text-sm text-muted-foreground">Aucune dépense enregistrée.</p>
        ) : null}
      </div>
    </div>
  );
}
