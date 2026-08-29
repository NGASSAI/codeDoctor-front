
export interface UtilisateurProfil {
  id: string;
  email: string;
  displayName: string | null;
  emailVerified: boolean;
  createdAt: string;
}

export interface ProfilResponse {
  utilisateur: UtilisateurProfil;
}

export interface ModifierProfilInput {
  displayName: string | null;
}

export interface ModifierProfilResponse {
  message: string;
  utilisateur: UtilisateurProfil;
}
