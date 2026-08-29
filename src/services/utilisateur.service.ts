
import { api } from "../lib/api";

export interface ProfilUtilisateur {
  id: string;
  email: string;
  displayName: string | null;
  role?: "USER" | "ADMIN";
}

/**
 * Récupère le profil de l'utilisateur actuellement connecté.
 *
 * Le JWT est ajouté automatiquement par l'intercepteur
 * configuré dans src/lib/api.ts.
 */
export async function obtenirProfilUtilisateur(): Promise<ProfilUtilisateur> {
  const response = await api.get<ProfilUtilisateur>(
    "/utilisateurs/profil"
  );

  return response.data;
}

/**
 * Modifie le profil de l'utilisateur connecté.
 */
export async function modifierProfilUtilisateur(
  donnees: {
    displayName?: string;
    email?: string;
  }
): Promise<ProfilUtilisateur> {
  const response = await api.patch<ProfilUtilisateur>(
    "/utilisateurs/profil",
    donnees
  );

  return response.data;
}

