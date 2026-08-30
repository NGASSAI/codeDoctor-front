import { create } from "zustand";

import { deconnecterSocket } from "../services/socket.service";
import { useNotificationStore } from "./notification.store";

export interface Utilisateur {
  id: string;
  email: string;
  displayName: string | null;
  role?: "USER" | "ADMIN";
}

interface AuthState {
  utilisateur: Utilisateur | null;
  token: string | null;
  refreshToken: string | null;
  initialise: boolean;
  connecte: boolean;

  initialiser: () => void;
  definirSession: (
    utilisateur: Utilisateur,
    token: string,
    refreshToken: string
  ) => void;
  mettreAJourUtilisateur: (utilisateur: Utilisateur) => void;
  deconnecter: () => void;
}

function recupererUtilisateur(): Utilisateur | null {
  const donnees = localStorage.getItem("utilisateur");

  if (!donnees) {
    return null;
  }

  try {
    return JSON.parse(donnees) as Utilisateur;
  } catch {
    localStorage.removeItem("utilisateur");
    return null;
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  utilisateur: null,
  token: null,
  refreshToken: null,
  initialise: false,
  connecte: false,

  initialiser: () => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");
    const utilisateur = recupererUtilisateur();

    set({
      token,
      refreshToken,
      utilisateur,
      connecte: Boolean(token && utilisateur),
      initialise: true,
    });
  },

  definirSession: (utilisateur, token, refreshToken) => {
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("utilisateur", JSON.stringify(utilisateur));

    set({
      utilisateur,
      token,
      refreshToken,
      connecte: true,
      initialise: true,
    });
  },

  mettreAJourUtilisateur: (utilisateur) => {
    localStorage.setItem("utilisateur", JSON.stringify(utilisateur));

    set({
      utilisateur,
    });
  },

  deconnecter: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("utilisateur");

    set({
      utilisateur: null,
      token: null,
      refreshToken: null,
      connecte: false,
      initialise: true,
    });

    deconnecterSocket();
    useNotificationStore.getState().reinitialiser();
  },
}));