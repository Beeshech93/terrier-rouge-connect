import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/conditions-generales")({
  head: () => ({
    meta: [
      { title: "Termes et conditions — Terrier-Rouge Commune" },
      {
        name: "description",
        content:
          "Termes et conditions d'utilisation de la plateforme Terrier-Rouge Commune, y compris les règles applicables aux contributions financières via Zelle.",
      },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-14">
        <h1 className="text-3xl font-bold">Termes et conditions</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { dateStyle: "long" })}
        </p>

        <div className="prose prose-sm mt-8 max-w-none space-y-6 text-sm leading-relaxed text-foreground">
          <section>
            <h2 className="text-lg font-semibold">1. Objet de la plateforme</h2>
            <p className="mt-2 text-muted-foreground">
              Terrier-Rouge Commune est une plateforme de gestion et de transparence des projets de
              développement de la Commune de Terrier-Rouge, Nord-Est, Haïti. Elle permet de
              consulter les projets publics, leur budget et leur avancement, et de contribuer
              financièrement à leur réalisation.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">2. Accès au site</h2>
            <p className="mt-2 text-muted-foreground">
              La consultation des projets publics, de la page Transparence et des informations
              institutionnelles est libre et ne nécessite pas de création de compte. La création
              de compte est réservée à l'administration de la plateforme.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">3. Contributions financières</h2>
            <p className="mt-2 text-muted-foreground">
              Les contributions se font exclusivement via Zelle, de manière manuelle. Aucun
              paiement n'est traité automatiquement par la plateforme. Chaque contribution
              soumise reste au statut « En attente » jusqu'à vérification et confirmation par
              l'administration ; seule une contribution confirmée est comptabilisée dans le
              montant collecté d'un projet.
            </p>
            <p className="mt-2 text-muted-foreground">
              Les informations fournies (nom, email, montant, référence Zelle) doivent être
              exactes. L'administration se réserve le droit de rejeter toute contribution dont la
              référence de paiement ne peut être vérifiée.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">4. Contenu et exactitude des informations</h2>
            <p className="mt-2 text-muted-foreground">
              Les projets, budgets, montants collectés et pourcentages d'avancement sont publiés
              et mis à jour par l'administration. Certains projets peuvent être marqués « DEMO » à
              titre de démonstration et ne représentent pas des projets réels en cours.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">5. Responsabilité</h2>
            <p className="mt-2 text-muted-foreground">
              La plateforme est fournie « en l'état ». L'administration s'efforce de maintenir des
              informations à jour et exactes, sans garantie de disponibilité continue du service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">6. Modification des termes</h2>
            <p className="mt-2 text-muted-foreground">
              Ces termes peuvent être mis à jour à tout moment. La date de dernière mise à jour est
              indiquée en haut de cette page.
            </p>
          </section>

          <div className="rounded-xl border border-dashed border-border bg-secondary/30 p-5 text-muted-foreground">
            <p className="font-semibold text-foreground">Note</p>
            <p className="mt-1">
              Ce document a une valeur informative générale et n'engage pas d'autorité officielle.
              Il sera complété avec les mentions légales de la Commune de Terrier-Rouge dès
              qu'elles seront communiquées.
            </p>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
