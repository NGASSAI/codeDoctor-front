import {
  Check,
  CreditCard,
  ExternalLink,
  Loader2,
  Mail,
  MessageCircle,
  Send,
  ShieldCheck,
  XCircle,
  X,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import HelpButton from "../../components/ui/HelpButton";

import {
  obtenirMonAbonnement,
  type AbonnementUtilisateur,
} from "../../services/abonnement.service";

import {
  creerDemandePaiement,
  obtenirMesPaiements,
  type Paiement,
} from "../../services/paiement.service";

import { creerNotificationAdmin } from "../../services/notification.service";

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

  const [showContactModal, setShowContactModal] = useState(false);

  const [contactMethod, setContactMethod] = useState<"whatsapp" | "message" | null>(null);

  const [customMessage, setCustomMessage] = useState("");

  const [sendingMessage, setSendingMessage] = useState(false);

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

      setShowContactModal(true);
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

  async function envoyerMessageAdmin() {
    if (!customMessage.trim()) {
      setErreur("Veuillez saisir un message.");
      return;
    }

    try {
      setSendingMessage(true);
      setErreur("");

      // Créer une notification pour l'admin
      await creerNotificationAdmin(
        "Nouveau message Premium",
        customMessage,
        "INFO"
      );

      setMessage("Votre message a été envoyé à l'administration.");
      setCustomMessage("");
      setShowContactModal(false);
    } catch (error) {
      console.error(
        "Erreur envoi message :",
        error
      );

      setErreur(
        "Impossible d'envoyer votre message."
      );
    } finally {
      setSendingMessage(false);
    }
  }

  function ouvrirWhatsApp() {
    window.open(
      WHATSAPP_URL,
      "_blank",
      "noopener,noreferrer"
    );
    setShowContactModal(false);
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      <section>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
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
          </div>

          <HelpButton
            title="Aide – Premium"
            description="Cette page sert à demander et suivre votre abonnement Premium, ainsi qu’à contacter l’administration si besoin."
            items={[
              "Cliquez sur 'Demander Premium' pour créer une demande d'abonnement valable pour 30 jours.",
              "Le paiement est fixé à 2 500 FCFA et doit être validé manuellement par l'administration.",
              "Suivez le statut de votre demande dans l'historique des paiements pour savoir si elle est en attente, approuvée ou rejetée.",
              "Si vous rencontrez un souci, contactez l'administration via WhatsApp ou par message pour finaliser la procédure.",
              "Une fois activé, votre plan Premium s'affiche dans l'interface avec la date de renouvellement associée."
            ]}
          />
        </div>
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

      {/* Modal de choix de contact */}
      <AnimatePresence>
        {showContactModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-blue-950/30 backdrop-blur-sm"
              onClick={() => setShowContactModal(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <Card className="w-full max-w-md bg-white p-6 shadow-2xl">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-zinc-950">
                    Choisir le mode de contact
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowContactModal(false)}
                    className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600"
                    aria-label="Fermer"
                  >
                    <X size={18} />
                  </button>
                </div>

                <p className="mb-6 text-sm text-zinc-600">
                  Votre demande a été enregistrée. Choisissez comment vous souhaitez contacter l'administration pour finaliser le paiement.
                </p>

                {!contactMethod ? (
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => setContactMethod("whatsapp")}
                      className="flex w-full items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-left transition hover:border-green-300 hover:bg-green-100"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white">
                        <MessageCircle size={18} />
                      </div>
                      <div>
                        <p className="font-medium text-green-900">WhatsApp</p>
                        <p className="text-xs text-green-700">Contact direct via WhatsApp</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setContactMethod("message")}
                      className="flex w-full items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-left transition hover:border-blue-300 hover:bg-blue-100"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white">
                        <Send size={18} />
                      </div>
                      <div>
                        <p className="font-medium text-blue-900">Envoyer un message</p>
                        <p className="text-xs text-blue-700">Écrire un message à l'admin</p>
                      </div>
                    </button>
                  </div>
                ) : contactMethod === "whatsapp" ? (
                  <div className="space-y-4">
                    <div className="rounded-xl bg-green-50 p-4">
                      <p className="text-sm font-medium text-green-900">
                        Cliquez sur le bouton ci-dessous pour ouvrir WhatsApp et finaliser votre paiement.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={ouvrirWhatsApp}
                      className="w-full rounded-xl bg-green-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-600"
                    >
                      Ouvrir WhatsApp
                    </button>
                    <button
                      type="button"
                      onClick={() => setContactMethod(null)}
                      className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                    >
                      Retour
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <textarea
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      placeholder="Décrivez votre demande ou votre question..."
                      rows={4}
                      className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    <button
                      type="button"
                      onClick={envoyerMessageAdmin}
                      disabled={sendingMessage}
                      className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {sendingMessage ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 size={16} className="animate-spin" />
                          Envoi...
                        </span>
                      ) : (
                        "Envoyer le message"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setContactMethod(null)}
                      className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                    >
                      Retour
                    </button>
                  </div>
                )}
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
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