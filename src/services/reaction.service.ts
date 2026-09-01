    import { api } from "../lib/api";

export type TypeReaction = "LIKE" | "USEFUL";

export interface Reaction {
  id: string;
  experienceId: string;
  userId: string;
  type: TypeReaction;
  createdAt: string;
  user: {
    id: string;
    displayName: string | null;
  };
}

/**
 * GET /api/experiences/:experienceId/reactions
 */
export async function obtenirReactions(
  experienceId: string
): Promise<Reaction[]> {
  const response = await api.get<{ reactions: Reaction[] }>(
    `/experiences/${encodeURIComponent(experienceId)}/reactions`
  );

  return response.data.reactions;
}

/**
 * POST /api/experiences/:experienceId/reactions
 */
export async function ajouterReaction(
  experienceId: string,
  type: TypeReaction
): Promise<Reaction> {
  const response = await api.post<{
    message: string;
    reaction: Reaction;
  }>(`/experiences/${encodeURIComponent(experienceId)}/reactions`, {
    type,
  });

  return response.data.reaction;
}

/**
 * DELETE /api/experiences/:experienceId/reactions/:type
 */
export async function supprimerReaction(
  experienceId: string,
  type: TypeReaction
): Promise<void> {
  await api.delete(
    `/experiences/${encodeURIComponent(
      experienceId
    )}/reactions/${type}`
  );
}