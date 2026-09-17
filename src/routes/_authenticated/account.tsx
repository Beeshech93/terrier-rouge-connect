import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  DONATION_STATUS_CLASSES,
  DONATION_STATUS_LABELS,
  formatDate,
  formatMoney,
  type Currency,
  type DonationStatus,
} from "@/lib/domain";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({
    meta: [
      { title: "Mon compte — Terrier-Rouge Commune" },
      {
        name: "description",
        content: "Gérez votre profil et suivez l'état de vos contributions financières.",
      },
      { property: "og:title", content: "Mon compte — Terrier-Rouge Commune" },
      { property: "og:description", content: "Profil donateur et historique des contributions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);

  const profile = useQuery({
    queryKey: ["profile", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, created_at")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const donations = useQuery({
    queryKey: ["my-donations", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("donations")
        .select("id, amount, currency, status, created_at, zelle_reference, projects(title, slug)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  useEffect(() => {
    if (profile.data?.full_name) setFullName(profile.data.full_name);
  }, [profile.data?.full_name]);

  const save = async () => {
    if (!user) return;
    if (fullName.trim().length < 2) {
      toast.error("Nom complet requis");
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName.trim() })
      .eq("id", user.id);
    setSaving(false);
    if (error) {
      toast.error("Enregistrement impossible.");
      return;
    }
    toast.success("Profil mis à jour");
    void queryClient.invalidateQueries({ queryKey: ["profile"] });
  };

  return (
    <SiteLayout>
      <div className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-2xl font-bold">Mon compte</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Vos informations et l'état de vos contributions.
        </p>

        <section className="mt-6 rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">Profil</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="full_name">Nom complet</Label>
              <Input
                id="full_name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                maxLength={120}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user?.email ?? ""} disabled />
            </div>
          </div>
          <Button className="mt-4" onClick={save} disabled={saving}>
            Enregistrer
          </Button>
        </section>

        <section className="mt-6 rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">Mes contributions</h2>
          {donations.isLoading ? (
            <p className="mt-3 text-sm text-muted-foreground">Chargement…</p>
          ) : (donations.data?.length ?? 0) === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Aucune contribution enregistrée pour le moment.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {donations.data!.map((d) => (
                <li key={d.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {d.projects?.title ?? "Projet"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(d.created_at)} · Réf. {d.zelle_reference}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">
                      {formatMoney(d.amount, d.currency as Currency)}
                    </span>
                    <Badge className={DONATION_STATUS_CLASSES[d.status as DonationStatus]}>
                      {DONATION_STATUS_LABELS[d.status as DonationStatus]}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </SiteLayout>
  );
}
