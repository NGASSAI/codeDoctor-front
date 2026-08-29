
import { api } from "../lib/api";

import type {
  CategorieExercice,
  DifficulteExercice,
  Exercice,
  ExerciceDetail,
  ListeExercicesResponse,
  ExerciceResponse,
  IndiceResponse,
  TentativesResponse,
  ProgressionResponse,
  TentativeResponse,
} from "../types/exercice";

/**
 * GET /api/exercices
 *
 * Liste les exercices disponibles.
 */
export async function obtenirExercices(
  categorie?: CategorieExercice,
  difficulte?: DifficulteExercice
): Promise<ListeExercicesResponse> {
  const params: Record<string, string> = {};

  if (categorie) {
    params.categorie = categorie;
  }

  if (difficulte) {
    params.difficulte = difficulte;
  }

  const response = await api.get<ListeExercicesResponse>(
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
 * Récupère un exercice.
 *
 * La solution n'est jamais envoyée au frontend.
 */
export async function obtenirExercice(
  id: string
): Promise<ExerciceDetail> {
  const response = await api.get<ExerciceResponse>(
    `/exercices/${encodeURIComponent(id)}`
  );

  return response.data.exercice;
}

/**
 * GET /api/exercices/:id/indices/:numero
 *
 * Récupère un indice précis.
 */
export async function obtenirIndice(
  exerciceId: string,
  numero: number
): Promise<IndiceResponse> {
  const response = await api.get<IndiceResponse>(
    `/exercices/${encodeURIComponent(
      exerciceId
    )}/indices/${numero}`
  );

  return response.data;
}

/**
 * POST /api/exercices/:id/tenter
 *
 * Soumet une correction.
 */
export async function tenterExercice(
  exerciceId: string,
  reponse: string,
  indicesUtilises: number
): Promise<TentativeResponse> {
  const response = await api.post<TentativeResponse>(
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
 * Récupère l'historique des tentatives de l'utilisateur.
 */
export async function obtenirMesTentatives(
  exerciceId?: string
): Promise<TentativesResponse> {
  const response = await api.get<TentativesResponse>(
    "/exercices/mes-tentatives",
    exerciceId
      ? {
          params: {
            exerciceId,
          },
        }
      : undefined
  );

  return response.data;
}

/**
 * GET /api/exercices/ma-progression
 *
 * Récupère la progression globale.
 */
export async function obtenirMaProgression(): Promise<ProgressionResponse> {
  const response = await api.get<ProgressionResponse>(
    "/exercices/ma-progression"
  );

  return response.data;
}

/**
 * Permet de réutiliser les types du module
 * sans les redéfinir dans les composants.
 */
export type {
  CategorieExercice,
  DifficulteExercice,
  Exercice,
  ExerciceDetail,
};
