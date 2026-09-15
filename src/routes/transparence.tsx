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
import { SiteLayout } from "@/components/site/SiteLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { formatMoney } from "@/lib/domain";

export const Route = createFileRoute("/transparence")({
  head: () => ({
    meta: [
      { title: "Transparence financière — Terrier-Rouge Commune" },
      {
        name: "description",
        content:
          "Budget total, fonds collectés et dépenses des projets publics de la Commune de Terrier-Rouge.",
      },
      { property: "og:title", content: "Transparence financière — Terrier-Rouge" },
      {
        property: "og:description",
        content: "Budgets, fonds collectés et dépenses consultables publiquement.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TransparencePage,
});

const COLORS = ["var(--color-primary)", "var(--color-accent)", "var(--color-gold)"];

function TransparencePage() {
  const { data, isLoading } = useQuery({
    queryKey: ["transparence"],
    queryFn: async () => {
      const [{ data: projects, error: pe }, { data: expenses, error: ee }] = await Promise.all([
        supabase
          .from("projects")
          .select("id, title, budget, amount_collected, currency, status")
          .eq("is_public", true),
        supabase.from("project_expenses").select("project_id, amount"),
      ]);
      if (pe) throw pe;
      if (ee) throw ee;
      return { projects: projects ?? [], expenses: expenses ?? [] };
    },
  });

  const projects = data?.projects ?? [];
  const expenses = data?.expenses ?? [];

  const budget = projects.reduce((s, p) => s + Number(p.budget ?? 0), 0);
  const collected = projects.reduce((s, p) => s + Number(p.amount_collected ?? 0), 0);
  const spent = expenses.reduce((s, e) => s + Number(e.amount ?? 0), 0);

  const byProject = projects.map((p) => ({
    name: p.title.length > 18 ? `${p.title.slice(0, 18)}…` : p.title,
    Budget: Number(p.budget ?? 0),
    Collecté: Number(p.amount_collected ?? 0),
    Dépensé: expenses
      .filter((e) => e.project_id === p.id)
      .reduce((s, e) => s + Number(e.amount ?? 0), 0),
  }));

  const pie = [
    { name: "Collecté", value: collected },
    { name: "Dépensé", value: spent },
    { name: "Restant à collecter", value: Math.max(0, budget - collected) },
  ];

  return (
    <SiteLayout>
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h1 className="text-3xl font-bold sm:text-4xl">Transparence financière</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Toutes les données proviennent des projets publiés. Seules les contributions confirmées
            par l'administration sont comptabilisées.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        {isLoading ? (
          <Skeleton className="h-32 w-full rounded-xl" />
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            <Kpi label="Budget total" value={formatMoney(budget)} />
            <Kpi label="Fonds collectés" value={formatMoney(collected)} />
            <Kpi label="Dépenses enregistrées" value={formatMoney(spent)} />
          </div>
        )}

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-lg font-semibold">Budget, collecte et dépenses par projet</h2>
            <div className="mt-4 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byProject}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-20} dy={10} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: number) => formatMoney(v)} />
                  <Bar dataKey="Budget" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Collecté" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Dépensé" fill="var(--color-gold)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-lg font-semibold">Répartition globale</h2>
            <div className="mt-4 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pie} dataKey="value" nameKey="name" outerRadius={100} label>
                    {pie.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatMoney(v)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}
