import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import {
  PROJECT_STATUS_LABELS,
  formatMoney,
  type ProjectStatus,
} from "@/lib/domain";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const stats = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [projects, donations, expenses] = await Promise.all([
        supabase.from("projects").select("id, title, status, budget, amount_collected, is_public"),
        supabase.from("donations").select("id, amount, status"),
        supabase.from("project_expenses").select("id, amount"),
      ]);
      if (projects.error) throw projects.error;
      if (donations.error) throw donations.error;
      if (expenses.error) throw expenses.error;
      return {
        projects: projects.data ?? [],
        donations: donations.data ?? [],
        expenses: expenses.data ?? [],
      };
    },
  });

  if (stats.isLoading || !stats.data) {
    return <p className="text-sm text-muted-foreground">Chargement…</p>;
  }

  const { projects, donations, expenses } = stats.data;
  const totalBudget = projects.reduce((s, p) => s + Number(p.budget ?? 0), 0);
  const totalCollected = projects.reduce((s, p) => s + Number(p.amount_collected ?? 0), 0);
  const totalSpent = expenses.reduce((s, e) => s + Number(e.amount ?? 0), 0);
  const pending = donations.filter((d) => d.status === "en_attente");

  const statusData = (Object.keys(PROJECT_STATUS_LABELS) as ProjectStatus[]).map((s) => ({
    name: PROJECT_STATUS_LABELS[s],
    value: projects.filter((p) => p.status === s).length,
  }));

  const topProjects = [...projects]
    .sort((a, b) => Number(b.amount_collected ?? 0) - Number(a.amount_collected ?? 0))
    .slice(0, 6)
    .map((p) => ({
      name: p.title.length > 18 ? `${p.title.slice(0, 18)}…` : p.title,
      collecte: Number(p.amount_collected ?? 0),
      budget: Number(p.budget ?? 0),
    }));

  const COLORS = ["#94a3b8", "#0ea5e9", "#f59e0b", "#1d4ed8", "#ef4444"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Tableau de bord</h1>
        <p className="text-sm text-muted-foreground">Vue d'ensemble de la plateforme.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Projets" value={String(projects.length)} hint={`${projects.filter((p) => p.is_public).length} publiés`} />
        <Kpi label="Budget total" value={formatMoney(totalBudget)} />
        <Kpi label="Fonds collectés" value={formatMoney(totalCollected)} hint={`Dépensé : ${formatMoney(totalSpent)}`} />
        <Kpi label="Dons en attente" value={String(pending.length)} hint={`${donations.length} dons au total`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">Collecte par projet</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProjects}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip formatter={(v: number) => formatMoney(v)} />
                <Bar dataKey="budget" fill="#cbd5e1" radius={4} />
                <Bar dataKey="collecte" fill="#1d4ed8" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">Projets par statut</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={90} label>
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function Kpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
