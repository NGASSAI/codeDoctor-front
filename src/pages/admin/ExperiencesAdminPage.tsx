import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  EyeOff,
  Loader2,
  MessageSquare,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  UserRound,
  X,
  XCircle,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

import {
  creerExperienceAdmin,
  modifierExperienceAdmin,
  modifierStatutExperienceAdmin,
  obtenirExperiencesAdmin,
  supprimerExperienceAdmin,
} from "../../services/admin.service";

import type {
  ExperienceAdmin,
  StatutExperienceAdmin,
} from "../../types/admin";

interface FormulaireExperience {
  titre: string;
  categorie: string;
  probleme: string;
  cause: string;
  solution: string;
}

const FORMULAIRE_VIDE: FormulaireExperience = {
  titre: "",
  categorie: "JAVASCRIPT",
  probleme: "",
  cause: "",
  solution: "",
};

const CATEGORIES = [
  { valeur: "JAVASCRIPT", label: "JavaScript" },
  { valeur: "TYPESCRIPT", label: "TypeScript" },
  { valeur: "REACT", label: "React" },
  { valeur: "HTTP", label: "HTTP" },
  { valeur: "API", label: "API" },
  { valeur: "HTML_CSS", label: "HTML / CSS" },
];

export default function ExperiencesAdminPage() {
  const [experiences, setExperiences] = useState<ExperienceAdmin[]>([]);
  const [page, setPage] = useState(1);
  const [limite] = useState(10);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);

  const [chargement, setChargement] = useState(true);
  const [actionEnCours, setActionEnCours] = useState(false);
  const [erreur, setErreur] = useState("");

  const [experienceEnModification, setExperienceEnModification] = useState<string | null>(null);
  const [recherche, setRecherche] = useState("");

  // Modales
  const [modalAjoutOuverte, setModalAjoutOuverte] = useState(false);
  const [experienceEditee, setExperienceEditee] = useState<ExperienceAdmin | null>(null);
  const [formulaire, setFormulaire] = useState<FormulaireExperience>(FORMULAIRE_VIDE);

  const chargerExperiences = useCallback(
    async (pageDemandee: number) => {
      try {
        setChargement(true);
        setErreur("");

        const resultat = await obtenirExperiencesAdmin(pageDemandee, limite);

        setExperiences(resultat.experiences);
        setPage(resultat.pagination.page);
        setTotal(resultat.pagination.total);
        setPages(resultat.pagination.pages);
      } catch (error) {
        console.error("Erreur lors du chargement des expériences :", error);
        setErreur("Impossible de récupérer les expériences.");
      } finally {
        setChargement(false);
      }
    },
    [limite]
  );

  useEffect(() => {
    let estMonte = true;

    const executerChargement = async () => {
      if (estMonte) {
        await chargerExperiences(page);
      }
    };

    void executerChargement();

    return () => {
      estMonte = false;
    };
  }, [chargerExperiences, page]);

  const experiencesFiltrees = useMemo(() => {
    const terme = recherche.trim().toLowerCase();

    if (!terme) return experiences;

    return experiences.filter((experience) => {
      return (
        experience.titre.toLowerCase().includes(terme) ||
        experience.probleme.toLowerCase().includes(terme) ||
        experience.categorie.toLowerCase().includes(terme) ||
        experience.user?.email.toLowerCase().includes(terme) ||
        (experience.user?.displayName ?? "").toLowerCase().includes(terme)
      );
    });
  }, [experiences, recherche]);

  // --- ACTIONS CRUD ---

  async function gererSoumissionAjout(e: React.FormEvent) {
    e.preventDefault();
    if (
      !formulaire.titre ||
      !formulaire.categorie ||
      !formulaire.probleme ||
      !formulaire.cause ||
      !formulaire.solution
    ) {
      setErreur(
        "Veuillez remplir tous les champs obligatoires (Titre, Catégorie, Problème, Cause, Solution)."
      );
      return;
    }

    try {
      setActionEnCours(true);
      setErreur("");

      const nouvelleExp = await creerExperienceAdmin(formulaire);

      setExperiences((anciennes) => [nouvelleExp, ...anciennes]);
      setTotal((ancien) => ancien + 1);
      setModalAjoutOuverte(false);
      setFormulaire(FORMULAIRE_VIDE);
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'expérience :", error);
      setErreur("Impossible de créer l'expérience.");
    } finally {
      setActionEnCours(false);
    }
  }

  function ouvrirEdition(exp: ExperienceAdmin) {
    setExperienceEditee(exp);
    setFormulaire({
      titre: exp.titre,
      categorie: exp.categorie,
      probleme: exp.probleme,
      cause: exp.cause || "",
      solution: exp.solution || "",
    });
  }

  async function gererSoumissionModification(e: React.FormEvent) {
    e.preventDefault();
    if (!experienceEditee) return;

    try {
      setActionEnCours(true);
      setErreur("");

      const expMiseAJour = await modifierExperienceAdmin(
        experienceEditee.id,
        formulaire
      );

      setExperiences((anciennes) =>
        anciennes.map((item) =>
          item.id === experienceEditee.id ? expMiseAJour : item
        )
      );

      setExperienceEditee(null);
      setFormulaire(FORMULAIRE_VIDE);
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      setErreur("Impossible de mettre à jour l'expérience.");
    } finally {
      setActionEnCours(false);
    }
  }

  async function changerStatut(
    experience: ExperienceAdmin,
    statut: StatutExperienceAdmin
  ) {
    if (experience.statut === statut) return;

    try {
      setExperienceEnModification(experience.id);
      setErreur("");

      const resultat = await modifierStatutExperienceAdmin(
        experience.id,
        statut
      );

      setExperiences((anciennes) =>
        anciennes.map((ancienne) =>
          ancienne.id === experience.id ? resultat.experience : ancienne
        )
      );
    } catch (error) {
      console.error("Erreur lors de la modification du statut :", error);
      setErreur("Impossible de modifier le statut.");
    } finally {
      setExperienceEnModification(null);
    }
  }

  async function supprimerExperience(experience: ExperienceAdmin) {
    const confirmer = window.confirm(
      `Voulez-vous vraiment supprimer définitivement "${experience.titre}" ? Cette action est irréversible.`
    );

    if (!confirmer) return;

    try {
      setExperienceEnModification(experience.id);
      setErreur("");

      await supprimerExperienceAdmin(experience.id);

      setExperiences((anciennes) =>
        anciennes.filter((ancienne) => ancienne.id !== experience.id)
      );
      setTotal((ancien) => Math.max(0, ancien - 1));

      if (experienceEditee?.id === experience.id) {
        setExperienceEditee(null);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      setErreur("Impossible de supprimer cette expérience.");
    } finally {
      setExperienceEnModification(null);
    }
  }

  function formaterDate(date: string) {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  }

  function libelleStatut(statut: StatutExperienceAdmin) {
    switch (statut) {
      case "PUBLISHED":
        return "Publiée";
      case "HIDDEN":
        return "Masquée";
      case "DELETED":
        return "Supprimée";
    }
  }

  function StatutIcon({ statut }: { statut: StatutExperienceAdmin }) {
    if (statut === "PUBLISHED") return <CheckCircle2 size={13} />;
    if (statut === "HIDDEN") return <EyeOff size={13} />;
    return <Trash2 size={13} />;
  }

  function BadgeStatut({ statut }: { statut: StatutExperienceAdmin }) {
    const variantMap = {
      PUBLISHED: "success",
      HIDDEN: "warning",
      DELETED: "danger",
    } as const;

    return (
      <Badge variant={variantMap[statut]}>
        <span className="inline-flex items-center gap-1.5">
          <StatutIcon statut={statut} />
          {libelleStatut(statut)}
        </span>
      </Badge>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* EN-TÊTE ET ACTIONS GLOBALES */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-blue-950 sm:text-3xl">
              Expériences
            </h1>
            <Badge>
              {total} expérience{total > 1 ? "s" : ""}
            </Badge>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-700/70">
            Gérez la base des expériences de la communauté (ajout, édition, masquage et suppression).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setFormulaire(FORMULAIRE_VIDE);
              setModalAjoutOuverte(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus size={16} />
            Ajouter une expérience
          </button>

          <button
            type="button"
            onClick={() => void chargerExperiences(page)}
            disabled={chargement || experienceEnModification !== null}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw size={16} className={chargement ? "animate-spin" : ""} />
            Actualiser
          </button>
        </div>
      </div>

      {/* BARRE DE RECHERCHE */}
      <Card className="border-blue-100 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-500">
              <BookOpen size={18} />
            </div>

            <div className="min-w-0 flex-1">
              <input
                type="search"
                value={recherche}
                onChange={(event) => setRecherche(event.target.value)}
                placeholder="Rechercher par titre, contenu, catégorie ou auteur..."
                className="h-11 w-full rounded-xl border border-blue-200 bg-white px-4 text-sm text-blue-950 outline-none transition placeholder:text-blue-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
              />
            </div>
          </div>

          {recherche && (
            <button
              type="button"
              onClick={() => setRecherche("")}
              className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-blue-600 transition hover:bg-blue-100"
            >
              <XCircle size={14} />
              Effacer
            </button>
          )}
        </div>
      </Card>

      {/* NOTIFICATION D'ERREUR */}
      {erreur && (
        <Card className="border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-red-100 p-2 text-red-600">
              <AlertCircle size={20} />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-red-900">Une erreur est survenue</h2>
              <p className="mt-1 text-sm text-red-700">{erreur}</p>
            </div>
          </div>
        </Card>
      )}

      {/* TABLEAU DES EXPÉRIENCES */}
      {chargement && experiences.length === 0 ? (
        <Card className="border-blue-100 p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <Loader2 size={28} className="animate-spin text-blue-500" />
            <p className="mt-4 text-sm font-semibold text-blue-900">
              Chargement des données...
            </p>
          </div>
        </Card>
      ) : (
        <Card className="overflow-hidden border-blue-100">
          <div className="overflow-x-auto">
            <table className="w-full min-w-700px">
              <thead className="border-b border-blue-100 bg-blue-50/60">
                <tr className="text-left">
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-blue-500">Expérience</th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-blue-500">Auteur</th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-blue-500">Statut</th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-blue-500">Activité</th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-blue-500">Actions</th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-blue-500">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                {experiencesFiltrees.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-14 text-center">
                      <BookOpen size={32} className="mx-auto text-blue-200" />
                      <p className="mt-3 text-sm font-semibold text-blue-900">
                        Aucune expérience trouvée
                      </p>
                    </td>
                  </tr>
                ) : (
                  experiencesFiltrees.map((experience) => (
                    <tr key={experience.id} className="transition hover:bg-blue-50/50">
                      <td className="max-w-md px-5 py-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            <BookOpen size={16} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h2 className="font-semibold text-blue-950">{experience.titre}</h2>
                              <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600">
                                {experience.categorie}
                              </span>
                            </div>
                            <p className="mt-1 line-clamp-2 text-xs text-blue-600/70">
                              {experience.probleme}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-500">
                            <UserRound size={14} />
                          </div>
                          <div className="min-w-0">
                            <p className="max-w-150px truncate text-xs font-medium text-blue-800">
                              {experience.user?.displayName || "Administrateur / Anonyme"}
                            </p>
                            <p className="max-w-150px truncate text-[11px] text-blue-500">
                              {experience.user?.email || "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <BadgeStatut statut={experience.statut} />
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-1 text-xs text-blue-700">
                            <MessageSquare size={12} />
                            {experience._count?.comments ?? 0}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-1 text-xs text-blue-700">
                            👍 {experience._count?.reactions ?? 0}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => ouvrirEdition(experience)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-2.5 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-50"
                          >
                            <Pencil size={12} />
                            Éditer
                          </button>

                          <select
                            value={experience.statut}
                            disabled={experienceEnModification === experience.id}
                            onChange={(event) =>
                              void changerStatut(
                                experience,
                                event.target.value as StatutExperienceAdmin
                              )
                            }
                            className="rounded-lg border border-blue-200 bg-white px-2 py-1.5 text-xs font-medium text-blue-700 outline-none disabled:opacity-50"
                          >
                            <option value="PUBLISHED">Publiée</option>
                            <option value="HIDDEN">Masquée</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => void supprimerExperience(experience)}
                            disabled={experienceEnModification === experience.id}
                            className="rounded-lg border border-red-200 bg-red-50 p-1.5 text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                            title="Supprimer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-blue-600/70">
                          <Clock3 size={13} />
                          {formaterDate(experience.createdAt)}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {pages > 0 && (
            <div className="flex flex-col gap-3 border-t border-blue-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-blue-600/70">
                Page <span className="font-semibold text-blue-900">{page}</span> sur{" "}
                <span className="font-semibold text-blue-900">{pages}</span>
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => page > 1 && setPage((p) => p - 1)}
                  disabled={page <= 1 || chargement}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-medium text-blue-700 transition hover:bg-blue-50 disabled:opacity-40"
                >
                  <ChevronLeft size={15} />
                  Précédent
                </button>
                <button
                  type="button"
                  onClick={() => page < pages && setPage((p) => p + 1)}
                  disabled={page >= pages || chargement}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-medium text-blue-700 transition hover:bg-blue-50 disabled:opacity-40"
                >
                  Suivant
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* MODALE D'AJOUT ET DE MODIFICATION PARTAGÉE OU SEPARÉE PROPREMENT */}
      {(modalAjoutOuverte || experienceEditee) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            <form onSubmit={(e) => void (experienceEditee ? gererSoumissionModification(e) : gererSoumissionAjout(e))}>
              <div className="flex items-center justify-between border-b border-blue-100 px-6 py-4">
                <h2 className="text-lg font-semibold text-blue-950">
                  {experienceEditee ? "Modifier l'expérience" : "Créer une nouvelle expérience"}
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setModalAjoutOuverte(false);
                    setExperienceEditee(null);
                  }}
                  className="rounded-lg p-2 text-blue-400 hover:bg-blue-50 hover:text-blue-700"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 px-6 py-5">
                <div>
                  <label htmlFor="titre" className="text-xs font-semibold uppercase tracking-wider text-blue-500">
                    Titre *
                  </label>
                  <input
                    id="titre"
                    type="text"
                    required
                    value={formulaire.titre}
                    onChange={(e) => setFormulaire((f) => ({ ...f, titre: e.target.value }))}
                    placeholder="Ex: Problème de connexion PostgreSQL avec Docker"
                    className="mt-1 h-10 w-full rounded-xl border border-blue-200 px-3 text-sm outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label htmlFor="categorie" className="text-xs font-semibold uppercase tracking-wider text-blue-500">
                    Catégorie *
                  </label>
                  <select
                    id="categorie"
                    required
                    value={formulaire.categorie}
                    onChange={(e) => setFormulaire((f) => ({ ...f, categorie: e.target.value }))}
                    className="mt-1 h-10 w-full rounded-xl border border-blue-200 px-3 text-sm outline-none focus:border-blue-600"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.valeur} value={cat.valeur}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="probleme" className="text-xs font-semibold uppercase tracking-wider text-blue-500">
                    Description du Problème *
                  </label>
                  <textarea
                    id="probleme"
                    required
                    rows={4}
                    value={formulaire.probleme}
                    onChange={(e) => setFormulaire((f) => ({ ...f, probleme: e.target.value }))}
                    placeholder="Explication détaillée de la difficulté rencontrée..."
                    className="mt-1 w-full rounded-xl border border-blue-200 p-3 text-sm outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label htmlFor="cause" className="text-xs font-semibold uppercase tracking-wider text-blue-500">
                    Cause identifiée *
                  </label>
                  <textarea
                    id="cause"
                    required
                    rows={3}
                    value={formulaire.cause}
                    onChange={(e) => setFormulaire((f) => ({ ...f, cause: e.target.value }))}
                    placeholder="Qu'est-ce qui causait ce problème ?"
                    className="mt-1 w-full rounded-xl border border-blue-200 p-3 text-sm outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label htmlFor="solution" className="text-xs font-semibold uppercase tracking-wider text-blue-500">
                    Solution apportée *
                  </label>
                  <textarea
                    id="solution"
                    required
                    rows={4}
                    value={formulaire.solution}
                    onChange={(e) => setFormulaire((f) => ({ ...f, solution: e.target.value }))}
                    placeholder="La solution ou la démarche pour résoudre le problème..."
                    className="mt-1 w-full rounded-xl border border-blue-200 p-3 text-sm outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-blue-100 px-6 py-4">
                <button
                  type="button"
                  onClick={() => {
                    setModalAjoutOuverte(false);
                    setExperienceEditee(null);
                  }}
                  className="rounded-xl border border-blue-200 px-4 py-2.5 text-xs font-semibold text-blue-700 hover:bg-blue-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={actionEnCours}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {actionEnCours && <Loader2 size={14} className="animate-spin" />}
                  {experienceEditee ? "Enregistrer les modifications" : "Enregistrer l'expérience"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}