
import { useEffect, useState } from "react";
import {
  AlertCircle,
  Bell,
  Check,
  CheckCheck,
  Loader2,
  Trash2,
} from "lucide-react";

import Card from "../../components/ui/Card";

import {
  obtenirNotifications,
  marquerNotificationCommeLue,
  marquerToutesCommeLues,
  supprimerNotification,
} from "../../services/notification.service";

import type { Notification } from "../../types/notification";

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

export default function NotificationsAdminPage() {
  const [notifications, setNotifications] = useState<
    Notification[]
  >([]);

  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const [actionEnCours, setActionEnCours] = useState<
    string | null
  >(null);

  async function chargerNotifications() {
    try {
      setChargement(true);
      setErreur("");

      const resultat = await obtenirNotifications();

      setNotifications(resultat.notifications);
    } catch (error) {
      console.error(
        "Erreur chargement notifications admin :",
        error
      );

      setErreur(
        "Impossible de récupérer les notifications."
      );
    } finally {
      setChargement(false);
    }
  }

  useEffect(() => {
    void chargerNotifications();
  }, []);

  async function marquerCommeLue(id: string) {
    try {
      setActionEnCours(id);

      await marquerNotificationCommeLue(id);

      setNotifications((anciennes) =>
        anciennes.map((notification) =>
          notification.id === id
            ? {
                ...notification,
                lue: true,
              }
            : notification
        )
      );
    } catch (error) {
      console.error(
        "Erreur marquage notification :",
        error
      );

      setErreur(
        "Impossible de mettre à jour cette notification."
      );
    } finally {
      setActionEnCours(null);
    }
  }

  async function marquerToutesCommeLuesAdmin() {
    try {
      setActionEnCours("toutes");

      await marquerToutesCommeLues();

      setNotifications((anciennes) =>
        anciennes.map((notification) => ({
          ...notification,
          lue: true,
        }))
      );
    } catch (error) {
      console.error(
        "Erreur marquage notifications :",
        error
      );

      setErreur(
        "Impossible de marquer toutes les notifications comme lues."
      );
    } finally {
      setActionEnCours(null);
    }
  }

  async function supprimer(id: string) {
    const confirmer = window.confirm(
      "Voulez-vous vraiment supprimer cette notification ?"
    );

    if (!confirmer) {
      return;
    }

    try {
      setActionEnCours(id);

      await supprimerNotification(id);

      setNotifications((anciennes) =>
        anciennes.filter(
          (notification) =>
            notification.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Erreur suppression notification :",
        error
      );

      setErreur(
        "Impossible de supprimer cette notification."
      );
    } finally {
      setActionEnCours(null);
    }
  }

  const notificationsNonLues =
    notifications.filter(
      (notification) => !notification.lue
    ).length;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      {/* En-tête */}
      <section>
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
          <Bell size={14} />
          Administration
        </div>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-blue-950 sm:text-4xl">
              Notifications
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-700/70 sm:text-base">
              Consultez les notifications liées à votre
              espace administrateur et gérez leur état.
            </p>
          </div>

          {notificationsNonLues > 0 && (
            <button
              type="button"
              onClick={() =>
                void marquerToutesCommeLuesAdmin()
              }
              disabled={actionEnCours === "toutes"}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-blue-200
                bg-white
                px-4
                py-2.5
                text-sm
                font-semibold
                text-blue-700
                shadow-sm
                transition
                hover:bg-blue-50
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {actionEnCours === "toutes" ? (
                <Loader2
                  size={16}
                  className="animate-spin"
                />
              ) : (
                <CheckCheck size={16} />
              )}

              Tout marquer comme lu
            </button>
          )}
        </div>
      </section>

      {/* Erreur */}
      {erreur && (
        <Card className="border-red-200 bg-red-50 p-5">
          <div className="flex items-start gap-3">
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0 text-red-600"
            />

            <p className="text-sm text-red-700">
              {erreur}
            </p>
          </div>
        </Card>
      )}

      {/* Chargement */}
      {chargement ? (
        <Card className="border-blue-100 p-12">
          <div className="flex flex-col items-center text-center">
            <Loader2
              size={30}
              className="animate-spin text-blue-500"
            />

            <p className="mt-4 text-sm font-semibold text-blue-900">
              Chargement des notifications...
            </p>
          </div>
        </Card>
      ) : notifications.length === 0 ? (
        /* Vide */
        <Card className="border-blue-100 p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
            <Bell size={28} />
          </div>

          <h2 className="mt-5 text-base font-bold text-blue-950">
            Aucune notification
          </h2>

          <p className="mt-2 text-sm text-blue-700/60">
            Vous n'avez aucune notification pour le
            moment.
          </p>
        </Card>
      ) : (
        /* Liste */
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`
                border-blue-100
                p-4
                transition
                sm:p-5
                ${
                  notification.lue
                    ? "bg-white"
                    : "border-blue-200 bg-blue-50/60 shadow-sm"
                }
              `}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    ${
                      notification.lue
                        ? "bg-blue-50 text-blue-500"
                        : "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    }
                  `}
                >
                  <Bell size={19} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2
                        className={`
                          text-sm
                          ${
                            notification.lue
                              ? "font-semibold text-blue-900"
                              : "font-bold text-blue-950"
                          }
                        `}
                      >
                        {notification.titre}
                      </h2>

                      <p className="mt-1 text-xs text-blue-600/60">
                        {formaterDate(
                          notification.createdAt
                        )}
                      </p>
                    </div>

                    {!notification.lue && (
                      <span className="inline-flex w-fit items-center rounded-full bg-blue-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                        Nouvelle
                      </span>
                    )}
                  </div>

                  <p className="mt-3 text-sm leading-6 text-blue-900/70">
                    {notification.message}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {!notification.lue && (
                      <button
                        type="button"
                        onClick={() =>
                          void marquerCommeLue(
                            notification.id
                          )
                        }
                        disabled={
                          actionEnCours ===
                          notification.id
                        }
                        className="
                          inline-flex
                          items-center
                          gap-2
                          rounded-lg
                          bg-blue-600
                          px-3
                          py-2
                          text-xs
                          font-semibold
                          text-white
                          transition
                          hover:bg-blue-700
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                        "
                      >
                        {actionEnCours ===
                        notification.id ? (
                          <Loader2
                            size={14}
                            className="animate-spin"
                          />
                        ) : (
                          <Check size={14} />
                        )}

                        Marquer comme lue
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        void supprimer(
                          notification.id
                        )
                      }
                      disabled={
                        actionEnCours ===
                        notification.id
                      }
                      className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-lg
                        border
                        border-red-100
                        bg-white
                        px-3
                        py-2
                        text-xs
                        font-semibold
                        text-red-600
                        transition
                        hover:bg-red-50
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      <Trash2 size={14} />
                      Supprimer
                    </button>
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
