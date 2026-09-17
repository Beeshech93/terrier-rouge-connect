import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/politique-de-confidentialite")({
  head: () => ({
    meta: [
      { title: "Politique de confidentialité — Terrier-Rouge Commune" },
      {
        name: "description",
        content:
          "Politique de confidentialité de la plateforme Terrier-Rouge Commune : données collectées, utilisation et protection des informations personnelles.",
      },
    ],
  }),
  component: PrivacyPolicy,
});

function PrivacyPolicy() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-14">
        <h1 className="text-3xl font-bold">Politique de confidentialité</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { dateStyle: "long" })}
        </p>

        <div className="prose prose-sm mt-8 max-w-none space-y-6 text-sm leading-relaxed text-foreground">
          <section>
            <h2 className="text-lg font-semibold">1. Données collectées</h2>
            <p className="mt-2 text-muted-foreground">
              Lorsque vous consultez les projets publics de la plateforme, aucune donnée
              personnelle n'est requise. Lorsque vous effectuez une contribution financière via
              Zelle, nous collectons uniquement les informations que vous fournissez
              volontairement dans le formulaire de contribution : nom complet, adresse email,
              montant, devise, référence du paiement Zelle et message facultatif.
            </p>
            <p className="mt-2 text-muted-foreground">
              Si un compte administrateur est créé, nous conservons également l'adresse email et
              le nom associés à ce compte, à des fins d'authentification et d'audit interne.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">2. Utilisation des données</h2>
            <p className="mt-2 text-muted-foreground">
              Les informations liées à une contribution sont utilisées exclusivement pour
              vérifier manuellement le paiement Zelle correspondant et mettre à jour le montant
              collecté du projet concerné. Elles ne sont ni vendues, ni partagées avec des tiers à
              des fins commerciales.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">3. Conservation et sécurité</h2>
            <p className="mt-2 text-muted-foreground">
              Les données sont hébergées via Supabase (PostgreSQL) avec des règles d'accès
              strictes (Row Level Security) : seules les personnes disposant d'un rôle
              administrateur peuvent consulter l'ensemble des contributions. Les identifiants de
              connexion et clés secrètes du système ne sont jamais exposés publiquement.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">4. Vos droits</h2>
            <p className="mt-2 text-muted-foreground">
              Vous pouvez demander la consultation, la correction ou la suppression des
              informations personnelles associées à une contribution en contactant
              l'administration via les coordonnées indiquées sur la page « À propos ».
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">5. Cookies</h2>
            <p className="mt-2 text-muted-foreground">
              La plateforme utilise uniquement les mécanismes techniques nécessaires au
              fonctionnement de l'authentification administrateur. Aucun cookie publicitaire ou de
              suivi tiers n'est utilisé.
            </p>
          </section>

          <div className="rounded-xl border border-dashed border-border bg-secondary/30 p-5 text-muted-foreground">
            <p className="font-semibold text-foreground">Note</p>
            <p className="mt-1">
              Ce document a une valeur informative générale. Il sera complété avec les mentions
              officielles de la Commune de Terrier-Rouge dès qu'elles seront communiquées par
              l'administration communale.
            </p>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
