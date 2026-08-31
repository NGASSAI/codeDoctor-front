import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  ChevronDown,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

import {
  creerExerciceAdmin,
  modifierExerciceAdmin,
  obtenirExercicesAdmin,
  supprimerExerciceAdmin,
  type DonneesExerciceFormulaire,
  type ExerciceAdmin,
} from "../../services/exercice.service";

const CATEGORIES = [
  { valeur: "JAVASCRIPT", label: "JavaScript" },
  { valeur: "TYPESCRIPT", label: "TypeScript" },
  { valeur: "REACT", label: "React" },
  { valeur: "HTTP", label: "HTTP" },
  { valeur: "API", label: "API" },
  { valeur: "HTML_CSS", label: "HTML / CSS" },
] as const;

const DIFFICULTES = ["FACILE", "MOYEN", "DIFFICILE"] as const;

// Nombre d'exercices affichés par défaut sur "Tous"
const NB_EXERCICES_PAR_DEFAUT = 6;

const FORMULAIRE_VIDE: DonneesExerciceFormulaire = {
  title: "",
  category: "JAVASCRIPT",
  difficulty: "FACILE",
  buggyCode: "",
  hint1: "",
  hint2: "",
  hint3: "",
  solution: "",
  keywords: [],
};

function libelleCategorie(categorie: string) {
  return CATEGORIES.find((c) => c.valeur === categorie)?.label ?? categorie;
}

function classeDifficulte(difficulte: string) {
  if (difficulte === "FACILE") return "success" as const;
  if (difficulte === "DIFFICILE") return "danger" as const;
  return "warning" as const;
}

export default function ExercicesAdminPage() {
  const [exercices, setExercices] = useState<ExerciceAdmin[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const [recherche, setRecherche] = useState("");

  // Gestion du filtrage par catégorie
  const [categorieSelectionnee, setCategorieSelectionnee] = useState<string>("TOUS");
  const [afficherTout, setAfficherTout] = useState(false);

  const [modaleOuverte, setModaleOuverte] = useState(false);
  const [exerciceEdite, setExerciceEdite] = useState<ExerciceAdmin | null>(null);
  const [formulaire, setFormulaire] = useState<DonneesExerciceFormulaire>(FORMULAIRE_VIDE);
  const [motsClesTexte, setMotsClesTexte] = useState("");
  const [enregistrement, setEnregistrement] = useState(false);
  const [erreurFormulaire, setErreurFormulaire] = useState("");

  const [enSuppression, setEnSuppression] = useState<string | null>(null);

  // Charger les exercices
  const chargerExercices = useCallback(async (isInitial = false) => {
    try {
      if (!isInitial) setChargement(true);
      setErreur("");
      const resultat = await obtenirExercicesAdmin();
      setExercices(resultat.exercices);
    } catch (error) {
      console.error("Erreur lors du chargement des exercices :", error);
      setErreur("Impossible de récupérer les exercices.");
    } finally {
      setChargement(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    obtenirExercicesAdmin()
      .then((resultat) => {
        if (active) {
          setExercices(resultat.exercices);
        }
      })
      .catch((error) => {
        if (active) {
          console.error("Erreur lors du chargement des exercices :", error);
          setErreur("Impossible de récupérer les exercices.");
        }
      })
      .finally(() => {
        if (active) {
          setChargement(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  // Écoute de la touche Échap pour fermer la modale
  useEffect(() => {
    function gererTouche(e: KeyboardEvent) {
      if (e.key === "Escape" && modaleOuverte && !enregistrement) {
        setModaleOuverte(false);
      }
    }
    window.addEventListener("keydown", gererTouche);
    return () => window.removeEventListener("keydown", gererTouche);
  }, [modaleOuverte, enregistrement]);

  // Filtrage principal (recherche + catégorie)
  const exercicesFiltres = useMemo(() => {
    return exercices.filter((exercice) => {
      const correspondCategorie =
        categorieSelectionnee === "TOUS" || exercice.category === categorieSelectionnee;

      const terme = recherche.trim().toLowerCase();
      const correspondRecherche =
        !terme ||
        exercice.title.toLowerCase().includes(terme) ||
        exercice.category.toLowerCase().includes(terme) ||
        exercice.difficulty.toLowerCase().includes(terme);

      return correspondCategorie && correspondRecherche;
    });
  }, [exercices, categorieSelectionnee, recherche]);

  // Découpage pour limiter l'affichage si on est sur "Tous" sans avoir cliqué "Voir tout"
  const exercicesAffiches = useMemo(() => {
    if (categorieSelectionnee === "TOUS" && !afficherTout && !recherche.trim()) {
      return exercicesFiltres.slice(0, NB_EXERCICES_PAR_DEFAUT);
    }
    return exercicesFiltres;
  }, [exercicesFiltres, categorieSelectionnee, afficherTout, recherche]);

  const estLimite =
    categorieSelectionnee === "TOUS" &&
    !afficherTout &&
    !recherche.trim() &&
    exercicesFiltres.length > NB_EXERCICES_PAR_DEFAUT;

  function changerCategorie(valeur: string) {
    setCategorieSelectionnee(valeur);
    setAfficherTout(false); // Réinitialise la limite lors du changement de catégorie
  }

  function ouvrirCreation() {
    setExerciceEdite(null);
    setFormulaire(FORMULAIRE_VIDE);
    setMotsClesTexte("");
    setErreurFormulaire("");
    setModaleOuverte(true);
  }

  function ouvrirEdition(exercice: ExerciceAdmin) {
    setExerciceEdite(exercice);
    setFormulaire({
      title: exercice.title,
      category: exercice.category,
      difficulty: exercice.difficulty,
      buggyCode: exercice.buggyCode,
      hint1: exercice.hint1,
      hint2: exercice.hint2,
      hint3: exercice.hint3,
      solution: exercice.solution,
      keywords: exercice.keywords,
    });
    setMotsClesTexte(exercice.keywords.join(", "));
    setErreurFormulaire("");
    setModaleOuverte(true);
  }

  function fermerModale() {
    if (enregistrement) return;
    setModaleOuverte(false);
  }

  async function soumettreFormulaire() {
    const donnees: DonneesExerciceFormulaire = {
      ...formulaire,
      keywords: motsClesTexte
        .split(",")
        .map((mot) => mot.trim())
        .filter(Boolean),
    };

    if (!donnees.title.trim()) return setErreurFormulaire("Le titre est requis.");
    if (!donnees.buggyCode.trim()) return setErreurFormulaire("Le code buggé est requis.");
    if (!donnees.hint1.trim() || !donnees.hint2.trim() || !donnees.hint3.trim()) {
      return setErreurFormulaire("Les 3 indices sont requis.");
    }
    if (!donnees.solution.trim()) return setErreurFormulaire("La solution est requise.");

    try {
      setEnregistrement(true);
      setErreurFormulaire("");

      if (exerciceEdite) {
        const resultat = await modifierExerciceAdmin(exerciceEdite.id, donnees);
        setExercices((anciens) =>
          anciens.map((a) => (a.id === exerciceEdite.id ? resultat.exercice : a))
        );
      } else {
        const resultat = await creerExerciceAdmin(donnees);
        setExercices((anciens) => [resultat.exercice, ...anciens]);
      }

      setModaleOuverte(false);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'exercice :", error);
      setErreurFormulaire("Impossible d'enregistrer cet exercice. Vérifiez les champs.");
    } finally {
      setEnregistrement(false);
    }
  }

  async function supprimer(exercice: ExerciceAdmin) {
    const confirmer = window.confirm(
      `Voulez-vous vraiment supprimer définitivement "${exercice.title}" ?`
    );
    if (!confirmer) return;

    try {
      setEnSuppression(exercice.id);
      await supprimerExerciceAdmin(exercice.id);
      setExercices((anciens) => anciens.filter((a) => a.id !== exercice.id));
    } catch (error) {
      console.error("Erreur lors de la suppression de l'exercice :", error);
      setErreur("Impossible de supprimer cet exercice.");
    } finally {
      setEnSuppression(null);
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* EN-TÊTE */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-blue-950 sm:text-3xl">
              Exercices
            </h1>
            <Badge>
              {exercicesFiltres.length} exercice{exercicesFiltres.length > 1 ? "s" : ""}
            </Badge>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-700/70">
            Sélectionnez une catégorie pour filtrer les exercices ou créez-en un nouveau.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void chargerExercices()}
            disabled={chargement}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw size={16} className={chargement ? "animate-spin" : ""} />
            Actualiser
          </button>

          <button
            type="button"
            onClick={ouvrirCreation}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-cyan-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:from-blue-700 hover:to-cyan-700"
          >
            <Plus size={16} />
            Ajouter un exercice
          </button>
        </div>
      </div>

      {/* FILTRES DE CATÉGORIES */}
      <div className="flex flex-wrap items-center gap-2 border-b border-blue-100 pb-4">
        <button
          type="button"
          onClick={() => changerCategorie("TOUS")}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
            categorieSelectionnee === "TOUS"
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
              : "bg-white text-blue-700 border border-blue-200 hover:bg-blue-50"
          }`}
        >
          Tous ({exercices.length})
        </button>

        {CATEGORIES.map((cat) => {
          const nbDansCat = exercices.filter((e) => e.category === cat.valeur).length;
          const estActif = categorieSelectionnee === cat.valeur;

          return (
            <button
              key={cat.valeur}
              type="button"
              onClick={() => changerCategorie(cat.valeur)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                estActif
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-white text-blue-700 border border-blue-200 hover:bg-blue-50"
              }`}
            >
              {cat.label} ({nbDansCat})
            </button>
          );
        })}
      </div>

      {/* RECHERCHE */}
      <Card className="border-blue-100 p-4">
        <input
          type="search"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          placeholder="Rechercher un exercice, une difficulté..."
          className="h-11 w-full rounded-xl border border-blue-200 bg-white px-4 text-sm text-blue-950 outline-none transition placeholder:text-blue-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
        />
      </Card>

      {/* ERREUR */}
      {erreur && (
        <Card className="border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-red-100 p-2 text-red-600">
              <AlertCircle size={20} />
            </div>
            <div>
              <h2 className="font-semibold text-red-900">Une erreur est survenue</h2>
              <p className="mt-1 text-sm text-red-700">{erreur}</p>
            </div>
          </div>
        </Card>
      )}

      {/* CHARGEMENT / LISTE */}
      {chargement && exercices.length === 0 ? (
        <Card className="border-blue-100 p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <Loader2 size={28} className="animate-spin text-blue-500" />
            <p className="mt-4 text-sm font-semibold text-blue-900">
              Chargement des exercices...
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card className="overflow-hidden border-blue-100">
            {/* VUE MOBILE */}
            <div className="divide-y divide-blue-100 md:hidden">
              {exercicesAffiches.length === 0 ? (
                <div className="p-10 text-center">
                  <BookOpen size={32} className="mx-auto text-blue-200" />
                  <p className="mt-3 text-sm font-semibold text-blue-900">
                    Aucun exercice trouvé dans cette catégorie
                  </p>
                </div>
              ) : (
                exercicesAffiches.map((exercice) => (
                  <div key={exercice.id} className="space-y-4 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700">
                            {libelleCategorie(exercice.category)}
                          </span>
                          <Badge variant={classeDifficulte(exercice.difficulty)}>
                            {exercice.difficulty}
                          </Badge>
                        </div>
                        <h2 className="mt-2 text-base font-semibold text-blue-950">
                          {exercice.title}
                        </h2>
                      </div>
                    </div>

                    <div className="rounded-xl bg-blue-50/60 p-3">
                      <pre className="max-h-24 overflow-hidden whitespace-pre-wrap font-mono text-xs leading-5 text-blue-900">
                        {exercice.buggyCode}
                      </pre>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => ouvrirEdition(exercice)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-medium text-blue-700 transition hover:bg-blue-50"
                      >
                        <Pencil size={14} />
                        Modifier
                      </button>

                      <button
                        type="button"
                        onClick={() => void supprimer(exercice)}
                        disabled={enSuppression === exercice.id}
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* VUE DESKTOP */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-225">
                <thead className="border-b border-blue-100 bg-blue-50/60">
                  <tr className="text-left">
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-blue-500">
                      Exercice
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-blue-500">
                      Catégorie
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-blue-500">
                      Difficulté
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-blue-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100">
                  {exercicesAffiches.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-14 text-center">
                        <BookOpen size={32} className="mx-auto text-blue-200" />
                        <p className="mt-3 text-sm font-semibold text-blue-900">
                          Aucun exercice trouvé dans cette catégorie
                        </p>
                      </td>
                    </tr>
                  ) : (
                    exercicesAffiches.map((exercice) => (
                      <tr key={exercice.id} className="transition hover:bg-blue-50/50">
                        <td className="max-w-md px-5 py-4">
                          <h2 className="font-semibold text-blue-950">
                            {exercice.title}
                          </h2>
                          <pre className="mt-1 max-h-16 max-w-md overflow-hidden whitespace-pre-wrap font-mono text-[11px] leading-5 text-blue-600/70">
                            {exercice.buggyCode}
                          </pre>
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                            {libelleCategorie(exercice.category)}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <Badge variant={classeDifficulte(exercice.difficulty)}>
                            {exercice.difficulty}
                          </Badge>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => ouvrirEdition(exercice)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-50"
                            >
                              <Pencil size={12} />
                              Modifier
                            </button>

                            <button
                              type="button"
                              onClick={() => void supprimer(exercice)}
                              disabled={enSuppression === exercice.id}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Trash2 size={12} />
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Bouton pour afficher plus d'exercices si limité sur "Tous" */}
          {estLimite && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setAfficherTout(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50"
              >
                <ChevronDown size={16} />
                Voir tous les exercices ({exercicesFiltres.length})
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODALE CRÉATION / ÉDITION */}
      {modaleOuverte && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/40 p-4"
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-blue-100 px-6 py-4">
              <h2 className="text-lg font-semibold text-blue-950">
                {exerciceEdite ? "Modifier l'exercice" : "Ajouter un exercice"}
              </h2>

              <button
                type="button"
                onClick={fermerModale}
                className="rounded-lg p-2 text-blue-400 transition hover:bg-blue-50 hover:text-blue-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 px-6 py-5">
              <div>
                <label className="text-sm font-medium text-blue-900">Titre</label>
                <input
                  type="text"
                  value={formulaire.title}
                  onChange={(e) =>
                    setFormulaire((f) => ({ ...f, title: e.target.value }))
                  }
                  className="mt-2 h-11 w-full rounded-xl border border-blue-200 bg-white px-3 text-sm text-blue-950 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-blue-900">Catégorie</label>
                  <select
                    value={formulaire.category}
                    onChange={(e) =>
                      setFormulaire((f) => ({
                        ...f,
                        category: e.target.value as DonneesExerciceFormulaire["category"],
                      }))
                    }
                    className="mt-2 h-11 w-full rounded-xl border border-blue-200 bg-white px-3 text-sm text-blue-950 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.valeur} value={c.valeur}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-blue-900">Difficulté</label>
                  <select
                    value={formulaire.difficulty}
                    onChange={(e) =>
                      setFormulaire((f) => ({
                        ...f,
                        difficulty: e.target.value as DonneesExerciceFormulaire["difficulty"],
                      }))
                    }
                    className="mt-2 h-11 w-full rounded-xl border border-blue-200 bg-white px-3 text-sm text-blue-950 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                  >
                    {DIFFICULTES.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-blue-900">Code buggé</label>
                <textarea
                  value={formulaire.buggyCode}
                  onChange={(e) =>
                    setFormulaire((f) => ({ ...f, buggyCode: e.target.value }))
                  }
                  rows={6}
                  className="mt-2 w-full resize-y rounded-xl border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs leading-5 text-zinc-100 outline-none focus:border-zinc-700 focus:ring-4 focus:ring-zinc-900/10"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {(["hint1", "hint2", "hint3"] as const).map((champ, i) => (
                  <div key={champ}>
                    <label className="text-sm font-medium text-blue-900">
                      Indice {i + 1}
                    </label>
                    <textarea
                      value={formulaire[champ]}
                      onChange={(e) =>
                        setFormulaire((f) => ({ ...f, [champ]: e.target.value }))
                      }
                      rows={3}
                      className="mt-2 w-full resize-y rounded-xl border border-blue-200 bg-white p-3 text-xs leading-5 text-blue-950 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="text-sm font-medium text-blue-900">Solution</label>
                <textarea
                  value={formulaire.solution}
                  onChange={(e) =>
                    setFormulaire((f) => ({ ...f, solution: e.target.value }))
                  }
                  rows={4}
                  className="mt-2 w-full resize-y rounded-xl border border-blue-200 bg-white p-3 text-sm text-blue-950 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-blue-900">
                  Mots-clés (séparés par des virgules)
                </label>
                <input
                  type="text"
                  value={motsClesTexte}
                  onChange={(e) => setMotsClesTexte(e.target.value)}
                  placeholder="ex: const, undefined, return"
                  className="mt-2 h-11 w-full rounded-xl border border-blue-200 bg-white px-3 text-sm text-blue-950 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                />
                <p className="mt-1.5 text-xs text-blue-500">
                  Si vide, la réponse sera comparée directement à la solution.
                </p>
              </div>

              {erreurFormulaire && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3">
                  <p className="text-sm text-red-700">{erreurFormulaire}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-blue-100 px-6 py-4">
              <button
                type="button"
                onClick={fermerModale}
                disabled={enregistrement}
                className="rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-medium text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={() => void soumettreFormulaire()}
                disabled={enregistrement}
                className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:from-blue-700 hover:to-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {enregistrement ? <Loader2 size={16} className="animate-spin" /> : null}
                {exerciceEdite ? "Enregistrer" : "Créer l'exercice"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}