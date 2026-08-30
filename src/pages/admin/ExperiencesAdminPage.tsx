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
  Eye,
  EyeOff,
  Loader2,
  MessageSquare,
  RefreshCw,
  ShieldAlert,
  Trash2,
  UserRound,
  XCircle,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

import {
  modifierStatutExperienceAdmin,
  obtenirExperiencesAdmin,
  supprimerExperienceAdmin,
} from "../../services/admin.service";

import type {
  ExperienceAdmin,
  StatutExperienceAdmin,
} from "../../types/admin";

export default function ExperiencesAdminPage() {
  const [experiences, setExperiences] = useState<ExperienceAdmin[]>([]);

  const [page, setPage] = useState(1);
  const [limite] = useState(10);

  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);

  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  const [experienceEnModification, setExperienceEnModification] =
    useState<string | null>(null);

  const [recherche, setRecherche] = useState("");

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

  const ExecuterChargement = async () => {
    if (estMonte) {
      await chargerExperiences(page);
    }
  };

  void ExecuterChargement();

  return () => {
    estMonte = false;
  };
}, [chargerExperiences, page]);

  const experiencesFiltrees = useMemo(() => {
    const terme = recherche.trim().toLowerCase();

    if (!terme) {
      return experiences;
    }

    return experiences.filter((experience) => {
      return (
        experience.titre.toLowerCase().includes(terme) ||
        experience.probleme.toLowerCase().includes(terme) ||
        experience.categorie.toLowerCase().includes(terme) ||
        experience.user.email.toLowerCase().includes(terme) ||
        (experience.user.displayName ?? "").toLowerCase().includes(terme)
      );
    });
  }, [experiences, recherche]);

  async function changerStatut(
    experience: ExperienceAdmin,
    statut: StatutExperienceAdmin
  ) {
    if (experience.statut === statut) {
      return;
    }

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
      setErreur("Impossible de modifier le statut de l'expérience.");
    } finally {
      setExperienceEnModification(null);
    }
  }

  async function supprimerExperience(experience: ExperienceAdmin) {
    const confirmer = window.confirm(
      `Voulez-vous vraiment supprimer définitivement "${experience.titre}" ? Cette action est irréversible et supprimera aussi ses commentaires, réactions et signalements.`
    );

    if (!confirmer) {
      return;
    }

    try {
      setExperienceEnModification(experience.id);
      setErreur("");

      await supprimerExperienceAdmin(experience.id);

      setExperiences((anciennes) =>
        anciennes.filter((ancienne) => ancienne.id !== experience.id)
      );
      setTotal((ancien) => ancien - 1);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'expérience :", error);
      setErreur("Impossible de supprimer cette expérience.");
    } finally {
      setExperienceEnModification(null);
    }
  }

  function pagePrecedente() {
    if (page > 1) setPage((p) => p - 1);
  }

  function pageSuivante() {
    if (page < pages) setPage((p) => p + 1);
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
    if (statut === "PUBLISHED") {
      return (
        <Badge variant="success">
          <span className="inline-flex items-center gap-1.5">
            <StatutIcon statut={statut} />
            {libelleStatut(statut)}
          </span>
        </Badge>
      );
    }

    if (statut === "HIDDEN") {
      return (
        <Badge variant="warning">
          <span className="inline-flex items-center gap-1.5">
            <StatutIcon statut={statut} />
            {libelleStatut(statut)}
          </span>
        </Badge>
      );
    }

    return (
      <Badge variant="danger">
        <span className="inline-flex items-center gap-1.5">
          <StatutIcon statut={statut} />
          {libelleStatut(statut)}
        </span>
      </Badge>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* EN-TÊTE */}
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
            Gérez les expériences publiées par la communauté et contrôlez leur visibilité.
          </p>
        </div>

        <button
          type="button"
          onClick={() => chargerExperiences(page)}
          disabled={chargement || experienceEnModification !== null}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw size={16} className={chargement ? "animate-spin" : ""} />
          Actualiser
        </button>
      </div>

      {/* RECHERCHE */}
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
                placeholder="Rechercher une expérience, un auteur ou une catégorie..."
                className="h-11 w-full rounded-xl border border-blue-200 bg-white px-4 text-sm text-blue-950 outline-none transition placeholder:text-blue-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
              />
            </div>
          </div>

          {recherche && (
            <button
              type="button"
              onClick={() => setRecherche("")}
              className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-blue-600 transition hover:bg-blue-100 hover:text-blue-800"
            >
              <XCircle size={14} />
              Effacer
            </button>
          )}
        </div>

        {recherche && (
          <p className="mt-3 text-xs text-blue-600/60">
            {experiencesFiltrees.length} résultat{experiencesFiltrees.length > 1 ? "s" : ""} sur cette page.
          </p>
        )}
      </Card>

      {/* ERREUR */}
      {erreur && (
        <Card className="border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-red-100 p-2 text-red-600">
              <AlertCircle size={20} />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-red-900">Une erreur est survenue</h2>
              <p className="mt-1 text-sm text-red-700">{erreur}</p>
              <button
                type="button"
                onClick={() => chargerExperiences(page)}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
              >
                <RefreshCw size={14} />
                Réessayer
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* CHARGEMENT */}
      {chargement && experiences.length === 0 ? (
        <Card className="border-blue-100 p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <Loader2 size={28} className="animate-spin text-blue-500" />
            <p className="mt-4 text-sm font-semibold text-blue-900">
              Chargement des expériences...
            </p>
            <p className="mt-1 text-xs text-blue-600/60">
              Récupération des données depuis le serveur.
            </p>
          </div>
        </Card>
      ) : (
        <Card className="overflow-hidden border-blue-100">
          {/* MOBILE */}
          <div className="divide-y divide-blue-100 md:hidden">
            {experiencesFiltrees.length === 0 ? (
              <div className="p-10 text-center">
                <BookOpen size={32} className="mx-auto text-blue-200" />
                <p className="mt-3 text-sm font-semibold text-blue-900">
                  Aucune expérience trouvée
                </p>
                {recherche && (
                  <p className="mt-1 text-xs text-blue-600/60">
                    Essayez une autre recherche.
                  </p>
                )}
              </div>
            ) : (
              experiencesFiltrees.map((experience) => (
                <div key={experience.id} className="space-y-5 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <UserRound size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-blue-950">
                          {experience.user.displayName || "Utilisateur sans nom"}
                        </p>
                        <p className="truncate text-xs text-blue-600/70">
                          {experience.user.email}
                        </p>
                      </div>
                    </div>

                    <BadgeStatut statut={experience.statut} />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700">
                        {experience.categorie}
                      </span>
                      <span className="text-xs text-blue-600/60">
                        {formaterDate(experience.createdAt)}
                      </span>
                    </div>

                    <h2 className="mt-3 text-base font-semibold text-blue-950">
                      {experience.titre}
                    </h2>

                    <p className="mt-2 line-clamp-4 text-sm leading-6 text-blue-700/70">
                      {experience.probleme}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-xl bg-blue-50 p-3">
                      <div className="flex items-center gap-1.5 text-blue-400">
                        <MessageSquare size={13} />
                        <span className="text-[11px]">Commentaires</span>
                      </div>
                      <p className="mt-1 text-sm font-semibold text-blue-950">
                        {experience._count.comments}
                      </p>
                    </div>

                    <div className="rounded-xl bg-blue-50 p-3">
                      <div className="flex items-center gap-1.5 text-blue-400">
                        <Eye size={13} />
                        <span className="text-[11px]">Réactions</span>
                      </div>
                      <p className="mt-1 text-sm font-semibold text-blue-950">
                        {experience._count.reactions}
                      </p>
                    </div>

                    <div className="rounded-xl bg-blue-50 p-3">
                      <div className="flex items-center gap-1.5 text-blue-400">
                        <ShieldAlert size={13} />
                        <span className="text-[11px]">Signalements</span>
                      </div>
                      <p className="mt-1 text-sm font-semibold text-blue-950">
                        {experience._count.reports}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-blue-100 pt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-500">
                      Modération
                    </p>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        {experience.moderator ? (
                          <>
                            <p className="truncate text-xs font-medium text-blue-800">
                              {experience.moderator.displayName || experience.moderator.email}
                            </p>
                            {experience.moderatedAt && (
                              <p className="mt-0.5 text-[11px] text-blue-500">
                                Modifiée le {formaterDate(experience.moderatedAt)}
                              </p>
                            )}
                          </>
                        ) : (
                          <p className="text-xs text-blue-500">Pas encore modérée</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={experience.statut}
                          disabled={experienceEnModification === experience.id}
                          onChange={(event) =>
                            void changerStatut(
                              experience,
                              event.target.value as StatutExperienceAdmin
                            )
                          }
                          className="max-w-170px rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-medium text-blue-700 outline-none focus:border-blue-600 disabled:opacity-50"
                        >
                          <option value="PUBLISHED">Publiée</option>
                          <option value="HIDDEN">Masquée</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => void supprimerExperience(experience)}
                          disabled={experienceEnModification === experience.id}
                          className="rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 transition hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                          title="Supprimer définitivement"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* DESKTOP */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-1150px">
              <thead className="border-b border-blue-100 bg-blue-50/60">
                <tr className="text-left">
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-blue-500">Expérience</th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-blue-500">Auteur</th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-blue-500">Statut</th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-blue-500">Activité</th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-blue-500">Modération</th>
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
                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-blue-600/70">
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
                            <p className="max-w-180px truncate text-xs font-medium text-blue-800">
                              {experience.user.displayName || "Sans nom"}
                            </p>
                            <p className="max-w-180px truncate text-[11px] text-blue-500">
                              {experience.user.email}
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
                            {experience._count.comments}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-1 text-xs text-blue-700">
                            👍{experience._count.reactions}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-1 text-xs text-blue-700">
                            <ShieldAlert size={12} />
                            {experience._count.reports}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <select
                          value={experience.statut}
                          disabled={experienceEnModification === experience.id}
                          onChange={(event) =>
                            void changerStatut(
                              experience,
                              event.target.value as StatutExperienceAdmin
                            )
                          }
                          className="rounded-lg border border-blue-200 bg-white px-2.5 py-2 text-xs font-medium text-blue-700 outline-none focus:border-blue-600 disabled:opacity-50"
                        >
                          <option value="PUBLISHED">Publiée</option>
                          <option value="HIDDEN">Masquée</option>
                        </select>

                        <div className="mt-2">
                          <button
                            type="button"
                            onClick={() => void supprimerExperience(experience)}
                            disabled={experienceEnModification === experience.id}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2 py-1.5 text-xs font-medium text-red-600 transition hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                            title="Supprimer définitivement"
                          >
                            <Trash2 size={12} />
                            Supprimer
                          </button>
                        </div>

                        {experience.moderator && (
                          <p className="mt-1.5 max-w-180px truncate text-[10px] text-blue-500">
                            Par {experience.moderator.displayName || experience.moderator.email}
                          </p>
                        )}
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
                {" · "}
                {total} expérience{total > 1 ? "s" : ""}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={pagePrecedente}
                  disabled={page <= 1 || chargement}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-medium text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={15} />
                  Précédent
                </button>
                <button
                  type="button"
                  onClick={pageSuivante}
                  disabled={page >= pages || chargement}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-medium text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Suivant
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}