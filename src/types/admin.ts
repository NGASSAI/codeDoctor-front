
export interface StatistiquesAdmin {
  utilisateurs: number;

  experiences: {
    total: number;
    publiees: number;
    cachees: number;
  };

  commentaires: number;
  reactions: number;

  signalements: {
    total: number;
    enAttente: number;
  };

  exercices: number;
  conversations: number;
  notifications: number;
}

export interface DashboardAdminResponse {
  statistiques: StatistiquesAdmin;
}

/* =========================================================
   UTILISATEURS
========================================================= */

export interface CompteursUtilisateurAdmin {
  experiences: number;
  comments: number;
  reports: number;
}

export interface UtilisateurAdmin {
  id: string;
  email: string;
  displayName: string | null;
  role: "USER" | "ADMIN";
  emailVerified: boolean;
  createdAt: string;

  _count: CompteursUtilisateurAdmin;
}

export interface PaginationAdmin {
  page: number;
  limite: number;
  total: number;
  pages: number;
}

export interface UtilisateursAdminResponse {
  utilisateurs: UtilisateurAdmin[];
  pagination: PaginationAdmin;
}


/* =========================================================
   EXPERIENCES
========================================================= */

export interface AuteurExperienceAdmin {
  id: string;
  email: string;
  displayName: string | null;
}

export interface ModerateurExperienceAdmin {
  id: string;
  email: string;
  displayName: string | null;
}

export interface CompteursExperienceAdmin {
  comments: number;
  reactions: number;
  reports: number;
}

export type StatutExperienceAdmin =
  | "PUBLISHED"
  | "HIDDEN"
  | "DELETED";

export interface ExperienceAdmin {
  id: string;
  titre: string;
  probleme: string;
  categorie: string;
  statut: StatutExperienceAdmin;
  createdAt: string;
  moderatedAt: string | null;
  moderatedBy: string | null;

  user: AuteurExperienceAdmin;

  moderator: ModerateurExperienceAdmin | null;

  _count: CompteursExperienceAdmin;
}

export interface ExperiencesAdminResponse {
  experiences: ExperienceAdmin[];
  pagination: PaginationAdmin;
}

export interface ModifierStatutExperienceResponse {
  message: string;
  experience: ExperienceAdmin;
}


/* =========================================================
   SIGNALEMENTS
========================================================= */

export type StatutSignalementAdmin =
  | "PENDING"
  | "REVIEWED"
  | "RESOLVED"
  | "REJECTED";

export interface UtilisateurSignalementAdmin {
  id: string;
  displayName: string | null;
  email: string;
}

export interface ExperienceSignaleeAdmin {
  id: string;
  titre: string;
  probleme: string;
  categorie: string;
}

export interface SignalementAdmin {
  id: string;
  raison: string;
  description: string | null;
  statut: StatutSignalementAdmin;
  createdAt: string;
  resolvedAt: string | null;

  user: UtilisateurSignalementAdmin;

  experience: ExperienceSignaleeAdmin;
}

export interface SignalementsAdminResponse {
  signalements: SignalementAdmin[];
  total: number;
}

export interface ModifierStatutSignalementResponse {
  message: string;
  signalement: SignalementAdmin;
}
/* =========================================================
   PAIEMENTS
========================================================= */

export type StatutPaiementAdmin =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export type MethodePaiementAdmin =
  | "WHATSAPP";

export interface UtilisateurPaiementAdmin {
  id: string;
  email: string;
  displayName: string | null;
}

export interface PaiementAdmin {
  id: string;
  userId: string;
  montant: number;
  methode: MethodePaiementAdmin;
  statut: StatutPaiementAdmin;
  createdAt: string;
  updatedAt: string;

  user: UtilisateurPaiementAdmin;
}

export interface PaiementsAdminResponse {
  paiements: PaiementAdmin[];

  pagination: PaginationAdmin;
}

export interface ModifierPaiementAdminResponse {
  message: string;
  paiement: PaiementAdmin;
}
