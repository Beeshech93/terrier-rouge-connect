import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import {
  BarChart3,
  FolderKanban,
  HandCoins,
  Users,
  Tags,
  Receipt,
  Settings,
  ScrollText,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

const LINKS = [
  { to: "/admin", label: "Tableau de bord", icon: BarChart3, exact: true },
  { to: "/admin/projects", label: "Projets", icon: FolderKanban },
  { to: "/admin/donations", label: "Dons", icon: HandCoins },
  { to: "/admin/expenses", label: "Dépenses", icon: Receipt },
  { to: "/admin/categories", label: "Catégories", icon: Tags },
  { to: "/admin/users", label: "Utilisateurs", icon: Users },
  { to: "/admin/settings", label: "Paramètres", icon: Settings },
  { to: "/admin/audit-logs", label: "Journal d'audit", icon: ScrollText },
] as const;

function AdminLayout() {
  const { loading, isAdmin } = useAuth();

  if (loading) {
    return <div className="grid min-h-screen place-items-center text-sm">Chargement…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center px-4 text-center">
        <div>
          <h1 className="text-xl font-bold">Accès réservé à l'administration</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Votre compte ne dispose pas des droits administrateur.
          </p>
          <Link to="/" className="mt-4 inline-block text-sm font-medium text-primary underline">
            Retour au site
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <p className="text-sm font-bold tracking-tight">ADMINISTRATION</p>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Site public
          </Link>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 pb-2">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: Boolean((l as { exact?: boolean }).exact) }}
              className="flex shrink-0 items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground data-[status=active]:bg-primary data-[status=active]:text-primary-foreground"
            >
              <l.icon className="size-4" />
              {l.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
