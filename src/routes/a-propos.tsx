import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { HeartHandshake, ShieldCheck, Users } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos — Terrier-Rouge Commune" },
      {
        name: "description",
        content:
          "La plateforme de gestion et de transparence communautaire de la Commune de Terrier-Rouge, Nord-Est, Haïti.",
      },
      { property: "og:title", content: "À propos — Terrier-Rouge Commune" },
      {
        property: "og:description",
        content: "Mission, fonctionnement et engagement de transparence de la plateforme.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { data: site } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  return (
    <SiteLayout>
      <section className="surface-hero text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h1 className="max-w-3xl text-3xl font-bold sm:text-4xl">
            Une plateforme au service de la commune
          </h1>
          <p className="mt-4 max-w-2xl text-primary-foreground/85">
            Cette plateforme rassemble les projets de développement de Terrier-Rouge et rend
            publiques leurs données financières et leur avancement.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12">
        <h2 className="text-2xl font-bold">Notre mission</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Donner à chaque habitant et à chaque membre de la diaspora une vision claire des projets
          communaux : ce qui est prévu, ce qui est financé, ce qui est dépensé et ce qui est
          réalisé. La progression financière et l'avancement réel des travaux sont suivis
          séparément afin d'éviter toute confusion.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          <Card
            icon={<ShieldCheck className="size-5" />}
            title="Transparence"
            text="Budgets, contributions confirmées et dépenses sont publiés projet par projet."
          />
          <Card
            icon={<Users className="size-5" />}
            title="Deux rôles"
            text="Administrateurs gèrent les projets et les contributions ; donateurs consultent et appuient."
          />
          <Card
            icon={<HeartHandshake className="size-5" />}
            title="Contributions vérifiées"
            text="Chaque contribution Zelle est enregistrée en attente puis vérifiée manuellement."
          />
        </div>

        <h2 className="mt-12 text-2xl font-bold">Comment appuyer un projet</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
          <li>Choisissez un projet publié et ouvrez sa page.</li>
          <li>Cliquez sur « Appuyer financièrement » pour afficher les instructions Zelle.</li>
          <li>Effectuez le paiement depuis votre application bancaire.</li>
          <li>Enregistrez votre contribution avec la référence de la transaction.</li>
          <li>
            L'administration vérifie la transaction ; une fois confirmée, le montant est ajouté au
            total collecté du projet.
          </li>
        </ol>

        {site?.contact_email || site?.phone || site?.address ? (
          <div className="mt-12 rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">Contact</h2>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {site?.contact_email ? <li>Email : {site.contact_email}</li> : null}
              {site?.phone ? <li>Téléphone : {site.phone}</li> : null}
              {site?.address ? <li>Adresse : {site.address}</li> : null}
            </ul>
          </div>
        ) : null}
      </section>
    </SiteLayout>
  );
}

function Card({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </span>
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
