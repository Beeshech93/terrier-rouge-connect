import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Landmark, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const NAV = [
  { to: "/", label: "Accueil" },
  { to: "/projects", label: "Projets" },
  { to: "/transparence", label: "Transparence" },
  { to: "/a-propos", label: "À propos" },
] as const;

export function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { session, isAdmin } = useAuth();

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:flex sm:justify-between">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Landmark className="size-4.5" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold tracking-tight">
                TERRIER-ROUGE COMMUNE
              </span>
              <span className="block truncate text-[11px] text-muted-foreground">
                Gestion et transparence communautaire
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground data-[status=active]:bg-secondary data-[status=active]:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            {isAdmin ? (
              <>
                <Button asChild size="sm" variant="secondary" className="ml-2">
                  <Link to="/admin">
                    <LayoutDashboard /> Admin
                  </Link>
                </Button>
                <Button size="sm" variant="outline" onClick={signOut}>
                  <LogOut /> Quitter
                </Button>
              </>
            ) : session ? (
              <Button size="sm" variant="outline" onClick={signOut}>
                <LogOut /> Quitter
              </Button>
            ) : null}
          </nav>

          <button
            type="button"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="grid size-10 shrink-0 place-items-center rounded-md border border-border md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {open ? (
          <div className="border-t border-border md:hidden">
            <nav className="mx-auto flex max-w-6xl flex-col px-4 py-2">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
              {isAdmin ? (
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2.5 text-sm font-medium"
                >
                  Administration
                </Link>
              ) : null}
              {session ? (
                <button
                  onClick={signOut}
                  className="rounded-md px-3 py-2.5 text-left text-sm font-medium text-destructive"
                >
                  Se déconnecter
                </button>
              ) : null}
            </nav>
          </div>
        ) : null}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-16 border-t border-border bg-secondary/40">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
          <div>
            <p className="text-sm font-bold">TERRIER-ROUGE COMMUNE</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Plateforme de gestion et de transparence communautaire.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">Terrier-Rouge, Nord-Est, Haïti</p>
          </div>
          <div>
            <p className="text-sm font-semibold">Navigation</p>
            <ul className="mt-2 space-y-1.5">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold">Participation</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Les contributions financières sont vérifiées manuellement par l'administration avant
              d'être comptabilisées.
            </p>
          </div>
        </div>
        <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Terrier-Rouge Commune — Contenu de démonstration inclus. ·{" "}
          {session ? (
            isAdmin ? (
              <Link to="/admin" className="underline hover:text-foreground">
                Administration
              </Link>
            ) : null
          ) : (
            <Link to="/auth" className="underline hover:text-foreground">
              Espace administration
            </Link>
          )}
        </div>
      </footer>
    </div>
  );
}
