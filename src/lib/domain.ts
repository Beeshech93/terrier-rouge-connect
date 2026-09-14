export type ProjectStatus = "planifie" | "en_cours" | "suspendu" | "termine" | "annule";
export type DonationStatus = "en_attente" | "confirmee" | "rejetee";
export type Currency = "USD" | "HTG";

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  planifie: "Planifié",
  en_cours: "En cours",
  suspendu: "Suspendu",
  termine: "Terminé",
  annule: "Annulé",
};

export const PROJECT_STATUS_CLASSES: Record<ProjectStatus, string> = {
  planifie: "bg-secondary text-secondary-foreground",
  en_cours: "bg-accent text-accent-foreground",
  suspendu: "bg-warning text-warning-foreground",
  termine: "bg-primary text-primary-foreground",
  annule: "bg-destructive text-destructive-foreground",
};

export const DONATION_STATUS_LABELS: Record<DonationStatus, string> = {
  en_attente: "En attente",
  confirmee: "Confirmée",
  rejetee: "Rejetée",
};

export const DONATION_STATUS_CLASSES: Record<DonationStatus, string> = {
  en_attente: "bg-warning text-warning-foreground",
  confirmee: "bg-success text-success-foreground",
  rejetee: "bg-destructive text-destructive-foreground",
};

export function formatMoney(amount: number | string | null | undefined, currency: Currency = "USD") {
  const value = Number(amount ?? 0);
  const formatted = new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
  return currency === "USD" ? `$${formatted}` : `${formatted} HTG`;
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(value));
}

export function financialProgress(collected: number | string, budget: number | string) {
  const b = Number(budget ?? 0);
  const c = Number(collected ?? 0);
  if (!b) return 0;
  return Math.min(100, Math.round((c / b) * 100));
}

export function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
