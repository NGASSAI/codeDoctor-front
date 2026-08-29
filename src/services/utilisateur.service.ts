
import { api } from "../lib/api";

import type {
  ModifierProfilInput,
  ModifierProfilResponse,
  ProfilResponse,
  ModifierSecuriteRecuperationInput,
  ModifierSecuriteRecuperationResponse,
} from "../types/utilisateur";

/**
 * Récupérer le profil de l'utilisateur connecté.
 */
export async function obtenirMonProfil() {
  const response =
    await api.get<ProfilResponse>(
      "/utilisateurs/profil"
    );

  return response.data.utilisateur;
}

/**
 * Modifier les informations principales du profil.
 */
export async function modifierMonProfil(
  donnees: ModifierProfilInput
) {
  const response =
    await api.patch<ModifierProfilResponse>(
      "/utilisateurs/profil",
      donnees
    );

  return response.data.utilisateur;
}

/**
 * Définir ou modifier les informations
 * de récupération du compte.
 *
 * La phrase secrète n'est jamais stockée
 * en clair côté backend.
 */
export async function modifierSecuriteRecuperation(
  donnees: ModifierSecuriteRecuperationInput
) {
  const response =
    await api.patch<ModifierSecuriteRecuperationResponse>(
      "/utilisateurs/profil/securite-recuperation",
      donnees
    );

  return response.data.utilisateur;
}
