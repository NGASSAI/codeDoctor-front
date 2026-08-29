
export interface UtilisateurProfil {
  id: string;
  email: string;
  displayName: string | null;
  emailVerified: boolean;
  createdAt: string;
  recoveryHint: string | null;
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

export interface ModifierSecuriteRecuperationInput {
  recoveryAnswer: string;
  recoveryHint: string;
  motDePasseActuel?: string;
}

export interface ModifierSecuriteRecuperationResponse {
  message: string;
  utilisateur: UtilisateurProfil;
}
