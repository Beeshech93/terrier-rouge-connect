import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProjectCard, type ProjectCardData } from "@/components/projects/ProjectCard";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { PROJECT_STATUS_LABELS, type ProjectStatus } from "@/lib/domain";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "Projets communautaires — Terrier-Rouge Commune" },
      {
        name: "description",
        content:
          "Liste des projets publics de la Commune de Terrier-Rouge : budget, fonds collectés et avancement des travaux.",
      },
      { property: "og:title", content: "Projets communautaires — Terrier-Rouge" },
      {
        property: "og:description",
        content: "Budgets, fonds collectés et avancement de chaque projet communal.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_categories")
        .select("id, name")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: projects, isLoading } = useQuery({
    queryKey: ["public-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*, project_categories(name)")
        .eq("is_public", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as (ProjectCardData & { category_id: string | null })[];
    },
  });

  const list = (projects ?? []).filter((p) => {
    const matchQ =
      !q ||
      p.title.toLowerCase().includes(q.toLowerCase()) ||
      (p.short_description ?? "").toLowerCase().includes(q.toLowerCase());
    const matchStatus = status === "all" || p.status === status;
    const matchCat = category === "all" || p.category_id === category;
    return matchQ && matchStatus && matchCat;
  });

  return (
    <SiteLayout>
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h1 className="text-3xl font-bold sm:text-4xl">Projets communautaires</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Chaque projet publié affiche son budget, les fonds reçus et l'avancement réel des
            travaux.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher un projet"
              className="pl-9"
              aria-label="Rechercher un projet"
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="sm:w-48" aria-label="Filtrer par statut">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              {(Object.keys(PROJECT_STATUS_LABELS) as ProjectStatus[]).map((s) => (
                <SelectItem key={s} value={s}>
                  {PROJECT_STATUS_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="sm:w-56" aria-label="Filtrer par catégorie">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {(categories ?? []).map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-96 rounded-xl" />)
            : list.map((p) => <ProjectCard key={p.id} project={p} />)}
        </div>
        {!isLoading && list.length === 0 ? (
          <p className="mt-12 text-center text-sm text-muted-foreground">
            Aucun projet ne correspond à votre recherche.
          </p>
        ) : null}
      </section>
    </SiteLayout>
  );
}
