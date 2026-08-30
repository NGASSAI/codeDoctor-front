
import { api } from "../lib/api";

import type {
  NotificationsAdminResponse,
  DashboardAdminResponse,
  ExperiencesAdminResponse,
  ModifierPaiementAdminResponse,
  ModifierStatutExperienceResponse,
  ModifierStatutSignalementResponse,
  PaiementsAdminResponse,
  SignalementsAdminResponse,
  StatutExperienceAdmin,
  StatutSignalementAdmin,
  UtilisateursAdminResponse,
} from "../types/admin";

/* =========================================================
   NOTIFICATIONS
========================================================= */

export async function obtenirNotificationsAdmin(
  page = 1,
  limite = 20
): Promise<NotificationsAdminResponse> {
  const response = await api.get<NotificationsAdminResponse>(
    "/admin/notifications",
    {
      params: { page, limite },
    }
  );

  return response.data;
}
/* =========================================================
   DASHBOARD
========================================================= */

export async function obtenirDashboardAdmin(): Promise<DashboardAdminResponse> {
  const response =
    await api.get<DashboardAdminResponse>(
      "/admin/dashboard"
    );

  return response.data;
}


/* =========================================================
   UTILISATEURS
========================================================= */

export async function obtenirUtilisateursAdmin(
  page = 1,
  limite = 10
): Promise<UtilisateursAdminResponse> {
  const response =
    await api.get<UtilisateursAdminResponse>(
      "/admin/utilisateurs",
      {
        params: {
          page,
          limite,
        },
      }
    );

  return response.data;
}


/* =========================================================
   EXPERIENCES
========================================================= */

export async function obtenirExperiencesAdmin(
  page = 1,
  limite = 10
): Promise<ExperiencesAdminResponse> {
  const response =
    await api.get<ExperiencesAdminResponse>(
      "/admin/experiences",
      {
        params: {
          page,
          limite,
        },
      }
    );

  return response.data;
}


/**
 * Modifier le statut d'une expérience.
 *
 * Statuts acceptés par le backend :
 * PUBLISHED
 * HIDDEN
 * DELETED
 */
export async function modifierStatutExperienceAdmin(
  id: string,
  statut: StatutExperienceAdmin
): Promise<ModifierStatutExperienceResponse> {
  const response =
    await api.patch<ModifierStatutExperienceResponse>(
      `/admin/experiences/${id}/statut`,
      {
        statut,
      }
    );

  return response.data;
}

/**
 * Supprimer définitivement une expérience.
 */
export async function supprimerExperienceAdmin(
  id: string
): Promise<{ success: boolean }> {
  const response =
    await api.delete<{ success: boolean }>(
      `/admin/experiences/${id}`
    );

  return response.data;
}


/* =========================================================
   SIGNALEMENTS
========================================================= */

export async function obtenirSignalementsAdmin(
  statut?: StatutSignalementAdmin
): Promise<SignalementsAdminResponse> {
  const response =
    await api.get<SignalementsAdminResponse>(
      "/admin/signalements",
      {
        params: statut
          ? {
              statut,
            }
          : undefined,
      }
    );

  return response.data;
}


/**
 * Modifier le statut d'un signalement.
 *
 * Statuts acceptés par le backend :
 * PENDING
 * REVIEWED
 * RESOLVED
 * REJECTED
 */
export async function modifierStatutSignalementAdmin(
  id: string,
  statut: StatutSignalementAdmin
): Promise<ModifierStatutSignalementResponse> {
  const response =
    await api.patch<ModifierStatutSignalementResponse>(
      `/admin/signalements/${id}/statut`,
      {
        statut,
      }
    );

  return response.data;
}

/**
 * Supprimer définitivement un signalement.
 */
export async function supprimerSignalementAdmin(
  id: string
): Promise<{ success: boolean }> {
  const response =
    await api.delete<{ success: boolean }>(
      `/admin/signalements/${id}`
    );

  return response.data;
}
/* =========================================================
   PAIEMENTS
========================================================= */

/**
 * Récupérer les demandes de paiement Premium
 * pour l'administration.
 */
export async function obtenirPaiementsAdmin(
  page = 1,
  limite = 20
): Promise<PaiementsAdminResponse> {
  const response =
    await api.get<PaiementsAdminResponse>(
      "/admin/paiements",
      {
        params: {
          page,
          limite,
        },
      }
    );

  return response.data;
}


/**
 * Approuver une demande de paiement Premium.
 *
 * Le backend active automatiquement
 * l'abonnement Premium de l'utilisateur.
 */
export async function approuverPaiementAdmin(
  paiementId: string
): Promise<ModifierPaiementAdminResponse> {
  const response =
    await api.patch<ModifierPaiementAdminResponse>(
      `/admin/paiements/${paiementId}/approuver`
    );

  return response.data;
}


/**
 * Rejeter une demande de paiement Premium.
 */
export async function rejeterPaiementAdmin(
  paiementId: string
): Promise<ModifierPaiementAdminResponse> {
  const response =
    await api.patch<ModifierPaiementAdminResponse>(
      `/admin/paiements/${paiementId}/rejeter`
    );

  return response.data;
}

/**
 * Supprimer définitivement une demande de paiement.
 */
export async function supprimerPaiementAdmin(
  paiementId: string
): Promise<{ success: boolean }> {
  const response =
    await api.delete<{ success: boolean }>(
      `/admin/paiements/${paiementId}`
    );

  return response.data;
}


/* =========================================================
   GESTION UTILISATEURS
========================================================= */

/**
 * Bloquer un utilisateur.
 */
export async function bloquerUtilisateurAdmin(
  utilisateurId: string
): Promise<{ success: boolean }> {
  const response =
    await api.post<{ success: boolean }>(
      `/admin/utilisateurs/${utilisateurId}/bloquer`
    );

  return response.data;
}


/**
 * Débloquer un utilisateur.
 */
export async function debloquerUtilisateurAdmin(
  utilisateurId: string
): Promise<{ success: boolean }> {
  const response =
    await api.delete<{ success: boolean }>(
      `/admin/utilisateurs/${utilisateurId}/bloquer`
    );

  return response.data;
}


/**
 * Supprimer un utilisateur.
 */
export async function supprimerUtilisateurAdmin(
  utilisateurId: string
): Promise<{ success: boolean }> {
  const response =
    await api.delete<{ success: boolean }>(
      `/admin/utilisateurs/${utilisateurId}`
    );

  return response.data;
}


/**
 * Modifier le rôle d'un utilisateur.
 */
export async function modifierRoleUtilisateurAdmin(
  utilisateurId: string,
  role: "USER" | "ADMIN"
): Promise<{ success: boolean }> {
  const response =
    await api.patch<{ success: boolean }>(
      `/admin/utilisateurs/${utilisateurId}/role`,
      { role }
    );

  return response.data;
}
