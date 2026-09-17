import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Save, Facebook, Share2, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { publishProjectToFacebook, type FacebookSettings } from "@/lib/facebook";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  return (
    <div className="space-y-8">
      <h1 className="text-xl font-bold">Paramètres</h1>
      <PaymentSettingsCard />
      <FacebookSettingsCard />
      <SiteSettingsCard />
    </div>
  );
}

function FacebookSettingsCard() {
  const queryClient = useQueryClient();
  const [pageId, setPageId] = useState("");
  const [pageName, setPageName] = useState("");
  const [pageToken, setPageToken] = useState("");
  const [active, setActive] = useState(false);
  const [autoPublish, setAutoPublish] = useState(false);
  const [saving, setSaving] = useState(false);
  const [bulkRunning, setBulkRunning] = useState(false);
  const [bulkResult, setBulkResult] = useState<{ ok: number; failed: number } | null>(null);

  const { data } = useQuery({
    queryKey: ["admin-facebook-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("facebook_settings")
        .select("*")
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as FacebookSettings | null;
    },
  });

  useEffect(() => {
    if (!data) return;
    setPageId(data.page_id ?? "");
    setPageName(data.page_name ?? "");
    setPageToken(data.page_access_token ?? "");
    setActive(data.is_active);
    setAutoPublish(data.auto_publish);
  }, [data]);

  const save = async () => {
    setSaving(true);
    const payload = {
      page_id: pageId.trim() || null,
      page_name: pageName.trim() || null,
      page_access_token: pageToken.trim() || null,
      is_active: active,
      auto_publish: autoPublish,
    };
    const { error } = data?.id
      ? await supabase.from("facebook_settings").update(payload).eq("id", data.id)
      : await supabase.from("facebook_settings").insert(payload);
    setSaving(false);
    if (error) {
      toast.error("Enregistrement impossible.");
      return;
    }
    toast.success("Paramètres Facebook mis à jour");
    void queryClient.invalidateQueries({ queryKey: ["admin-facebook-settings"] });
  };

  const publishAll = async () => {
    if (!pageId.trim() || !pageToken.trim()) {
      toast.error("Configurez et enregistrez d'abord la Page ID et le token.");
      return;
    }
    setBulkRunning(true);
    setBulkResult(null);
    const settings: FacebookSettings = {
      id: data?.id ?? "",
      page_id: pageId.trim(),
      page_name: pageName.trim() || null,
      page_access_token: pageToken.trim(),
      is_active: active,
      auto_publish: autoPublish,
    };

    const { data: projects, error } = await supabase
      .from("projects")
      .select("id, title, slug, short_description, budget, currency, location, featured_image")
      .eq("is_public", true);

    if (error || !projects) {
      setBulkRunning(false);
      toast.error("Impossible de charger les projets publics.");
      return;
    }

    let ok = 0;
    let failed = 0;
    for (const project of projects) {
      try {
        await publishProjectToFacebook(project, settings);
        ok += 1;
      } catch {
        failed += 1;
      }
    }
    setBulkRunning(false);
    setBulkResult({ ok, failed });
    if (ok > 0) toast.success(`${ok} projet(s) publié(s) sur Facebook.`);
    if (failed > 0) toast.error(`${failed} publication(s) ont échoué.`);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2">
        <Facebook className="size-4.5 text-primary" />
        <h2 className="font-semibold">Facebook</h2>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Publiez automatiquement les projets sur une Page Facebook. La connexion se fait avec un
        <strong> token d'accès de Page</strong> généré depuis{" "}
        <a
          href="https://developers.facebook.com/tools/explorer/"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          Meta for Developers → Graph API Explorer
        </a>{" "}
        (permissions <code>pages_manage_posts</code> et <code>pages_read_engagement</code>, puis
        convertissez-le en token longue durée). Aucune connexion automatique par « bouton » n'est
        possible sans créer votre propre application Meta.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="fb-page-id">Page ID</Label>
          <Input id="fb-page-id" value={pageId} onChange={(e) => setPageId(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="fb-page-name">Nom de la Page (repère interne)</Label>
          <Input id="fb-page-name" value={pageName} onChange={(e) => setPageName(e.target.value)} />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="fb-token">Token d'accès de Page</Label>
          <Input
            id="fb-token"
            type="password"
            autoComplete="off"
            value={pageToken}
            onChange={(e) => setPageToken(e.target.value)}
            placeholder="EAAG…"
          />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <label className="flex items-center gap-2.5 text-sm">
          <Checkbox checked={active} onCheckedChange={(v) => setActive(v === true)} />
          Connexion Facebook active
        </label>
        <label className="flex items-center gap-2.5 text-sm">
          <Checkbox checked={autoPublish} onCheckedChange={(v) => setAutoPublish(v === true)} />
          Publier automatiquement chaque projet dès qu'il devient public
        </label>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button onClick={save} disabled={saving}>
          <Save className="size-4" /> {saving ? "Enregistrement…" : "Enregistrer"}
        </Button>
        <Button variant="outline" onClick={publishAll} disabled={bulkRunning || !active}>
          {bulkRunning ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Share2 className="size-4" />
          )}
          {bulkRunning ? "Publication en cours…" : "Publier tous les projets publics maintenant"}
        </Button>
      </div>

      {bulkResult ? (
        <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
          <CheckCircle2 className="size-4 text-success" />
          {bulkResult.ok} réussie(s), {bulkResult.failed} échouée(s).
        </p>
      ) : null}
    </div>
  );
}

function PaymentSettingsCard() {
  const queryClient = useQueryClient();
  const [zelleEmail, setZelleEmail] = useState("");
  const [zellePhone, setZellePhone] = useState("");
  const [beneficiary, setBeneficiary] = useState("");
  const [instructions, setInstructions] = useState("");
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const { data } = useQuery({
    queryKey: ["admin-payment-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_settings")
        .select("*")
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!data) return;
    setZelleEmail(data.zelle_email ?? "");
    setZellePhone(data.zelle_phone ?? "");
    setBeneficiary(data.beneficiary_name ?? "");
    setInstructions(data.instructions ?? "");
    setActive(data.is_active);
  }, [data]);

  const save = async () => {
    setSaving(true);
    const payload = {
      zelle_email: zelleEmail.trim() || null,
      zelle_phone: zellePhone.trim() || null,
      beneficiary_name: beneficiary.trim() || null,
      instructions: instructions.trim() || null,
      is_active: active,
    };
    const { error } = data?.id
      ? await supabase.from("payment_settings").update(payload).eq("id", data.id)
      : await supabase.from("payment_settings").insert(payload);
    setSaving(false);
    if (error) {
      toast.error("Enregistrement impossible.");
      return;
    }
    toast.success("Paramètres Zelle mis à jour");
    void queryClient.invalidateQueries({ queryKey: ["admin-payment-settings"] });
    void queryClient.invalidateQueries({ queryKey: ["payment-settings"] });
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="font-semibold">Zelle — Paiements</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Ces informations sont affichées aux donateurs lorsqu'ils appuient un projet
        financièrement. Le paiement reste manuel : aucune intégration automatique avec Zelle.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="zelle-email">Zelle Email</Label>
          <Input
            id="zelle-email"
            type="email"
            value={zelleEmail}
            onChange={(e) => setZelleEmail(e.target.value)}
            placeholder="donations@example.com"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="zelle-phone">Zelle Phone</Label>
          <Input
            id="zelle-phone"
            value={zellePhone}
            onChange={(e) => setZellePhone(e.target.value)}
            placeholder="+1 555 000 0000"
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="beneficiary">Nom du bénéficiaire</Label>
          <Input
            id="beneficiary"
            value={beneficiary}
            onChange={(e) => setBeneficiary(e.target.value)}
            placeholder="Terrier-Rouge Development Project"
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="instructions">Instructions</Label>
          <Textarea
            id="instructions"
            rows={3}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Envoyez votre contribution via Zelle puis indiquez la référence du paiement dans le formulaire."
          />
        </div>
      </div>

      <label className="mt-4 flex items-center gap-2.5 text-sm">
        <Checkbox checked={active} onCheckedChange={(v) => setActive(v === true)} />
        Zelle actif (visible sur le site)
      </label>

      <Button className="mt-4" onClick={save} disabled={saving}>
        <Save className="size-4" /> {saving ? "Enregistrement…" : "Enregistrer"}
      </Button>
    </div>
  );
}

function SiteSettingsCard() {
  const queryClient = useQueryClient();
  const [siteName, setSiteName] = useState("");
  const [description, setDescription] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);

  const { data } = useQuery({
    queryKey: ["admin-site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!data) return;
    setSiteName(data.site_name ?? "");
    setDescription(data.description ?? "");
    setContactEmail(data.contact_email ?? "");
    setPhone(data.phone ?? "");
    setAddress(data.address ?? "");
  }, [data]);

  const save = async () => {
    setSaving(true);
    const payload = {
      site_name: siteName.trim() || "Terrier-Rouge Commune",
      description: description.trim() || null,
      contact_email: contactEmail.trim() || null,
      phone: phone.trim() || null,
      address: address.trim() || null,
    };
    const { error } = data?.id
      ? await supabase.from("site_settings").update(payload).eq("id", data.id)
      : await supabase.from("site_settings").insert(payload);
    setSaving(false);
    if (error) {
      toast.error("Enregistrement impossible.");
      return;
    }
    toast.success("Paramètres du site mis à jour");
    void queryClient.invalidateQueries({ queryKey: ["admin-site-settings"] });
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="font-semibold">Informations du site</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="site-name">Nom du site</Label>
          <Input id="site-name" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contact-email">Email de contact</Label>
          <Input
            id="contact-email"
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Téléphone</Label>
          <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="address">Adresse</Label>
          <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="site-desc">Description</Label>
          <Textarea
            id="site-desc"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>
      <Button className="mt-4" onClick={save} disabled={saving}>
        <Save className="size-4" /> {saving ? "Enregistrement…" : "Enregistrer"}
      </Button>
    </div>
  );
}
