import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { HeartHandshake, Mail, Phone, ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { financialProgress, formatMoney, type Currency } from "@/lib/domain";

const schema = z.object({
  donor_name: z.string().trim().min(2, "Nom requis").max(120),
  donor_email: z.string().trim().email("Email invalide").max(255),
  amount: z.coerce.number().positive("Montant invalide").max(10_000_000),
  currency: z.enum(["USD", "HTG"]),
  zelle_reference: z.string().trim().min(3, "Référence requise").max(120),
  message: z.string().trim().max(500).optional().or(z.literal("")),
});

type Props = {
  project: {
    id: string;
    title: string;
    budget: number | string;
    currency: Currency;
    amount_collected: number | string;
    project_progress: number;
  };
  className?: string;
  size?: "default" | "lg";
};

export function DonationDialog({ project, className, size = "lg" }: Props) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currency, setCurrency] = useState<Currency>(project.currency);
  const { user } = useAuth();

  const { data: payment } = useQuery({
    queryKey: ["payment-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_settings")
        .select("*")
        .eq("is_active", true)
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const pct = financialProgress(project.amount_collected, project.budget);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!confirmed) {
      toast.error("Veuillez confirmer avoir effectué le paiement.");
      return;
    }
    const form = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      donor_name: form.get("donor_name"),
      donor_email: form.get("donor_email"),
      amount: form.get("amount"),
      currency,
      zelle_reference: form.get("zelle_reference"),
      message: form.get("message"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Formulaire invalide");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("donations").insert({
      project_id: project.id,
      donor_id: user?.id ?? null,
      donor_name: parsed.data.donor_name,
      donor_email: parsed.data.donor_email,
      amount: parsed.data.amount,
      currency: parsed.data.currency,
      zelle_reference: parsed.data.zelle_reference,
      message: parsed.data.message || null,
      status: "en_attente",
    });
    setSubmitting(false);

    if (error) {
      toast.error("Enregistrement impossible. Réessayez.");
      return;
    }
    setDone(true);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) {
          setDone(false);
          setConfirmed(false);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button size={size} className={className}>
          <HeartHandshake /> Appuyer financièrement
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        {done ? (
          <div className="space-y-4 py-4 text-center">
            <ShieldCheck className="mx-auto size-10 text-success" />
            <DialogTitle>Merci pour votre contribution</DialogTitle>
            <DialogDescription>
              Votre contribution a été enregistrée et sera vérifiée par l'administration. Statut
              actuel : EN ATTENTE.
            </DialogDescription>
            <Button onClick={() => setOpen(false)} className="w-full">
              Fermer
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{project.title}</DialogTitle>
              <DialogDescription>
                Contribution via Zelle, vérifiée manuellement par l'administration.
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-lg border border-border bg-secondary/40 p-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Budget</span>
                <span className="font-medium">{formatMoney(project.budget, project.currency)}</span>
              </div>
              <div className="mt-1 flex justify-between text-sm">
                <span className="text-muted-foreground">Collecté</span>
                <span className="font-medium">
                  {formatMoney(project.amount_collected, project.currency)}
                </span>
              </div>
              <Progress value={pct} className="mt-3" />
              <p className="mt-1.5 text-xs text-muted-foreground">
                Progression financière {pct}% · Travaux {project.project_progress}%
              </p>
            </div>

            <div className="rounded-lg border border-gold/50 bg-gold/10 p-4 text-sm">
              <p className="font-semibold">Instructions Zelle</p>
              {payment?.zelle_email ? (
                <p className="mt-2 flex items-center gap-2">
                  <Mail className="size-4" /> {payment.zelle_email}
                </p>
              ) : null}
              {payment?.zelle_phone ? (
                <p className="mt-1 flex items-center gap-2">
                  <Phone className="size-4" /> {payment.zelle_phone}
                </p>
              ) : null}
              {payment?.beneficiary_name ? (
                <p className="mt-1">Bénéficiaire : {payment.beneficiary_name}</p>
              ) : null}
              {payment?.instructions ? (
                <p className="mt-2 text-muted-foreground">{payment.instructions}</p>
              ) : null}
              {!payment?.zelle_email && !payment?.zelle_phone ? (
                <p className="mt-2 text-muted-foreground">
                  Les coordonnées Zelle ne sont pas encore configurées par l'administration.
                </p>
              ) : null}
            </div>

            <form onSubmit={onSubmit} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="donor_name">Nom complet</Label>
                <Input id="donor_name" name="donor_name" required maxLength={120} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="donor_email">Email</Label>
                <Input
                  id="donor_email"
                  name="donor_email"
                  type="email"
                  required
                  defaultValue={user?.email ?? ""}
                  maxLength={255}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="amount">Montant</Label>
                  <Input id="amount" name="amount" type="number" min="1" step="0.01" required />
                </div>
                <div className="space-y-1.5">
                  <Label>Devise</Label>
                  <Select value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="HTG">HTG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="zelle_reference">Référence du paiement Zelle</Label>
                <Input id="zelle_reference" name="zelle_reference" required maxLength={120} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="message">Message facultatif</Label>
                <Textarea id="message" name="message" maxLength={500} rows={3} />
              </div>
              <label className="flex items-start gap-2.5 text-sm">
                <Checkbox
                  checked={confirmed}
                  onCheckedChange={(v) => setConfirmed(v === true)}
                  className="mt-0.5"
                />
                <span>Je confirme avoir effectué le paiement.</span>
              </label>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Envoi…" : "Envoyer ma contribution"}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
