import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Connexion administrateur — Terrier-Rouge Commune" },
      {
        name: "description",
        content:
          "Accès réservé à l'administration de Terrier-Rouge Commune. Les donateurs n'ont pas besoin de créer de compte pour contribuer.",
      },
      { property: "og:title", content: "Connexion administrateur — Terrier-Rouge Commune" },
      { property: "og:description", content: "Accès réservé à l'administration." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

const emailSchema = z.string().trim().email("Email invalide").max(255);
const passwordSchema = z.string().min(8, "Mot de passe : 8 caractères minimum").max(72);

function AuthPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) void navigate({ to: "/admin" });
  }, [session, navigate]);

  const signIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = emailSchema.safeParse(form.get("email"));
    const password = passwordSchema.safeParse(form.get("password"));
    if (!email.success || !password.success) {
      toast.error(
        (email.success ? password.error?.issues[0]?.message : email.error?.issues[0]?.message) ??
          "Informations invalides",
      );
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.data,
      password: password.data,
    });
    setLoading(false);
    if (error) {
      toast.error("Identifiants incorrects.");
      return;
    }
    toast.success("Connexion réussie");
    void navigate({ to: "/admin" });
  };

  const reset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = emailSchema.safeParse(form.get("email"));
    if (!email.success) {
      toast.error(email.error.issues[0]!.message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.data, {
      redirectTo: `${window.location.origin}/admin`,
    });
    setLoading(false);
    if (error) {
      toast.error("Envoi impossible pour le moment.");
      return;
    }
    toast.success("Si un compte existe, un email de réinitialisation a été envoyé.");
  };

  return (
    <div className="grid min-h-screen place-items-center bg-secondary/40 px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Landmark className="size-4.5" />
          </span>
          <span className="text-sm font-bold">TERRIER-ROUGE COMMUNE</span>
        </Link>

        <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <h1 className="text-xl font-bold">Espace administration</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Connexion réservée aux administrateurs de la plateforme. Les comptes sont créés
            directement par l'équipe technique, il n'y a pas d'inscription publique.
          </p>

          <Tabs defaultValue="signin" className="mt-5">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Connexion</TabsTrigger>
              <TabsTrigger value="reset">Mot de passe oublié</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={signIn} className="space-y-3">
                <Field id="si-email" name="email" label="Email" type="email" />
                <Field id="si-password" name="password" label="Mot de passe" type="password" />
                <Button type="submit" className="w-full" disabled={loading}>
                  Se connecter
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="reset">
              <form onSubmit={reset} className="space-y-3">
                <Field id="rs-email" name="email" label="Email" type="email" />
                <Button type="submit" className="w-full" disabled={loading}>
                  Réinitialiser le mot de passe
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Vous voulez soutenir un projet ? Aucune connexion n'est nécessaire pour faire un don.
        </p>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          <Link to="/" className="underline">
            Retour au site
          </Link>
        </p>
      </div>
    </div>
  );
}

function Field({
  id,
  name,
  label,
  type,
}: {
  id: string;
  name: string;
  label: string;
  type: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={name} type={type} required autoComplete="on" />
    </div>
  );
}
