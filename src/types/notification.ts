export type TypeNotification =
  | "NOUVEL_UTILISATEUR"
  | "NOUVELLE_EXPERIENCE"
  | "NOUVEAU_COMMENTAIRE"
  | "NOUVELLE_REACTION"
  | "NOUVEAU_SIGNALEMENT"
  | "EXPERIENCE_APPROUVEE"
  | "EXPERIENCE_REFUSEE"
  | "EXPERIENCE_SIGNALEE"
  | "PAIEMENT_APPROUVE"
  | "PAIEMENT_REJETE";

export interface Notification {
  id: string;
  userId: string;
  type: TypeNotification;
  titre: string;
  message: string;
  lien: string | null;
  lue: boolean;
  createdAt: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
}

export interface CompteurNotificationsResponse {
  nombre: number;
}