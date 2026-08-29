import {
  Check,
  CreditCard,
  ExternalLink,
  Loader2,
  Mail,
  MessageCircle,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

import {
  obtenirMonAbonnement,
  type AbonnementUtilisateur,
} from "../../services/abonnement.service";

import {
  creerDemandePaiement,
  obtenirMesPaiements,
  type Paiement,
} from "../../services/paiement.service";

const PRIX_PREMIUM = 2500;

const WHATSAPP_URL =
  "https://wa.me/242066817726?text=Bonjour%2C%20je%20souhaite%20activer%20CodeDoctor%20Premium.";

const EMAIL_ADMIN_URL =
  "mailto:nathanngassai885@gmail.com?subject=CodeDoctor%20-%20Demande%20d%27assistance";

function formaterDate(date: string) {
  const valeur = new Date(date);

  if (Number.isNaN(valeur.getTime())) {
    return "Date inconnue";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(valeur);
}

function libelleStatut(statut: string) {
  switch (statut) {
    case "APPROVED":
      return "Approuvé";

    case "REJECTED":
      return "Rejeté";

    case "PENDING":
      return "En attente";

    default:
      return statut;
  }
}

function variantePaiement(statut: string) {
  switch (statut) {
    case "APPROVED":
      return "success" as const;

    case "REJECTED":
      return "danger" as const;

    default:
      return "warning" as const;
  }
}

function varianteAbonnement(
  abonnement: AbonnementUtilisateur
) {
  if (abonnement.plan === "PREMIUM") {
    return "success" as const;
  }

  return "warning" as const;
}

export default function PremiumPage() {
  const [abonnement, setAbonnement] =
    useState<AbonnementUtilisateur | null>(null);

  const [paiements, setPaiements] =
    useState<Paiement[]>([]);

  const [chargement, setChargement] =
    useState(true);

  const [demandeEnCours, setDemandeEnCours] =
    useState(false);

  const [erreur, setErreur] = useState("");

  const [message, setMessage] = useState("");

  useEffect(() => {
    let actif = true;

    async function charger() {
      try {
        setChargement(true);
        setErreur("");

        const [
          abonnementResultat,
          paiementsResultat,
        ] = await Promise.all([
          obtenirMonAbonnement(),
          obtenirMesPaiements(),
        ]);

        if (!actif) {
          return;
        }

        setAbonnement(abonnementResultat);
        setPaiements(paiementsResultat);
      } catch (error) {
        console.error(
          "Erreur lors du chargement Premium :",
          error
        );

        if (actif) {
          setErreur(
            "Impossible de récupérer les informations Premium."
          );
        }
      } finally {
        if (actif) {
          setChargement(false);
        }
      }
    }

    void charger();

    return () => {
      actif = false;
    };
  }, []);

  const premiumActif =
    abonnement?.plan === "PREMIUM" &&
    abonnement.statut === "ACTIVE";

  const demandeEnAttente = paiements.some(
    (paiement) =>
      paiement.statut === "PENDING"
  );

  async function demanderPremium() {
    try {
      setDemandeEnCours(true);
      setErreur("");
      setMessage("");

      await creerDemandePaiement(
        PRIX_PREMIUM
      );

      const nouveauxPaiements =
        await obtenirMesPaiements();

      setPaiements(nouveauxPaiements);

      setMessage(
        "Votre demande a été enregistrée. Poursuivez la procédure via WhatsApp."
      );

      window.open(
        WHATSAPP_URL,
        "_blank",
        "noopener,noreferrer"
      );
    } catch (error) {
      console.error(
        "Erreur demande Premium :",
        error
      );

      setErreur(
        "Impossible d'enregistrer votre demande de paiement."
      );
    } finally {
      setDemandeEnCours(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      <section>
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600">
          <ShieldCheck size={14} />
          CodeDoctor Premium
        </div>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          Débloquez Premium
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500 sm:text-base">
          Obtenez un accès Premium pendant 30 jours
          avec un paiement validé manuellement par
          l'administration.
        </p>
      </section>

      {erreur && (
        <Card className="border-red-200 bg-red-50 p-5">
          <div className="flex items-start gap-3">
            <XCircle
              size={19}
              className="mt-0.5 shrink-0 text-red-600"
            />

            <p className="text-sm text-red-700">
              {erreur}
            </p>
          </div>
        </Card>
      )}

      {message && (
        <Card className="border-green-200 bg-green-50 p-5">
          <p className="text-sm text-green-700">
            {message}
          </p>
        </Card>
      )}

      {chargement ? (
        <Card className="p-12">
          <div className="flex flex-col items-center">
            <Loader2
              size={28}
              className="animate-spin text-zinc-400"
            />

            <p className="mt-4 text-sm text-zinc-600">
              Chargement de votre abonnement...
            </p>
          </div>
        </Card>
      ) : (
        <>
          <Card className="overflow-hidden border-zinc-200">
            <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
              <div className="border-b border-zinc-100 p-6 sm:p-8 lg:border-b-0 lg:border-r">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant={
                      abonnement
                        ? varianteAbonnement(
                            abonnement
                          )
                        : "warning"
                    }
                  >
                    {premiumActif
                      ? "Premium actif"
                      : "Plan gratuit"}
                  </Badge>

                  {premiumActif &&
                    abonnement?.dateRenouvellement && (
                      <span className="text-xs text-zinc-400">
                        Jusqu'au{" "}
                        {formaterDate(
                          abonnement.dateRenouvellement
                        )}
                      </span>
                    )}
                </div>

                <h2 className="mt-5 text-2xl font-semibold text-zinc-950">
                  2 500 FCFA
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Accès Premium pendant 30 jours.
                </p>

                <div className="mt-6 space-y-3">
                  <Feature>
                    Accès aux fonctionnalités Premium
                  </Feature>

                  <Feature>
                    Expérience CodeDoctor complète
                  </Feature>

                  <Feature>
                    Activation après validation du paiement
                  </Feature>

                  <Feature>
                    Support administratif en cas de problème
                  </Feature>
                </div>
              </div>

              <div className="flex flex-col justify-center bg-zinc-50 p-6 sm:p-8">
                {premiumActif ? (
                  <>
                    <p className="text-sm font-semibold text-zinc-900">
                      Votre abonnement est actif
                    </p>

                    <p className="mt-2 text-sm leading-6 text-zinc-500">
                      Vous profitez actuellement de
                      votre accès Premium.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-zinc-900">
                      Demander Premium
                    </p>

                    <p className="mt-2 text-sm leading-6 text-zinc-500">
                      Créez votre demande puis poursuivez
                      la procédure de paiement via
                      WhatsApp.
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        void demanderPremium()
                      }
                      disabled={
                        demandeEnCours ||
                        demandeEnAttente
                      }
                      className="
                        mt-6 inline-flex
                        w-full items-center
                        justify-center gap-2
                        rounded-xl bg-zinc-950
                        px-5 py-3
                        text-sm font-semibold
                        text-white
                        transition
                        hover:bg-zinc-800
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      {demandeEnCours ? (
                        <Loader2
                          size={17}
                          className="animate-spin"
                        />
                      ) : (
                        <MessageCircle size={17} />
                      )}

                      {demandeEnCours
                        ? "Création de la demande..."
                        : demandeEnAttente
                        ? "Demande déjà en attente"
                        : "Demander Premium"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-zinc-950">
                  Besoin d'aide ?
                </h2>

                <p className="mt-1 text-sm leading-6 text-zinc-500">
                  En cas de problème concernant votre
                  paiement ou votre abonnement, contactez
                  l'administration.
                </p>
              </div>

              <a
                href={EMAIL_ADMIN_URL}
                className="
                  inline-flex shrink-0
                  items-center justify-center
                  gap-2 rounded-xl
                  border border-zinc-200
                  bg-white
                  px-4 py-2.5
                  text-sm font-medium
                  text-zinc-700
                  transition
                  hover:bg-zinc-50
                "
              >
                <Mail size={16} />
                Contacter l'administration
                <ExternalLink size={14} />
              </a>
            </div>
          </Card>

          <section>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-zinc-950">
                Historique des paiements
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Suivez l'état de vos demandes Premium.
              </p>
            </div>

            {paiements.length === 0 ? (
              <Card className="p-8 text-center">
                <CreditCard
                  size={32}
                  className="mx-auto text-zinc-300"
                />

                <p className="mt-3 text-sm font-medium text-zinc-800">
                  Aucun paiement
                </p>

                <p className="mt-1 text-xs text-zinc-400">
                  Vos demandes de paiement apparaîtront
                  ici.
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {paiements.map((paiement) => (
                  <Card
                    key={paiement.id}
                    className="p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            variant={variantePaiement(
                              paiement.statut
                            )}
                          >
                            {libelleStatut(
                              paiement.statut
                            )}
                          </Badge>

                          <span className="text-xs text-zinc-400">
                            {formaterDate(
                              paiement.createdAt
                            )}
                          </span>
                        </div>

                        <p className="mt-2 text-sm font-semibold text-zinc-900">
                          {paiement.montant.toLocaleString(
                            "fr-FR"
                          )}{" "}
                          FCFA
                        </p>
                      </div>

                      <div className="text-xs text-zinc-400">
                        Paiement via WhatsApp
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function Feature({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-950 text-white">
        <Check size={12} />
      </div>

      <p className="text-sm text-zinc-600">
        {children}
      </p>
    </div>
  );
}