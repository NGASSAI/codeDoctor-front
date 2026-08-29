
import { api } from "../lib/api";

import type {
  ConversationDetail,
  HistoriqueDetailResponse,
  ListeHistoriqueResponse,
} from "../types/historique";

export async function obtenirHistorique(): Promise<ListeHistoriqueResponse> {
  const response =
    await api.get<ListeHistoriqueResponse>(
      "/historique"
    );

  return response.data;
}

export async function obtenirHistoriqueDetail(
  id: string
): Promise<HistoriqueDetailResponse> {
  const response =
    await api.get<HistoriqueDetailResponse>(
      `/historique/${encodeURIComponent(id)}`
    );

  return response.data;
}

export async function supprimerHistorique(
  id: string
): Promise<void> {
  await api.delete(
    `/historique/${encodeURIComponent(id)}`
  );
}

export async function creerConversation(
  historiqueId: string,
  titre?: string
): Promise<ConversationDetail> {
  const response =
    await api.post<{
      conversation: ConversationDetail;
    }>(
      `/historique/${encodeURIComponent(
        historiqueId
      )}/conversation`,
      titre?.trim()
        ? {
            titre: titre.trim(),
          }
        : {}
    );

  return response.data.conversation;
}

export async function obtenirConversation(
  conversationId: string
): Promise<ConversationDetail> {
  const response =
    await api.get<{
      conversation: ConversationDetail;
    }>(
      `/historique/conversations/${encodeURIComponent(
        conversationId
      )}`
    );

  return response.data.conversation;
}

export async function ajouterMessage(
  conversationId: string,
  role: "USER" | "SYSTEM",
  content: string
) {
  const response =
    await api.post(
      `/historique/conversations/${encodeURIComponent(
        conversationId
      )}/messages`,
      {
        role,
        content,
      }
    );

  return response.data;
}
