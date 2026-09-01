import { api } from "../lib/api";

export type RaisonSignalement =
  | "SPAM"
  | "HARCELEMENT"
  | "CONTENU_INAPPROPRIE"
  | "CODE_DANGEREUX"
  | "INFORMATIONS_FAUSSES"
  | "AUTRE";

export const RAISONS_SIGNALEMENT: {
  valeur: RaisonSignalement;
  label: string;
}[] = [
  { valeur: "SPAM", label: "Spam" },
  { valeur: "HARCELEMENT", label: "Harcèlement" },
  { valeur: "CONTENU_INAPPROPRIE", label: "Contenu inapproprié" },
  { valeur: "CODE_DANGEREUX", label: "Code dangereux" },
  { valeur: "INFORMATIONS_FAUSSES", label: "Informations fausses" },
  { valeur: "AUTRE", label: "Autre" },
];

/**
 * POST /api/experiences/:experienceId/signalements
 */
export async function signalerExperience(
  experienceId: string,
  raison: RaisonSignalement,
  description?: string
): Promise<{ message: string }> {
  const response = await api.post<{ message: string }>(
    `/experiences/${encodeURIComponent(
      experienceId
    )}/signalements`,
    {
      raison,
      ...(description?.trim() ? { description: description.trim() } : {}),
    }
  );

  return response.data;
}