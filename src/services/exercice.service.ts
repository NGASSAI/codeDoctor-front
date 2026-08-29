import { api } from "../lib/api";

/**
 * Catégories réellement utilisées par le backend.
 *
 * Ces valeurs correspondent à l'enum Prisma Category
 * utilisé dans exercice.controleur.ts.
 */
export type CategorieExercice =
  |  "JAVASCRIPT"
  | "TYPESCRIPT"
  | "REACT"
  | "HTTP"
  | "API"
  | "HTML_CSS";

/**
 * Difficulté d'un exercice.
 *
 * Le backend accepte une string pour le moment.
 */
export type DifficulteExercice =
  | "FACILE"
  | "MOYEN"
  | "DIFFICILE";

export interface Exercice {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  buggyCode: string;
  createdAt: string;
}

export interface ExerciceDetail extends Exercice {
  hint1: string;
  hint2: string;
  hint3: string;
}

export interface ListeExercicesResponse {
  exercices: Exercice[];
  total: number;
}

export interface ExerciceResponse {
  exercice: ExerciceDetail;
}

export interface IndiceResponse {
  exerciceId: string;
  numeroIndice: number;
  indice: string;
}

export interface TenterExerciceInput {
  reponse: string;
  indicesUtilises?: number;
}

export interface Tentative {
  id: string;
  exerciseId: string;
  correct: boolean;
  hintsUsed: number;
  createdAt: string;
}

export interface Progression {
  id: string;
  categorie: string;
  compteur: number;
}

export interface TenterExerciceResponse {
  succes: boolean;
  correct: boolean;
  tentative: Tentative;
  progression: Progression | null;
}

export interface TentativeUtilisateur {
  id: string;
  exerciseId: string;
  userAnswer: string;
  correct: boolean;
  hintsUsed: number;
  createdAt: string;
}

export interface MesTentativesResponse {
  tentatives: TentativeUtilisateur[];
  total: number;
}

export interface MaProgressionResponse {
  progression: Progression[];
}

/**
 * GET /api/exercices
 *
 * Liste des exercices.
 */
export async function obtenirExercices(
  categorie?: CategorieExercice,
  difficulte?: string
): Promise<ListeExercicesResponse> {
  const params: Record<string, string> = {};

  if (categorie) {
    params.categorie = categorie;
  }

  if (difficulte) {
    params.difficulte = difficulte;
  }

  const response =
    await api.get<ListeExercicesResponse>(
      "/exercices",
      {
        params,
      }
    );

  return response.data;
}

/**
 * GET /api/exercices/:id
 *
 * Récupérer un exercice.
 */
export async function obtenirExercice(
  id: string
): Promise<ExerciceDetail> {
  const response =
    await api.get<ExerciceResponse>(
      `/exercices/${encodeURIComponent(id)}`
    );

  return response.data.exercice;
}

/**
 * GET /api/exercices/:id/indices/:numero
 *
 * Récupérer un indice.
 */
export async function obtenirIndice(
  exerciceId: string,
  numero: number
): Promise<IndiceResponse> {
  const response =
    await api.get<IndiceResponse>(
      `/exercices/${encodeURIComponent(
        exerciceId
      )}/indices/${numero}`
    );

  return response.data;
}

/**
 * POST /api/exercices/:id/tenter
 *
 * Soumettre une réponse.
 */
export async function tenterExercice(
  exerciceId: string,
  reponse: string,
  indicesUtilises: number
) {
  const response = await api.post(
    `/exercices/${encodeURIComponent(exerciceId)}/tenter`,
    {
      reponse,
      indicesUtilises,
    }
  );

  return response.data;
}
/**
 * GET /api/exercices/mes-tentatives
 *
 * Historique des tentatives.
 */
export async function obtenirMesTentatives(
  exerciceId?: string
): Promise<MesTentativesResponse> {
  const response =
    await api.get<MesTentativesResponse>(
      "/exercices/mes-tentatives",
      {
        params: exerciceId
          ? { exerciceId }
          : undefined,
      }
    );

  return response.data;
}

/**
 * GET /api/exercices/ma-progression
 *
 * Progression de l'utilisateur.
 */
export async function obtenirMaProgression(): Promise<MaProgressionResponse> {
  const response =
    await api.get<MaProgressionResponse>(
      "/exercices/ma-progression"
    );

  return response.data;
}