import { api } from "../lib/api";

import type {
  CompteurNotificationsResponse,
  NotificationsResponse,
} from "../types/notification";

export async function obtenirNotifications() {
  const response =
    await api.get<NotificationsResponse>(
      "/notifications"
    );

  return response.data;
}

export async function obtenirNotificationsNonLues() {
  const response =
    await api.get<NotificationsResponse>(
      "/notifications/non-lues"
    );

  return response.data;
}

export async function compterNotificationsNonLues(): Promise<number> {
  const response =
    await api.get<CompteurNotificationsResponse>(
      "/notifications/compteur"
    );

  return response.data.nombre;
}

export async function marquerNotificationCommeLue(
  id: string
): Promise<void> {
  await api.patch(
    `/notifications/${encodeURIComponent(id)}/lue`
  );
}

export async function marquerToutesCommeLues(): Promise<void> {
  await api.patch("/notifications/lues");
}

export async function supprimerNotification(
  id: string
): Promise<void> {
  await api.delete(
    `/notifications/${encodeURIComponent(id)}`
  );
}