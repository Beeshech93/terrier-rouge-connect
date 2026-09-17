import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { slugify } from "@/lib/domain";

export const Route = createFileRoute("/_authenticated/admin/categories")({
  component: AdminCategories,
});

function AdminCategories() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const categories = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_categories")
        .select("id, name, slug, description")
        .order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const add = async () => {
    if (name.trim().length < 2) {
      toast.error("Nom de catégorie requis");
      return;
    }
    const { error } = await supabase.from("project_categories").insert({
      name: name.trim(),
      slug: slugify(name),
      description: description.trim() || null,
    });
    if (error) {
      toast.error("Création impossible (nom ou slug déjà utilisé ?)");
      return;
    }
    setName("");
    setDescription("");
    toast.success("Catégorie ajoutée");
    void queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("project_categories").delete().eq("id", id);
    if (error) {
      toast.error("Suppression impossible : catégorie utilisée par un projet.");
      return;
    }
    toast.success("Catégorie supprimée");
    void queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Catégories</h1>

      <div className="rounded-xl border border-border bg-card p-5">
        <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <div className="space-y-1.5">
            <Label htmlFor="cat-name">Nom</Label>
            <Input id="cat-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cat-desc">Description</Label>
            <Input
              id="cat-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={200}
            />
          </div>
          <Button onClick={add}>Ajouter</Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <ul className="divide-y divide-border">
          {(categories.data ?? []).map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-3 px-5 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{c.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {c.slug}
                  {c.description ? ` · ${c.description}` : ""}
                </p>
              </div>
              <Button size="icon" variant="ghost" onClick={() => remove(c.id)} aria-label="Supprimer">
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
