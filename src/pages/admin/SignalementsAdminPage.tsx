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
  Clock3,
  Loader2,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRound,
  XCircle,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

import {
  obtenirSignalementsAdmin,
  modifierStatutSignalementAdmin,
} from "../../services/admin.service";

import type {
  SignalementAdmin,
  StatutSignalementAdmin,
} from "../../types/admin";

export default function SignalementsAdminPage() {
  const [signalements, setSignalements] = useState<SignalementAdmin[]>([]);

  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  const [recherche, setRecherche] = useState("");

  const [filtreStatut, setFiltreStatut] =
    useState<StatutSignalementAdmin | "ALL">("ALL");

  const [signalementEnModification, setSignalementEnModification] =
    useState<string | null>(null);

  const chargerSignalements = useCallback(async () => {
    try {
      setChargement(true);
      setErreur("");

      const resultat = await obtenirSignalementsAdmin(
        filtreStatut === "ALL" ? undefined : filtreStatut
      );

      setSignalements(resultat.signalements);
    } catch (error) {
      console.error("Erreur lors du chargement des signalements :", error);
      setErreur("Impossible de récupérer les signalements.");
    } finally {
      setChargement(false);
    }
  }, [filtreStatut]);

useEffect(() => {
  let estMonte = true;

  const ExecuterChargement = async () => {
    if (estMonte) {
      await chargerSignalements();
    }
  };

  void ExecuterChargement();

  return () => {
    estMonte = false;
  };
}, [chargerSignalements]);

  const signalementsFiltres = useMemo(() => {
    const terme = recherche.trim().toLowerCase();

    if (!terme) {
      return signalements;
    }

    return signalements.filter((signalement) => {
      return (
        signalement.raison.toLowerCase().includes(terme) ||
        signalement.description?.toLowerCase().includes(terme) ||
        signalement.user.email.toLowerCase().includes(terme) ||
        signalement.user.displayName?.toLowerCase().includes(terme) ||
        signalement.experience.titre.toLowerCase().includes(terme) ||
        signalement.experience.categorie.toLowerCase().includes(terme)
      );
    });
  }, [signalements, recherche]);

  async function changerStatutSignalement(
    signalement: SignalementAdmin,
    statut: StatutSignalementAdmin
  ) {
    try {
      setSignalementEnModification(signalement.id);
      setErreur("");

      const resultat = await modifierStatutSignalementAdmin(
        signalement.id,
        statut
      );

      setSignalements((anciens) =>
        anciens.map((item) =>
          item.id === signalement.id ? resultat.signalement : item
        )
      );
    } catch (error) {
      console.error("Erreur lors de la modification du signalement :", error);
      setErreur("Impossible de modifier le statut du signalement.");
    } finally {
      setSignalementEnModification(null);
    }
  }

  function formaterDate(date: string) {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  }

  function libelleStatut(statut: StatutSignalementAdmin) {
    switch (statut) {
      case "PENDING":
        return "En attente";
      case "REVIEWED":
        return "Examiné";
      case "RESOLVED":
        return "Résolu";
      case "REJECTED":
        return "Rejeté";
    }
  }

  function BadgeStatut({ statut }: { statut: StatutSignalementAdmin }) {
    if (statut === "PENDING") {
      return (
        <Badge variant="warning">
          <span className="inline-flex items-center gap-1.5">
            <Clock3 size={13} />
            {libelleStatut(statut)}
          </span>
        </Badge>
      );
    }

    if (statut === "REVIEWED") {
      return (
        <Badge>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck size={13} />
            {libelleStatut(statut)}
          </span>
        </Badge>
      );
    }

    if (statut === "RESOLVED") {
      return (
        <Badge variant="success">
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 size={13} />
            {libelleStatut(statut)}
          </span>
        </Badge>
      );
    }

    return (
      <Badge variant="danger">
        <span className="inline-flex items-center gap-1.5">
          <XCircle size={13} />
          {libelleStatut(statut)}
        </span>
      </Badge>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
              Signalements
            </h1>
            <Badge>
              {signalements.length} signalement{signalements.length > 1 ? "s" : ""}
            </Badge>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
            Consultez les signalements envoyés par les utilisateurs et assurez leur modération.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void chargerSignalements()}
          disabled={chargement || signalementEnModification !== null}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw size={16} className={chargement ? "animate-spin" : ""} />
          Actualiser
        </button>
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            <input
              type="search"
              value={recherche}
              onChange={(event) => setRecherche(event.target.value)}
              placeholder="Rechercher un signalement, utilisateur ou expérience..."
              className="h-11 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5"
            />
          </div>

          <select
            value={filtreStatut}
            onChange={(event) =>
              setFiltreStatut(event.target.value as StatutSignalementAdmin | "ALL")
            }
            className="h-11 rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-700 outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5 lg:w-52"
          >
            <option value="ALL">Tous les statuts</option>
            <option value="PENDING">En attente</option>
            <option value="REVIEWED">Examinés</option>
            <option value="RESOLVED">Résolus</option>
            <option value="REJECTED">Rejetés</option>
          </select>
        </div>

        {(recherche || filtreStatut !== "ALL") && (
          <p className="mt-3 text-xs text-zinc-400">
            {signalementsFiltres.length} résultat{signalementsFiltres.length > 1 ? "s" : ""} affiché
            {signalementsFiltres.length > 1 ? "s" : ""}.
          </p>
        )}
      </Card>

      {erreur && (
        <Card className="p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-red-50 p-2 text-red-600">
              <AlertCircle size={20} />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-zinc-900">Une erreur est survenue</h2>
              <p className="mt-1 text-sm text-zinc-500">{erreur}</p>
              <button
                type="button"
                onClick={() => void chargerSignalements()}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-zinc-800"
              >
                <RefreshCw size={14} />
                Réessayer
              </button>
            </div>
          </div>
        </Card>
      )}

      {chargement && signalements.length === 0 ? (
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <Loader2 size={28} className="animate-spin text-zinc-400" />
            <p className="mt-4 text-sm font-medium text-zinc-700">Chargement des signalements...</p>
            <p className="mt-1 text-xs text-zinc-400">Récupération des signalements depuis le serveur.</p>
          </div>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          {/* MOBILE */}
          <div className="divide-y divide-zinc-100 md:hidden">
            {signalementsFiltres.length === 0 ? (
              <div className="p-12 text-center">
                <ShieldCheck size={34} className="mx-auto text-zinc-300" />
                <p className="mt-3 text-sm font-medium text-zinc-700">Aucun signalement trouvé</p>
                <p className="mt-1 text-xs text-zinc-400">
                  Aucun résultat ne correspond aux critères sélectionnés.
                </p>
              </div>
            ) : (
              signalementsFiltres.map((signalement) => {
                const modificationEnCours = signalementEnModification === signalement.id;

                return (
                  <div key={signalement.id} className="space-y-5 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-600">
                          <UserRound size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-zinc-900">
                            {signalement.user.displayName || "Utilisateur sans nom"}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-zinc-500">{signalement.user.email}</p>
                        </div>
                      </div>
                      <BadgeStatut statut={signalement.statut} />
                    </div>

                    <div className="rounded-xl bg-zinc-50 p-4">
                      <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-white p-2 text-zinc-500 shadow-sm">
                          <BookOpen size={17} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-400">
                            Expérience signalée
                          </p>
                          <p className="mt-1 text-sm font-semibold text-zinc-900">
                            {signalement.experience.titre}
                          </p>
                          <p className="mt-1 text-xs text-zinc-500">{signalement.experience.categorie}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Motif</p>
                      <p className="mt-1 text-sm font-medium text-zinc-800">{signalement.raison}</p>
                      {signalement.description && (
                        <p className="mt-2 text-xs leading-5 text-zinc-500">{signalement.description}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 border-t border-zinc-100 pt-4 text-xs text-zinc-400">
                      <Clock3 size={13} />
                      Signalement du {formaterDate(signalement.createdAt)}
                    </div>

                    <div className="border-t border-zinc-100 pt-4">
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                        Modération
                      </p>

                      <div className="grid grid-cols-2 gap-2">
                        {signalement.statut !== "REVIEWED" && (
                          <button
                            type="button"
                            disabled={modificationEnCours}
                            onClick={() => void changerStatutSignalement(signalement, "REVIEWED")}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {modificationEnCours ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <ShieldCheck size={14} />
                            )}
                            Examiner
                          </button>
                        )}

                        {signalement.statut !== "RESOLVED" && (
                          <button
                            type="button"
                            disabled={modificationEnCours}
                            onClick={() => void changerStatutSignalement(signalement, "RESOLVED")}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-3 py-2.5 text-xs font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {modificationEnCours ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <CheckCircle2 size={14} />
                            )}
                            Résoudre
                          </button>
                        )}

                        {signalement.statut !== "REJECTED" && (
                          <button
                            type="button"
                            disabled={modificationEnCours}
                            onClick={() => void changerStatutSignalement(signalement, "REJECTED")}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-3 py-2.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {modificationEnCours ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <XCircle size={14} />
                            )}
                            Rejeter
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* DESKTOP */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-1050px">
              <thead className="border-b border-zinc-100 bg-zinc-50/70">
                <tr className="text-left">
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">Utilisateur</th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">Expérience</th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">Motif</th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">Statut</th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">Date</th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {signalementsFiltres.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-14 text-center">
                      <ShieldCheck size={34} className="mx-auto text-zinc-300" />
                      <p className="mt-3 text-sm font-medium text-zinc-700">Aucun signalement trouvé</p>
                      <p className="mt-1 text-xs text-zinc-400">
                        Aucun résultat ne correspond aux critères sélectionnés.
                      </p>
                    </td>
                  </tr>
                ) : (
                  signalementsFiltres.map((signalement) => {
                    const modificationEnCours = signalementEnModification === signalement.id;

                    return (
                      <tr key={signalement.id} className="transition hover:bg-zinc-50/70">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-600">
                              <UserRound size={16} />
                            </div>
                            <div className="min-w-0">
                              <p className="max-w-180px truncate text-sm font-semibold text-zinc-900">
                                {signalement.user.displayName || "Sans nom"}
                              </p>
                              <p className="mt-1 max-w-200px truncate text-xs text-zinc-500">
                                {signalement.user.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="max-w-240px px-5 py-4">
                          <div className="flex items-start gap-2.5">
                            <BookOpen size={16} className="mt-0.5 shrink-0 text-zinc-400" />
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-zinc-900">
                                {signalement.experience.titre}
                              </p>
                              <p className="mt-1 truncate text-xs text-zinc-400">
                                {signalement.experience.categorie}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="max-w-260px px-5 py-4">
                          <p className="truncate text-sm font-medium text-zinc-800">{signalement.raison}</p>
                          {signalement.description && (
                            <p className="mt-1 max-w-250px truncate text-xs text-zinc-400">
                              {signalement.description}
                            </p>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <BadgeStatut statut={signalement.statut} />
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                            <Clock3 size={13} />
                            {formaterDate(signalement.createdAt)}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex flex-wrap items-center gap-2">
                            {signalement.statut !== "REVIEWED" && (
                              <button
                                type="button"
                                disabled={modificationEnCours}
                                onClick={() => void changerStatutSignalement(signalement, "REVIEWED")}
                                title="Marquer comme examiné"
                                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-2 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {modificationEnCours ? (
                                  <Loader2 size={13} className="animate-spin" />
                                ) : (
                                  <ShieldCheck size={13} />
                                )}
                                Examiner
                              </button>
                            )}

                            {signalement.statut !== "RESOLVED" && (
                              <button
                                type="button"
                                disabled={modificationEnCours}
                                onClick={() => void changerStatutSignalement(signalement, "RESOLVED")}
                                title="Résoudre le signalement"
                                className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-2.5 py-2 text-xs font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {modificationEnCours ? (
                                  <Loader2 size={13} className="animate-spin" />
                                ) : (
                                  <CheckCircle2 size={13} />
                                )}
                                Résoudre
                              </button>
                            )}

                            {signalement.statut !== "REJECTED" && (
                              <button
                                type="button"
                                disabled={modificationEnCours}
                                onClick={() => void changerStatutSignalement(signalement, "REJECTED")}
                                title="Rejeter le signalement"
                                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-2.5 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {modificationEnCours ? (
                                  <Loader2 size={13} className="animate-spin" />
                                ) : (
                                  <XCircle size={13} />
                                )}
                                Rejeter
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}