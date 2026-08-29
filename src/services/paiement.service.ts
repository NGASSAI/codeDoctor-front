import { api } from "../lib/api";

export type StatutPaiement =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export interface Paiement {
  id: string;
  montant: number;
  methode: string;
  statut: StatutPaiement;
  createdAt: string;
  updatedAt?: string;
}

export interface MesPaiementsResponse {
  paiements: Paiement[];
}

export interface CreerPaiementResponse {
  message: string;
  paiement: Paiement & {
    userId: string;
  };
}

/**
 * Crée une demande de paiement Premium.
 */
export async function creerDemandePaiement(
  montant: number
): Promise<CreerPaiementResponse> {
  const response =
    await api.post<CreerPaiementResponse>(
      "/paiements",
      {
        montant,
      }
    );

  return response.data;
}

/**
 * Récupère les paiements de l'utilisateur connecté.
 */
export async function obtenirMesPaiements(): Promise<Paiement[]> {
  const response =
    await api.get<MesPaiementsResponse>(
      "/paiements"
    );

  return response.data.paiements;
}

/**
 * Récupère un paiement précis.
 */
export async function obtenirPaiement(
  paiementId: string
): Promise<Paiement> {
  const response =
    await api.get<{ paiement: Paiement }>(
      `/paiements/${encodeURIComponent(paiementId)}`
    );

  return response.data.paiement;
}