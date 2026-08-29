
import { api } from "../lib/api";

import type {
  ModifierProfilInput,
  ModifierProfilResponse,
  ProfilResponse,
} from "../types/utilisateur";

export async function obtenirMonProfil() {
  const response =
    await api.get<ProfilResponse>(
      "/utilisateurs/profil"
    );

  return response.data.utilisateur;
}

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
