import { api } from "../lib/api";

export type CategorieDiagnostic =
  | "JAVASCRIPT"
  | "TYPESCRIPT"
  | "REACT"
  | "HTTP"
  | "API"
  | "HTML_CSS";

export interface DiagnosticResultat {
  regleId: string;
  code: string;
  titre: string;
  categorie: CategorieDiagnostic;
  severite: string;
  explication: string;
  cause: string;
  commentTrouver: string;
  correction: string;
  avant: string;
  apres: string;
}

export interface CapaciteDiagnostic {
  code: string;
  titre: string;
  categorie: CategorieDiagnostic;
  severite: string;
}

/**
 * Analyse locale du code (règles + syntaxe, sans IA).
 *
 * POST /api/diagnostic
 */
export async function analyserCode(parametres: {
  code: string;
  categorie: CategorieDiagnostic;
}): Promise<{
  succes: boolean;
  categorie: CategorieDiagnostic;
  nombreProblemes: number;
  resultats: DiagnosticResultat[];
}> {
  const response = await api.post<{
    succes: boolean;
    categorie: CategorieDiagnostic;
    nombreProblemes: number;
    resultats: DiagnosticResultat[];
  }>("/diagnostic", parametres);

  return response.data;
}

/**
 * Liste les capacités de détection sans IA pour une catégorie.
 *
 * GET /api/diagnostic/capacites
 */
export async function obtenirCapacites(
  categorie: CategorieDiagnostic
): Promise<CapaciteDiagnostic[]> {
  const response = await api.get<{ capacites: CapaciteDiagnostic[] }>(
    "/diagnostic/capacites",
    { params: { categorie } }
  );

  return response.data.capacites;
}