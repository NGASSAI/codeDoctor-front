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

export interface DiagnosticResponse {
  succes: boolean;
  categorie: CategorieDiagnostic;
  nombreProblemes: number;
  resultats: DiagnosticResultat[];
}

export interface DiagnosticInput {
  code: string;
  categorie: CategorieDiagnostic;
}

export async function analyserCode(
  donnees: DiagnosticInput
): Promise<DiagnosticResponse> {
  const response =
    await api.post<DiagnosticResponse>(
      "/diagnostic",
      donnees
    );

  return response.data;
}