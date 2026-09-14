import { Link } from "@tanstack/react-router";
import { ImageIcon, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  PROJECT_STATUS_CLASSES,
  PROJECT_STATUS_LABELS,
  financialProgress,
  formatMoney,
  type Currency,
  type ProjectStatus,
} from "@/lib/domain";

export type ProjectCardData = {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  featured_image: string | null;
  location: string | null;
  budget: number | string;
  currency: Currency;
  amount_collected: number | string;
  project_progress: number;
  status: ProjectStatus;
  is_demo?: boolean;
  project_categories?: { name: string } | null;
};

export function ProjectCard({ project }: { project: ProjectCardData }) {
  const pct = financialProgress(project.amount_collected, project.budget);

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-lift)]">
      <div className="relative aspect-16/9 overflow-hidden bg-secondary">
        {project.featured_image ? (
          <img
            src={project.featured_image}
            alt={project.title}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid size-full place-items-center text-muted-foreground">
            <ImageIcon className="size-8" />
          </div>
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <Badge className={PROJECT_STATUS_CLASSES[project.status]}>
            {PROJECT_STATUS_LABELS[project.status]}
          </Badge>
          {project.is_demo ? <Badge variant="outline" className="bg-background">DEMO</Badge> : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {project.project_categories?.name ? (
            <span className="rounded-full bg-secondary px-2.5 py-1 font-medium text-secondary-foreground">
              {project.project_categories.name}
            </span>
          ) : null}
          {project.location ? (
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5" /> {project.location}
            </span>
          ) : null}
        </div>

        <h3 className="text-base font-semibold leading-snug">{project.title}</h3>
        {project.short_description ? (
          <p className="line-clamp-2 text-sm text-muted-foreground">{project.short_description}</p>
        ) : null}

        <div className="mt-auto space-y-2 pt-2">
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-semibold">
              {formatMoney(project.amount_collected, project.currency)}
            </span>
            <span className="text-muted-foreground">
              sur {formatMoney(project.budget, project.currency)}
            </span>
          </div>
          <Progress value={pct} />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Financement {pct}%</span>
            <span>Travaux {project.project_progress}%</span>
          </div>
        </div>

        <Button asChild className="mt-2 w-full">
          <Link to="/projects/$slug" params={{ slug: project.slug }}>
            Voir le projet
          </Link>
        </Button>
      </div>
    </article>
  );
}
