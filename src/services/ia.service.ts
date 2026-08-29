
import { api } from "../lib/api";

/**
 * État du quota quotidien d'analyses IA.
 */
export interface QuotaIA {
  plan: string;
  utilise: number;
  limite: number | null;
  restant: number | null;
  illimite: boolean;
  dateJour: string;
}

/**
 * Données envoyées au backend pour analyser du code.
 */
export interface DemandeAnalyseIA {
  code: string;
  langage: string;
  erreur?: string;
}

/**
 * Résultat retourné par le backend après analyse.
 *
 * Le contenu exact de "analyse" dépend du service IA
 * utilisé côté backend.
 */
export interface ResultatAnalyseIA {
  succes: boolean;
  analyse: unknown;
  quota: QuotaIA;
}

/**
 * Erreur retournée par l'API IA.
 */
export interface ErreurIA {
  erreur: string;
  quota?: {
    plan?: string;
    utilise: number;
    limite: number | null;
    restant: number;
    illimite?: boolean;
    dateJour?: string;
  };
}

/**
 * Récupère le quota IA de l'utilisateur connecté.
 */
export async function obtenirQuotaIA(): Promise<QuotaIA> {
  const response = await api.get<QuotaIA>("/ia/quota");

  return response.data;
}

/**
 * Analyse un problème de code avec l'IA.
 *
 * Cette fonctionnalité est complémentaire à CodeDoctor.
 * L'application principale ne doit jamais dépendre de cette
 * fonction pour fonctionner.
 */
export async function analyserCodeIA(
  donnees: DemandeAnalyseIA
): Promise<ResultatAnalyseIA> {
  const response =
    await api.post<ResultatAnalyseIA>(
      "/ia/analyser",
      donnees
    );

  return response.data;
}

