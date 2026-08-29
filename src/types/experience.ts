
/**
 * Catégories officielles des expériences CodeDoctor.
 *
 * Ces valeurs correspondent exactement à l'enum
 * Category du backend.
 */
export type CategorieExperience =
  | "JAVASCRIPT"
  | "TYPESCRIPT"
  | "REACT"
  | "HTTP"
  | "API"
  | "HTML_CSS";

/**
 * Statuts possibles d'une expérience.
 */
export type StatutExperience =
  | "PUBLISHED"
  | "PENDING"
  | "REJECTED"
  | "DELETED"
  | string;

/**
 * Auteur d'une expérience.
 *
 * Le backend utilise la propriété "user".
 */
export interface AuteurExperience {
  id: string;
  displayName: string | null;
}

/**
 * Compteurs associés à une expérience.
 */
export interface CompteursExperience {
  comments: number;
  reactions: number;
  reports?: number;
}

/**
 * Expérience technique.
 */
export interface Experience {
  id: string;
  userId: string;

  titre: string;
  probleme: string;

  code: string | null;

  cause: string;
  solution: string;

  technologie: string | null;
  categorie: CategorieExperience;

  statut: StatutExperience;

  createdAt: string;
  updatedAt: string;

  user: AuteurExperience;

  _count: CompteursExperience;
}

/**
 * Commentaire d'une expérience.
 */
export interface CommentaireExperience {
  id: string;
  contenu: string;
  createdAt: string;
  updatedAt?: string;

  user: AuteurExperience;
}

/**
 * Réaction.
 *
 * Le contenu exact dépend de l'enum ReactionType
 * du backend.
 */
export interface ReactionExperience {
  id: string;
  userId: string;
  experienceId: string;
  type: string;
  createdAt?: string;
}

/**
 * Expérience complète récupérée par son ID.
 */
export interface ExperienceDetail extends Experience {
  comments: CommentaireExperience[];
  reactions: ReactionExperience[];
}

/**
 * Données nécessaires à la création
 * d'une expérience.
 */
export interface CreerExperienceInput {
  titre: string;
  probleme: string;
  code?: string;
  cause: string;
  solution: string;
  technologie?: string;
  categorie: CategorieExperience;
}

/**
 * Données modifiables.
 */
export interface ModifierExperienceInput {
  titre?: string;
  probleme?: string;
  code?: string;
  cause?: string;
  solution?: string;
  technologie?: string;
  categorie?: CategorieExperience;
}

/**
 * Paramètres de recherche.
 */
export interface ParametresExperiences {
  recherche?: string;
  categorie?: CategorieExperience;
  page?: number;
  limite?: number;
}

/**
 * Pagination.
 */
export interface PaginationExperiences {
  page: number;
  limite: number;
  total: number;
  pages: number;
}

/**
 * Réponse de la liste.
 */
export interface ListeExperiencesResponse {
  experiences: Experience[];
  pagination: PaginationExperiences;
}

/**
 * Réponse d'une expérience.
 */
export interface ExperienceResponse {
  experience: ExperienceDetail;
}

/**
 * Réponse après création.
 */
export interface CreerExperienceResponse {
  message: string;
  experience: Experience;
}

/**
 * Réponse après modification.
 */
export interface ModifierExperienceResponse {
  message: string;
  experience: Experience | null;
}

/**
 * Réponse après suppression.
 */
export interface SupprimerExperienceResponse {
  message: string;
}

