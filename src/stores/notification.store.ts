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
  initialiserEcoute: () => void;
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

    async marquerCommeLue(id) {
      await marquerNotificationCommeLueAPI(id);

      set((state) => {
        const notifications = state.notifications.map((notification) =>
          notification.id === id
            ? { ...notification, lue: true }
            : notification
        );

        return {
          notifications,
          nombreNonLues: notifications.filter(
            (notification) => !notification.lue
          ).length,
        };
      });
    },

    async marquerToutesCommeLues() {
      await marquerToutesCommeLuesAPI();

      set((state) => ({
        notifications: state.notifications.map((notification) => ({
          ...notification,
          lue: true,
        })),
        nombreNonLues: 0,
      }));
    },

    async supprimerNotification(id) {
      await supprimerNotificationAPI(id);

      set((state) => {
        const notifications = state.notifications.filter(
          (notification) => notification.id !== id
        );

        return {
          notifications,
          nombreNonLues: notifications.filter(
            (notification) => !notification.lue
          ).length,
        };
      });
    },

    ajouterNotification(notification) {
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

        return {
          notifications,
          nombreNonLues: notifications.filter(
            (element) => !element.lue
          ).length,
        };
      });
    },

    initialiserEcoute() {
      if (get().ecouteInitialisee) {
        return;
      }

      set({ ecouteInitialisee: true });

      ecouterNotification((notification) => {
        if (!notification || typeof notification !== "object") {
          return;
        }

        get().ajouterNotification(notification as Notification);
      });
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