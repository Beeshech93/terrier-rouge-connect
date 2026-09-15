import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays, ImageIcon, MapPin, Receipt } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { DonationDialog } from "@/components/donations/DonationDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import {
  PROJECT_STATUS_CLASSES,
  PROJECT_STATUS_LABELS,
  financialProgress,
  formatDate,
  formatMoney,
  type Currency,
  type ProjectStatus,
} from "@/lib/domain";

export const Route = createFileRoute("/projects/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `Projet ${params.slug} — Terrier-Rouge Commune` },
      {
        name: "description",
        content:
          "Détails du projet communautaire : objectif financier, fonds collectés, dépenses, actualités et avancement des travaux.",
      },
      { property: "og:title", content: "Projet communautaire — Terrier-Rouge" },
      {
        property: "og:description",
        content: "Objectif financier, fonds collectés et avancement des travaux.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProjectDetail,
});

type ProjectRow = {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  budget: number | string;
  currency: Currency;
  amount_collected: number | string;
  project_progress: number;
  status: ProjectStatus;
  featured_image: string | null;
  video_url: string | null;
  start_date: string | null;
  expected_end_date: string | null;
  is_demo: boolean;
  project_categories?: { name: string } | null;
};

function ProjectDetail() {
  const { slug } = Route.useParams();

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*, project_categories(name)")
        .eq("slug", slug)
        .eq("is_public", true)
        .maybeSingle();
      if (error) throw error;
      return data as unknown as ProjectRow | null;
    },
  });

  const projectId = project?.id;

  const { data: updates } = useQuery({
    queryKey: ["project-updates", projectId],
    enabled: Boolean(projectId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_updates")
        .select("*")
        .eq("project_id", projectId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: images } = useQuery({
    queryKey: ["project-images", projectId],
    enabled: Boolean(projectId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_images")
        .select("*")
        .eq("project_id", projectId!)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: expenses } = useQuery({
    queryKey: ["project-expenses", projectId],
    enabled: Boolean(projectId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_expenses")
        .select("*")
        .eq("project_id", projectId!)
        .order("expense_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-5xl space-y-4 px-4 py-12">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-72 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      </SiteLayout>
    );
  }

  if (!project) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-xl px-4 py-24 text-center">
          <h1 className="text-2xl font-bold">Projet introuvable</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Ce projet n'existe pas ou n'est pas publié.
          </p>
          <Button asChild className="mt-6">
            <Link to="/projects">Retour aux projets</Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

  const collected = Number(project.amount_collected ?? 0);
  const budget = Number(project.budget ?? 0);
  const remaining = Math.max(0, budget - collected);
  const pct = financialProgress(collected, budget);
  const spent = (expenses ?? []).reduce((s, e) => s + Number(e.amount ?? 0), 0);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Tous les projets
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={PROJECT_STATUS_CLASSES[project.status]}>
                {PROJECT_STATUS_LABELS[project.status]}
              </Badge>
              {project.is_demo ? <Badge variant="outline">DEMO</Badge> : null}
              {project.project_categories?.name ? (
                <Badge variant="secondary">{project.project_categories.name}</Badge>
              ) : null}
            </div>
            <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">{project.title}</h1>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
              {project.location ? (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-4" /> {project.location}
                </span>
              ) : null}
              {project.start_date ? (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="size-4" /> Début {formatDate(project.start_date)}
                </span>
              ) : null}
              {project.expected_end_date ? (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="size-4" /> Fin prévue{" "}
                  {formatDate(project.expected_end_date)}
                </span>
              ) : null}
            </div>

            <div className="mt-6 overflow-hidden rounded-xl border border-border bg-secondary">
              {project.featured_image ? (
                <img
                  src={project.featured_image}
                  alt={project.title}
                  className="aspect-16/9 w-full object-cover"
                />
              ) : (
                <div className="grid aspect-16/9 place-items-center text-muted-foreground">
                  <ImageIcon className="size-10" />
                </div>
              )}
            </div>

            {project.description ? (
              <div className="mt-8">
                <h2 className="text-xl font-bold">Description</h2>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {project.description}
                </p>
              </div>
            ) : null}

            {project.video_url ? (
              <div className="mt-8">
                <h2 className="text-xl font-bold">Vidéo</h2>
                <div className="mt-3 aspect-16/9 overflow-hidden rounded-xl border border-border">
                  <iframe
                    src={project.video_url}
                    title={`Vidéo du projet ${project.title}`}
                    className="size-full"
                    allowFullScreen
                  />
                </div>
              </div>
            ) : null}

            {(images ?? []).length > 0 ? (
              <div className="mt-8">
                <h2 className="text-xl font-bold">Galerie</h2>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  {(images ?? []).map((img) => (
                    <figure key={img.id} className="overflow-hidden rounded-lg border border-border">
                      <img
                        src={img.image_url}
                        alt={img.caption ?? project.title}
                        loading="lazy"
                        className="aspect-4/3 w-full object-cover"
                      />
                      {img.caption ? (
                        <figcaption className="p-2 text-xs text-muted-foreground">
                          {img.caption}
                        </figcaption>
                      ) : null}
                    </figure>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-8">
              <h2 className="text-xl font-bold">Actualités du projet</h2>
              {(updates ?? []).length === 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  Aucune actualité publiée pour le moment.
                </p>
              ) : (
                <ol className="mt-4 space-y-4 border-l border-border pl-5">
                  {(updates ?? []).map((u) => (
                    <li key={u.id} className="relative">
                      <span className="absolute -left-[26px] top-1.5 size-3 rounded-full bg-primary" />
                      <p className="text-xs text-muted-foreground">{formatDate(u.created_at)}</p>
                      <h3 className="mt-0.5 font-semibold">{u.title}</h3>
                      {u.content ? (
                        <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">
                          {u.content}
                        </p>
                      ) : null}
                      {u.image_url ? (
                        <img
                          src={u.image_url}
                          alt={u.title}
                          loading="lazy"
                          className="mt-3 w-full max-w-md rounded-lg border border-border object-cover"
                        />
                      ) : null}
                      {typeof u.progress === "number" ? (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Avancement déclaré : {u.progress}%
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ol>
              )}
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold">Dépenses enregistrées</h2>
              {(expenses ?? []).length === 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  Aucune dépense enregistrée pour le moment.
                </p>
              ) : (
                <ul className="mt-3 divide-y divide-border rounded-xl border border-border">
                  {(expenses ?? []).map((e) => (
                    <li key={e.id} className="flex items-center justify-between gap-4 p-4 text-sm">
                      <span className="flex items-center gap-2">
                        <Receipt className="size-4 text-muted-foreground" />
                        <span>
                          {e.description}
                          <span className="block text-xs text-muted-foreground">
                            {formatDate(e.expense_date)}
                          </span>
                        </span>
                      </span>
                      <span className="font-medium">
                        {formatMoney(e.amount, e.currency as Currency)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Objectif financier
              </p>
              <p className="text-2xl font-bold">{formatMoney(budget, project.currency)}</p>

              <div className="mt-4 space-y-1.5 text-sm">
                <Row label="Collecté" value={formatMoney(collected, project.currency)} />
                <Row label="Restant" value={formatMoney(remaining, project.currency)} />
                <Row label="Dépensé" value={formatMoney(spent, project.currency)} />
              </div>

              <div className="mt-5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Progression financière</span>
                  <span>{pct}%</span>
                </div>
                <Progress value={pct} className="mt-1.5" />
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Progression des travaux</span>
                  <span>{project.project_progress}%</span>
                </div>
                <Progress value={project.project_progress} className="mt-1.5" />
              </div>

              <div className="mt-6">
                <DonationDialog project={project} className="w-full" />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Les contributions sont effectuées via Zelle et vérifiées manuellement avant d'être
                comptabilisées.
              </p>
            </div>

            {project.latitude && project.longitude ? (
              <div className="mt-4 rounded-xl border border-border bg-card p-4">
                <p className="text-sm font-semibold">Localisation</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {project.latitude.toFixed(5)}, {project.longitude.toFixed(5)}
                </p>
                <a
                  className="mt-2 inline-block text-sm text-primary underline"
                  href={`https://www.openstreetmap.org/?mlat=${project.latitude}&mlon=${project.longitude}#map=15/${project.latitude}/${project.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Voir sur la carte
                </a>
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </SiteLayout>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
