import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, Eye, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import {
  PROJECT_STATUS_CLASSES,
  PROJECT_STATUS_LABELS,
  formatMoney,
  slugify,
  type Currency,
  type ProjectStatus,
} from "@/lib/domain";

export const Route = createFileRoute("/_authenticated/admin/projects")({
  component: AdminProjects,
});

type FormState = {
  id: string | null;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  category_id: string;
  location: string;
  latitude: string;
  longitude: string;
  budget: string;
  currency: Currency;
  status: ProjectStatus;
  project_progress: string;
  start_date: string;
  expected_end_date: string;
  featured_image: string;
  video_url: string;
  is_public: boolean;
  is_demo: boolean;
};

const EMPTY_FORM: FormState = {
  id: null,
  title: "",
  slug: "",
  short_description: "",
  description: "",
  category_id: "",
  location: "",
  latitude: "",
  longitude: "",
  budget: "",
  currency: "USD",
  status: "planifie",
  project_progress: "0",
  start_date: "",
  expected_end_date: "",
  featured_image: "",
  video_url: "",
  is_public: false,
  is_demo: false,
};

function AdminProjects() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const categories = useQuery({
    queryKey: ["admin-categories-lite"],
    queryFn: async () => {
      const { data, error } = await supabase.from("project_categories").select("id, name").order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const projects = useQuery({
    queryKey: ["admin-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*, project_categories(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setSlugTouched(false);
    setOpen(true);
  };

  const openEdit = (p: NonNullable<typeof projects.data>[number]) => {
    setForm({
      id: p.id,
      title: p.title,
      slug: p.slug,
      short_description: p.short_description ?? "",
      description: p.description ?? "",
      category_id: p.category_id ?? "",
      location: p.location ?? "",
      latitude: p.latitude?.toString() ?? "",
      longitude: p.longitude?.toString() ?? "",
      budget: String(p.budget ?? 0),
      currency: p.currency as Currency,
      status: p.status as ProjectStatus,
      project_progress: String(p.project_progress ?? 0),
      start_date: p.start_date ?? "",
      expected_end_date: p.expected_end_date ?? "",
      featured_image: p.featured_image ?? "",
      video_url: p.video_url ?? "",
      is_public: p.is_public,
      is_demo: p.is_demo,
    });
    setSlugTouched(true);
    setOpen(true);
  };

  const onTitleChange = (title: string) => {
    setForm((f) => ({ ...f, title, slug: slugTouched ? f.slug : slugify(title) }));
  };

  const save = async () => {
    if (form.title.trim().length < 3) {
      toast.error("Le nom du projet est requis.");
      return;
    }
    if (form.slug.trim().length < 3) {
      toast.error("Le slug est requis.");
      return;
    }
    const budgetValue = Number(form.budget);
    if (!Number.isFinite(budgetValue) || budgetValue < 0) {
      toast.error("Budget invalide.");
      return;
    }

    setSaving(true);
    const { data: userData } = await supabase.auth.getUser();
    const payload = {
      title: form.title.trim(),
      slug: slugify(form.slug),
      short_description: form.short_description.trim() || null,
      description: form.description.trim() || null,
      category_id: form.category_id || null,
      location: form.location.trim() || null,
      latitude: form.latitude ? Number(form.latitude) : null,
      longitude: form.longitude ? Number(form.longitude) : null,
      budget: budgetValue,
      currency: form.currency,
      status: form.status,
      project_progress: Math.min(100, Math.max(0, Number(form.project_progress) || 0)),
      start_date: form.start_date || null,
      expected_end_date: form.expected_end_date || null,
      featured_image: form.featured_image.trim() || null,
      video_url: form.video_url.trim() || null,
      is_public: form.is_public,
      is_demo: form.is_demo,
    };

    const { error } = form.id
      ? await supabase.from("projects").update(payload).eq("id", form.id)
      : await supabase.from("projects").insert({ ...payload, created_by: userData.user?.id ?? null });

    setSaving(false);
    if (error) {
      toast.error(error.message.includes("duplicate") ? "Ce slug est déjà utilisé." : "Enregistrement impossible.");
      return;
    }
    toast.success(form.id ? "Projet mis à jour" : "Projet créé");
    setOpen(false);
    void queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
  };

  const togglePublic = async (id: string, next: boolean) => {
    const { error } = await supabase.from("projects").update({ is_public: next }).eq("id", id);
    if (error) {
      toast.error("Action impossible.");
      return;
    }
    toast.success(next ? "Projet publié" : "Projet dépublié");
    void queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      toast.error("Suppression impossible.");
      return;
    }
    toast.success("Projet supprimé");
    void queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold">Projets</h1>
        <Button onClick={openCreate}>
          <Plus className="size-4" /> Nouveau projet
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[860px] text-sm">
          <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-semibold">Projet</th>
              <th className="px-4 py-3 font-semibold">Budget</th>
              <th className="px-4 py-3 font-semibold">Collecté</th>
              <th className="px-4 py-3 font-semibold">Progression</th>
              <th className="px-4 py-3 font-semibold">Statut</th>
              <th className="px-4 py-3 font-semibold">Public</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(projects.data ?? []).map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-4 py-3">
                  <p className="font-medium">{p.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {(p as unknown as { project_categories?: { name: string } | null }).project_categories
                      ?.name ?? "—"}
                  </p>
                </td>
                <td className="px-4 py-3">{formatMoney(p.budget, p.currency as Currency)}</td>
                <td className="px-4 py-3">{formatMoney(p.amount_collected, p.currency as Currency)}</td>
                <td className="px-4 py-3">{p.project_progress}%</td>
                <td className="px-4 py-3">
                  <Badge className={PROJECT_STATUS_CLASSES[p.status as ProjectStatus]}>
                    {PROJECT_STATUS_LABELS[p.status as ProjectStatus]}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Button
                    size="sm"
                    variant={p.is_public ? "secondary" : "outline"}
                    onClick={() => togglePublic(p.id, !p.is_public)}
                  >
                    {p.is_public ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                    {p.is_public ? "Publié" : "Brouillon"}
                  </Button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(p)} aria-label="Modifier">
                      <Pencil className="size-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="ghost" aria-label="Supprimer">
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer ce projet ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action est irréversible et supprimera aussi les mises à jour,
                            images et dépenses associées.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={() => remove(p.id)}>Supprimer</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </td>
              </tr>
            ))}
            {(projects.data?.length ?? 0) === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  Aucun projet pour le moment.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{form.id ? "Modifier le projet" : "Nouveau projet"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="p-title">Nom du projet</Label>
              <Input id="p-title" value={form.title} onChange={(e) => onTitleChange(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-slug">Slug</Label>
              <Input
                id="p-slug"
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setForm((f) => ({ ...f, slug: e.target.value }));
                }}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Catégorie</Label>
              <Select
                value={form.category_id}
                onValueChange={(v) => setForm((f) => ({ ...f, category_id: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir" />
                </SelectTrigger>
                <SelectContent>
                  {(categories.data ?? []).map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="p-short">Description courte</Label>
              <Input
                id="p-short"
                maxLength={200}
                value={form.short_description}
                onChange={(e) => setForm((f) => ({ ...f, short_description: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="p-desc">Description complète</Label>
              <Textarea
                id="p-desc"
                rows={4}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-location">Localisation</Label>
              <Input
                id="p-location"
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="p-lat">Latitude</Label>
                <Input
                  id="p-lat"
                  type="number"
                  step="any"
                  value={form.latitude}
                  onChange={(e) => setForm((f) => ({ ...f, latitude: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-lng">Longitude</Label>
                <Input
                  id="p-lng"
                  type="number"
                  step="any"
                  value={form.longitude}
                  onChange={(e) => setForm((f) => ({ ...f, longitude: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-budget">Budget prévu</Label>
              <Input
                id="p-budget"
                type="number"
                min="0"
                step="0.01"
                value={form.budget}
                onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Devise</Label>
              <Select
                value={form.currency}
                onValueChange={(v) => setForm((f) => ({ ...f, currency: v as Currency }))}
              >
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
              <Label>Statut</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm((f) => ({ ...f, status: v as ProjectStatus }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(PROJECT_STATUS_LABELS) as ProjectStatus[]).map((s) => (
                    <SelectItem key={s} value={s}>
                      {PROJECT_STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-progress">Progression des travaux (%)</Label>
              <Input
                id="p-progress"
                type="number"
                min="0"
                max="100"
                value={form.project_progress}
                onChange={(e) => setForm((f) => ({ ...f, project_progress: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-start">Date de début</Label>
              <Input
                id="p-start"
                type="date"
                value={form.start_date}
                onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-end">Date prévue de fin</Label>
              <Input
                id="p-end"
                type="date"
                value={form.expected_end_date}
                onChange={(e) => setForm((f) => ({ ...f, expected_end_date: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="p-image">Image principale (URL)</Label>
              <Input
                id="p-image"
                value={form.featured_image}
                onChange={(e) => setForm((f) => ({ ...f, featured_image: e.target.value }))}
                placeholder="https://…"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="p-video">Vidéo (URL)</Label>
              <Input
                id="p-video"
                value={form.video_url}
                onChange={(e) => setForm((f) => ({ ...f, video_url: e.target.value }))}
                placeholder="https://…"
              />
            </div>
            <label className="flex items-center gap-2.5 text-sm">
              <Checkbox
                checked={form.is_public}
                onCheckedChange={(v) => setForm((f) => ({ ...f, is_public: v === true }))}
              />
              Projet public
            </label>
            <label className="flex items-center gap-2.5 text-sm">
              <Checkbox
                checked={form.is_demo}
                onCheckedChange={(v) => setForm((f) => ({ ...f, is_demo: v === true }))}
              />
              Marquer comme DEMO
            </label>
          </div>

          <Button className="mt-2 w-full" onClick={save} disabled={saving}>
            {saving ? "Enregistrement…" : form.id ? "Mettre à jour" : "Créer le projet"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
