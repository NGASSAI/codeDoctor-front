import { create } from "zustand";

import {
  obtenirNotifications,
  compterNotificationsNonLues,
  marquerNotificationCommeLue as marquerNotificationCommeLueAPI,
  marquerToutesCommeLues as marquerToutesCommeLuesAPI,
  supprimerNotification as supprimerNotificationAPI,
} from "../services/notification.service";

import { ecouterNotification } from "../services/socket.service";

import type { Notification } from "../types/notification";

// Pré-chargement de l'audio pour éviter les blocages du navigateur
let instanceAudio: HTMLAudioElement | null = null;

function jouerSonNotification() {
  try {
    if (!instanceAudio) {
      instanceAudio = new Audio("/notification.mp3");
    }
    instanceAudio.currentTime = 0;
    const playPromise = instanceAudio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn("Son bloqué par le navigateur (interaction requise) :", err);
      });
    }
  } catch (err) {
    console.error("Erreur lors de la lecture du son :", err);
  }
}

interface NotificationStoreState {
  notifications: Notification[];
  nombreNonLues: number;
  chargement: boolean;
  ecouteInitialisee: boolean;

  chargerNotifications: () => Promise<void>;
  chargerCompteur: () => Promise<void>;
  marquerCommeLue: (id: string) => Promise<void>;
  marquerToutesCommeLues: () => Promise<void>;
  supprimerNotification: (id: string) => Promise<void>;
  ajouterNotification: (notification: Notification) => void;
  initialiserEcoute: () => () => void;
  reinitialiser: () => void;
}

export const useNotificationStore = create<NotificationStoreState>(
  (set, get) => ({
    notifications: [],
    nombreNonLues: 0,
    chargement: true,
    ecouteInitialisee: false,

    async chargerNotifications() {
      try {
        set({ chargement: true });

        const resultat = await obtenirNotifications();

        set({
          notifications: resultat.notifications,
          nombreNonLues: resultat.notifications.filter(
            (notification) => !notification.lue
          ).length,
          chargement: false,
        });
      } catch (error) {
        console.error(
          "Erreur lors du chargement des notifications :",
          error
        );
        set({ chargement: false });
      }
    },

    async chargerCompteur() {
      try {
        const nombre = await compterNotificationsNonLues();
        set({ nombreNonLues: nombre });
      } catch (error) {
        console.error(
          "Erreur lors du chargement du compteur de notifications :",
          error
        );
      }
    },

    async marquerCommeLue(id: string) {
      const etatActuel = get().notifications;
      const notificationCible = etatActuel.find((n) => n.id === id);

      // Si la notification est déjà lue ou introuvable dans le state local
      const etaitNonLue = notificationCible ? !notificationCible.lue : true;

      // 1. MISE À JOUR OPTIMISTE IMMÉDIATE (Cloche et liste à jour instantanément)
      set((state) => {
        const notifications = state.notifications.map((notification) =>
          notification.id === id
            ? { ...notification, lue: true }
            : notification
        );

        return {
          notifications,
          nombreNonLues: etaitNonLue
            ? Math.max(0, state.nombreNonLues - 1)
            : state.nombreNonLues,
        };
      });

      // 2. APPEL API EN ARRIÈRE-PLAN
      try {
        await marquerNotificationCommeLueAPI(id);
      } catch (error) {
        console.error("Échec de la mise à jour serveur, annulation :", error);
        // Rollback en cas d'erreur réseau
        set({
          notifications: etatActuel,
          nombreNonLues: get().nombreNonLues + (etaitNonLue ? 1 : 0),
        });
      }
    },

    async marquerToutesCommeLues() {
      const anciennesNotifications = get().notifications;
      const ancienCompteur = get().nombreNonLues;

      // 1. MISE À JOUR OPTIMISTE IMMÉDIATE
      set((state) => ({
        notifications: state.notifications.map((notification) => ({
          ...notification,
          lue: true,
        })),
        nombreNonLues: 0,
      }));

      // 2. APPEL API
      try {
        await marquerToutesCommeLuesAPI();
      } catch (error) {
        console.error("Erreur serveur marquerToutesCommeLues :", error);
        set({
          notifications: anciennesNotifications,
          nombreNonLues: ancienCompteur,
        });
      }
    },

    async supprimerNotification(id: string) {
      const etatActuel = get().notifications;
      const notificationASupprimer = etatActuel.find((n) => n.id === id);
      const etaitNonLue = notificationASupprimer && !notificationASupprimer.lue;

      // 1. MISE À JOUR OPTIMISTE IMMÉDIATE
      set((state) => ({
        notifications: state.notifications.filter(
          (notification) => notification.id !== id
        ),
        nombreNonLues: etaitNonLue
          ? Math.max(0, state.nombreNonLues - 1)
          : state.nombreNonLues,
      }));

      // 2. APPEL API
      try {
        await supprimerNotificationAPI(id);
      } catch (error) {
        console.error("Erreur lors de la suppression serveur :", error);
        set({
          notifications: etatActuel,
          nombreNonLues: get().nombreNonLues + (etaitNonLue ? 1 : 0),
        });
      }
    },

    ajouterNotification(notification: Notification) {
      // 1. Jouer le son immédiatement
      jouerSonNotification();

      // 2. Mettre à jour la liste et le compteur instantanément
      set((state) => {
        const existeDeja = state.notifications.some(
          (element) => element.id === notification.id
        );

        if (existeDeja) {
          return state;
        }

        const notifications = [
          notification,
          ...state.notifications,
        ].slice(0, 50);

        const estNonLue = !notification.lue;

        return {
          notifications,
          nombreNonLues: estNonLue
            ? state.nombreNonLues + 1
            : state.nombreNonLues,
        };
      });
    },

    initialiserEcoute() {
      if (get().ecouteInitialisee) {
        return () => {};
      }

      set({ ecouteInitialisee: true });

      const nettoyageSocket = ecouterNotification((notification) => {
        if (!notification || typeof notification !== "object") {
          return;
        }

        get().ajouterNotification(notification as Notification);
      });

      return () => {
        if (typeof nettoyageSocket === "function") {
          nettoyageSocket();
        }
        set({ ecouteInitialisee: false });
      };
    },

    reinitialiser() {
      set({
        notifications: [],
        nombreNonLues: 0,
        chargement: true,
        ecouteInitialisee: false,
      });
    },
  })
);