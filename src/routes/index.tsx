import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, HeartHandshake, ShieldCheck, TrendingUp } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProjectCard, type ProjectCardData } from "@/components/projects/ProjectCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { financialProgress, formatMoney } from "@/lib/domain";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Terrier-Rouge Commune — Projets et transparence communautaire" },
      {
        name: "description",
        content:
          "Découvrez les projets de développement de Terrier-Rouge, suivez leur progression et contribuez à leur réalisation.",
      },
      { property: "og:title", content: "Terrier-Rouge Commune" },
      {
        property: "og:description",
        content: "Ensemble pour le développement de notre commune.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const { data: projects, isLoading } = useQuery({
    queryKey: ["public-projects", "home"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*, project_categories(name)")
        .eq("is_public", true)
        .order("created_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      return data as unknown as ProjectCardData[];
    },
  });

  const all = projects ?? [];
  const actifs = all.filter((p) => p.status === "en_cours").length;
  const realises = all.filter((p) => p.status === "termine").length;
  const collecte = all.reduce((sum, p) => sum + Number(p.amount_collected ?? 0), 0);
  const budget = all.reduce((sum, p) => sum + Number(p.budget ?? 0), 0);

  return (
    <SiteLayout>
      <section className="surface-hero text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Nord-Est · Haïti
          </p>
          <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight sm:text-5xl">
            Ensemble pour le développement de notre commune.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-primary-foreground/85 sm:text-lg">
            Découvrez les projets de développement de Terrier-Rouge, suivez leur progression et
            contribuez à leur réalisation.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="secondary">
              <Link to="/projects">
                Voir les projets <ArrowRight />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-gold text-gold-foreground hover:bg-gold/90"
            >
              <Link to="/projects">
                <HeartHandshake /> Appuyer un projet
              </Link>
            </Button>
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Projets actifs" value={String(actifs)} />
            <Stat label="Projets réalisés" value={String(realises)} />
            <Stat label="Montant collecté" value={formatMoney(collecte)} />
            <Stat label="Progression globale" value={`${financialProgress(collecte, budget)}%`} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Nos projets</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Chaque projet affiche son budget, les fonds reçus et l'avancement des travaux.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/projects">Tous les projets</Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-96 rounded-xl" />
              ))
            : all.map((p) => <ProjectCard key={p.id} project={p} />)}
        </div>
        {!isLoading && all.length === 0 ? (
          <p className="mt-10 text-center text-sm text-muted-foreground">
            Aucun projet publié pour le moment.
          </p>
        ) : null}
      </section>

      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-14 sm:grid-cols-3">
          <Pillar
            icon={<ShieldCheck className="size-5" />}
            title="Transparence"
            text="Budgets, fonds reçus et dépenses enregistrées sont consultables publiquement."
          />
          <Pillar
            icon={<TrendingUp className="size-5" />}
            title="Suivi réel"
            text="Progression financière et avancement des travaux suivis séparément."
          />
          <Pillar
            icon={<HeartHandshake className="size-5" />}
            title="Participation"
            text="Toute contribution est vérifiée avant d'être comptabilisée."
          />
        </div>
      </section>
    </SiteLayout>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-primary-foreground/15 bg-primary-foreground/10 p-4">
      <p className="text-xs uppercase tracking-wide text-primary-foreground/70">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}

function Pillar({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
      <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </span>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
