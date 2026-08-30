import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Bell,
  CheckCheck,
  ChevronRight,
  Clock3,
  Loader2,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

import { useNotificationStore } from "../../stores/notification.store";

import type { Notification, TypeNotification } from "../../types/notification";

function formaterDate(date: string) {
  const valeur = new Date(date);
  if (Number.isNaN(valeur.getTime())) return "Date inconnue";
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(valeur);
}

function libelleType(type: TypeNotification) {
  switch (type) {
    case "PAIEMENT_APPROUVE":
    case "PAIEMENT_REJETE":
      return "Paiement";
    case "EXPERIENCE_APPROUVEE":
    case "EXPERIENCE_REFUSEE":
      return "Expérience";
    case "EXPERIENCE_SIGNALEE":
      return "Modération";
    case "NOUVEAU_COMMENTAIRE":
      return "Commentaire";
    case "NOUVELLE_REACTION":
      return "Réaction";
    case "NOUVELLE_EXPERIENCE":
      return "Communauté";
    case "NOUVEAU_SIGNALEMENT":
      return "Signalement";
    case "NOUVEL_UTILISATEUR":
      return "Compte";
    default:
      return "Notification";
  }
}

function classeType(type: TypeNotification) {
  switch (type) {
    case "PAIEMENT_APPROUVE":
    case "EXPERIENCE_APPROUVEE":
      return "success" as const;
    case "PAIEMENT_REJETE":
    case "EXPERIENCE_REFUSEE":
    case "EXPERIENCE_SIGNALEE":
      return "danger" as const;
    default:
      return "warning" as const;
  }
}

export default function NotificationsPage() {
  const navigate = useNavigate();

  const notifications = useNotificationStore((state) => state.notifications);
  const chargement = useNotificationStore((state) => state.chargement);
  const chargerNotifications = useNotificationStore(
    (state) => state.chargerNotifications
  );
  const marquerCommeLueStore = useNotificationStore(
    (state) => state.marquerCommeLue
  );
  const marquerToutesCommeLuesStore = useNotificationStore(
    (state) => state.marquerToutesCommeLues
  );
  const supprimerNotificationStore = useNotificationStore(
    (state) => state.supprimerNotification
  );

  const [filtreNonLues, setFiltreNonLues] = useState(false);
  const [traitementId, setTraitementId] = useState<string | null>(null);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    void chargerNotifications();
  }, [chargerNotifications]);

  const notificationsAffichees = useMemo(() => {
    if (!filtreNonLues) return notifications;
    return notifications.filter((notification) => !notification.lue);
  }, [notifications, filtreNonLues]);

  const nombreNonLues = useMemo(
    () => notifications.filter((notification) => !notification.lue).length,
    [notifications]
  );

  async function marquerCommeLue(notification: Notification) {
    if (notification.lue) {
      if (notification.lien) navigate(notification.lien);
      return;
    }

    try {
      setTraitementId(notification.id);
      setErreur("");
      await marquerCommeLueStore(notification.id);
      if (notification.lien) navigate(notification.lien);
    } catch (error) {
      console.error("Erreur marquage notification :", error);
      setErreur("Impossible de marquer cette notification comme lue.");
    } finally {
      setTraitementId(null);
    }
  }

  async function toutMarquerCommeLu() {
    if (nombreNonLues === 0) return;

    try {
      setTraitementId("all");
      setErreur("");
      await marquerToutesCommeLuesStore();
    } catch (error) {
      console.error("Erreur marquage global :", error);
      setErreur("Impossible de marquer toutes les notifications comme lues.");
    } finally {
      setTraitementId(null);
    }
  }

  async function supprimer(notification: Notification) {
    const confirmer = window.confirm(
      "Voulez-vous vraiment supprimer cette notification ?"
    );
    if (!confirmer) return;

    try {
      setTraitementId(notification.id);
      setErreur("");
      await supprimerNotificationStore(notification.id);
    } catch (error) {
      console.error("Erreur suppression notification :", error);
      setErreur("Impossible de supprimer cette notification.");
    } finally {
      setTraitementId(null);
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <section>
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600">
          <Bell size={14} />
          Notifications
        </div>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
              Vos notifications
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500 sm:text-base">
              Retrouvez les informations importantes concernant votre compte et votre activité sur CodeDoctor.
            </p>
          </div>

          {nombreNonLues > 0 && (
            <Badge variant="warning">
              {nombreNonLues} non lue{nombreNonLues > 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      </section>

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFiltreNonLues(false)}
              className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                !filtreNonLues
                  ? "bg-zinc-950 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              Toutes
            </button>

            <button
              type="button"
              onClick={() => setFiltreNonLues(true)}
              className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                filtreNonLues
                  ? "bg-zinc-950 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              Non lues
            </button>
          </div>

          <button
            type="button"
            onClick={() => void toutMarquerCommeLu()}
            disabled={nombreNonLues === 0 || traitementId === "all"}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {traitementId === "all" ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <CheckCheck size={16} />
            )}
            Tout marquer comme lu
          </button>
        </div>
      </Card>

      {erreur && (
        <Card className="border-red-200 bg-red-50 p-5">
          <div className="flex items-start gap-3">
            <AlertCircle size={19} className="mt-0.5 shrink-0 text-red-600" />
            <p className="text-sm text-red-700">{erreur}</p>
          </div>
        </Card>
      )}

      {chargement ? (
        <Card className="p-12">
          <div className="flex flex-col items-center text-center">
            <Loader2 size={28} className="animate-spin text-zinc-400" />
            <p className="mt-4 text-sm font-medium text-zinc-700">
              Chargement des notifications...
            </p>
          </div>
        </Card>
      ) : notificationsAffichees.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <Bell size={36} className="mx-auto text-zinc-300" />
            <h2 className="mt-4 text-sm font-semibold text-zinc-800">
              Aucune notification
            </h2>
            <p className="mt-1 text-xs leading-5 text-zinc-400">
              {filtreNonLues
                ? "Vous avez lu toutes vos notifications."
                : "Vous n'avez encore reçu aucune notification."}
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {notificationsAffichees.map((notification) => (
            <Card
              key={notification.id}
              className={`overflow-hidden transition ${
                !notification.lue ? "border-zinc-300 bg-white shadow-sm" : ""
              }`}
            >
              <div className="p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      notification.lue
                        ? "bg-zinc-100 text-zinc-500"
                        : "bg-zinc-950 text-white"
                    }`}
                  >
                    <Bell size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant={classeType(notification.type)}>
                            {libelleType(notification.type)}
                          </Badge>

                          {!notification.lue && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500">
                              <span className="h-1.5 w-1.5 rounded-full bg-zinc-900" />
                              Nouvelle
                            </span>
                          )}
                        </div>

                        <h2 className="mt-3 text-base font-semibold text-zinc-950">
                          {notification.titre}
                        </h2>
                      </div>

                      <span className="inline-flex shrink-0 items-center gap-1 text-xs text-zinc-400">
                        <Clock3 size={13} />
                        {formaterDate(notification.createdAt)}
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-zinc-600">
                      {notification.message}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => void marquerCommeLue(notification)}
                        disabled={traitementId === notification.id}
                        className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {traitementId === notification.id ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : notification.lien ? (
                          <ChevronRight size={15} />
                        ) : (
                          <CheckCheck size={15} />
                        )}
                        {notification.lien
                          ? "Ouvrir"
                          : notification.lue
                          ? "Déjà lue"
                          : "Marquer comme lue"}
                      </button>

                      <button
                        type="button"
                        onClick={() => void supprimer(notification)}
                        disabled={traitementId === notification.id}
                        className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Trash2 size={15} />
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}