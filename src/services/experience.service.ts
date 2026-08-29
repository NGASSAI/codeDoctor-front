import { api } from "../lib/api";

import type {
  CreerExperienceInput,
  CreerExperienceResponse,
  ExperienceResponse,
  ListeExperiencesResponse,
  ModifierExperienceInput,
  ModifierExperienceResponse,
  ParametresExperiences,
  SupprimerExperienceResponse,
} from "../types/experience";

/**
 * Récupérer les expériences publiques.
 *
 * GET /api/experiences
 */
export async function obtenirExperiences(
  parametres: ParametresExperiences = {}
): Promise<ListeExperiencesResponse> {
  const params: Record<string, string | number> = {};

  if (parametres.recherche?.trim()) {
    params.recherche =
      parametres.recherche.trim();
  }

  if (parametres.categorie) {
    params.categorie =
      parametres.categorie;
  }

  if (parametres.page !== undefined) {
    params.page = parametres.page;
  }

  if (parametres.limite !== undefined) {
    params.limite = parametres.limite;
  }

  const response =
    await api.get<ListeExperiencesResponse>(
      "/experiences",
      {
        params,
      }
    );

  return response.data;
}

/**
 * Récupérer une expérience précise.
 *
 * GET /api/experiences/:id
 */
export async function obtenirExperience(
  id: string
): Promise<ExperienceResponse["experience"]> {
  const response =
    await api.get<ExperienceResponse>(
      `/experiences/${id}`
    );

  return response.data.experience;
}

/**
 * Créer une expérience.
 *
 * POST /api/experiences
 */
export async function creerExperience(
  donnees: CreerExperienceInput
): Promise<CreerExperienceResponse> {
  const response =
    await api.post<CreerExperienceResponse>(
      "/experiences",
      donnees
    );

  return response.data;
}

/**
 * Modifier une expérience.
 *
 * PUT /api/experiences/:id
 */
export async function modifierExperience(
  id: string,
  donnees: ModifierExperienceInput
): Promise<ModifierExperienceResponse> {
  const response =
    await api.put<ModifierExperienceResponse>(
      `/experiences/${id}`,
      donnees
    );

  return response.data;
}

/**
 * Supprimer une expérience.
 *
 * DELETE /api/experiences/:id
 */
export async function supprimerExperience(
  id: string
): Promise<SupprimerExperienceResponse> {
  const response =
    await api.delete<SupprimerExperienceResponse>(
      `/experiences/${id}`
    );

  return response.data;
}