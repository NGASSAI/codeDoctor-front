
import { api } from "../lib/api";

export type PlanAbonnement =
  | "FREE"
  | "PREMIUM";

export type StatutAbonnement =
  | "ACTIVE"
  | "EXPIRED"
  | "CANCELLED"
  | "INACTIVE";

export interface AbonnementUtilisateur {
  plan: PlanAbonnement;
  statut: StatutAbonnement;
  dateDebut: string | null;
  dateRenouvellement: string | null;
}

export interface AbonnementResponse {
  abonnement: AbonnementUtilisateur;
}

/**
 * Récupère l'abonnement de l'utilisateur connecté.
 *
 * Le JWT est automatiquement ajouté par l'intercepteur
 * Axios défini dans src/lib/api.ts.
 */
export async function obtenirMonAbonnement(): Promise<AbonnementUtilisateur> {
  const response = await api.get<AbonnementResponse>(
    "/abonnement/"
  );

  return response.data.abonnement;
}

