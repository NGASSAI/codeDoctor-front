import { api } from "../lib/api";

export interface QuotaIA {
  plan: "FREE" | "PREMIUM" | "ADMIN";
  utilise: number;
  limite: number | null;
  restant: number | null;
  illimite: boolean;
  dateJour: string;
}

export interface AnalyseIAInput {
  code: string;
  langage: string;
  erreur?: string;
}

export interface AnalyseIAResponse {
  succes: boolean;
  analyse: string;
  quota: QuotaIA;
}

export async function analyserCodeIA(
  donnees: AnalyseIAInput
): Promise<AnalyseIAResponse> {
  const response = await api.post<AnalyseIAResponse>(
    "/ia/analyser",
    donnees
  );

  return response.data;
}

export async function obtenirQuotaIA(): Promise<QuotaIA> {
  const response = await api.get<QuotaIA>("/ia/quota");
  return response.data;
}