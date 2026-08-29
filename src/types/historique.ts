
export type CategorieHistorique =
  | "JAVASCRIPT"
  | "TYPESCRIPT"
  | "REACT"
  | "HTTP"
  | "API"
  | "HTML_CSS";

export type SeveriteHistorique =
  | "FAIBLE"
  | "MOYENNE"
  | "CRITIQUE";

export type RoleMessage =
  | "USER"
  | "SYSTEM";

export interface ConversationResume {
  id: string;
  title: string;
}

export interface Historique {
  id: string;
  ruleId: string | null;
  categorie: CategorieHistorique;
  titre: string;
  severite: SeveriteHistorique | null;
  extrait: string | null;
  createdAt: string;
  conversation: ConversationResume | null;
}

export interface ListeHistoriqueResponse {
  historique: Historique[];
  total: number;
}

export interface MessageConversation {
  id: string;
  role: RoleMessage;
  content: string;
  createdAt: string;
}

export interface ConversationDetail {
  id: string;
  historyEntryId: string | null;
  title: string;
  createdAt: string;
  messages: MessageConversation[];
}

export interface HistoriqueDetail extends Historique {
  conversation: ConversationDetail | null;
}

export interface HistoriqueDetailResponse {
  historique: HistoriqueDetail;
}

