
export type CategorieExercice =
  | "JAVASCRIPT"
  | "TYPESCRIPT"
  | "REACT"
  | "HTTP"
  | "API"
  | "HTML_CSS";

export type DifficulteExercice =
  | "FACILE"
  | "MOYEN"
  | "DIFFICILE";

export interface Exercice {
  id: string;
  title: string;
  category: CategorieExercice;
  difficulty: string;
  buggyCode: string;
  createdAt: string;
}

export interface ExerciceDetail extends Exercice {
  hint1: string;
  hint2: string;
  hint3: string;
}

export interface ListeExercicesResponse {
  exercices: Exercice[];
  total: number;
}

export interface ExerciceResponse {
  exercice: ExerciceDetail;
}

export interface IndiceResponse {
  exerciceId: string;
  numeroIndice: number;
  indice: string;
}

export interface TentativeExercice {
  id: string;
  exerciseId: string;
  userAnswer?: string;
  correct: boolean;
  hintsUsed: number;
  createdAt: string;
}

export interface ProgressionExercice {
  id: string;
  categorie: CategorieExercice;
  compteur: number;
}

export interface TentativeResponse {
  succes: boolean;
  correct: boolean;
  tentative: {
    id: string;
    exerciseId: string;
    correct: boolean;
    hintsUsed: number;
    createdAt: string;
  };
  progression: ProgressionExercice | null;
}

export interface TentativesResponse {
  tentatives: TentativeExercice[];
  total: number;
}

export interface ProgressionResponse {
  progression: ProgressionExercice[];
}

