import { useCallback, useEffect, useState, useMemo } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Mail,
  MessageSquare,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  Trash2,
  UserMinus,
  UserPlus,
  UserRound,
  X,
  XCircle,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

import {
  obtenirUtilisateursAdmin,
  supprimerUtilisateurAdmin,
  modifierRoleUtilisateurAdmin,
} from "../../services/admin.service";

import type { UtilisateurAdmin } from "../../types/admin";

export default function UtilisateursAdminPage() {
  const [utilisateurs, setUtilisateurs] = useState<UtilisateurAdmin[]>([]);

  const [page, setPage] = useState(1);
  const [limite] = useState(10);

  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);

  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  const [actionEnCours, setActionEnCours] = useState<string | null>(null);
  const [modaleConfirmation, setModaleConfirmation] = useState<{
    type: "supprimer" | "role";
    utilisateurId: string;
    utilisateurEmail: string;
    nouveauRole?: "USER" | "ADMIN";
  } | null>(null);

  const [recherche, setRecherche] = useState("");
  const [filtreRole, setFiltreRole] = useState<"TOUS" | "USER" | "ADMIN">("TOUS");
  const [filtreVerification, setFiltreVerification] = useState<"TOUS" | "VERIFIE" | "NON_VERIFIE">("TOUS");

  const utilisateursFiltres = useMemo(() => {
    return utilisateurs.filter((utilisateur) => {
      const correspondRecherche =
        recherche === "" ||
        utilisateur.displayName?.toLowerCase().includes(recherche.toLowerCase()) ||
        utilisateur.email.toLowerCase().includes(recherche.toLowerCase());

      const correspondRole =
        filtreRole === "TOUS" || utilisateur.role === filtreRole;

      const correspondVerification =
        filtreVerification === "TOUS" ||
        (filtreVerification === "VERIFIE" && utilisateur.emailVerified) ||
        (filtreVerification === "NON_VERIFIE" && !utilisateur.emailVerified);

      return correspondRecherche && correspondRole && correspondVerification;
    });
  }, [utilisateurs, recherche, filtreRole, filtreVerification]);

  const filtresActifs = useMemo(() => {
    return recherche !== "" || filtreRole !== "TOUS" || filtreVerification !== "TOUS";
  }, [recherche, filtreRole, filtreVerification]);

  const reinitialiserFiltres = () => {
    setRecherche("");
    setFiltreRole("TOUS");
    setFiltreVerification("TOUS");
  };

  const chargerUtilisateurs = useCallback(
    async (pageDemandee: number) => {
      try {
        setChargement(true);
        setErreur("");

        const resultat = await obtenirUtilisateursAdmin(pageDemandee, limite);

        setUtilisateurs(resultat.utilisateurs);
        setPage(resultat.pagination.page);
        setTotal(resultat.pagination.total);
        setPages(resultat.pagination.pages);
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs :", error);
        setErreur("Impossible de récupérer les utilisateurs.");
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
      await chargerUtilisateurs(page);
    }
  };

  void ExecuterChargement();

  return () => {
    estMonte = false;
  };
}, [chargerUtilisateurs, page]);

  function pagePrecedente() {
    if (page > 1) setPage((p) => p - 1);
  }

  function pageSuivante() {
    if (page < pages) setPage((p) => p + 1);
  }

  async function confirmerAction() {
    if (!modaleConfirmation) return;

    const { type, utilisateurId, nouveauRole } = modaleConfirmation;

    try {
      setActionEnCours(utilisateurId);
      setErreur("");

      if (type === "supprimer") {
        await supprimerUtilisateurAdmin(utilisateurId);
      } else if (type === "role" && nouveauRole) {
        await modifierRoleUtilisateurAdmin(utilisateurId, nouveauRole);
      }

      setModaleConfirmation(null);
      await chargerUtilisateurs(page);
    } catch (error) {
      console.error("Erreur action utilisateur:", error);
      setErreur("Impossible d'effectuer cette action.");
    } finally {
      setActionEnCours(null);
    }
  }

  function annulerAction() {
    setModaleConfirmation(null);
  }

  function formaterDate(date: string) {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  }

  return (
    <>
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
                Utilisateurs
              </h1>
              <Badge>
                {utilisateursFiltres.length} utilisateur{utilisateursFiltres.length > 1 ? "s" : ""}
              </Badge>
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
              Consultez les comptes, les rôles et l'activité de la communauté CodeDoctor.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => chargerUtilisateurs(page)}
              disabled={chargement}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw size={16} className={chargement ? "animate-spin" : ""} />
              Actualiser
            </button>
          </div>
        </div>

        <Card className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Rechercher par nom ou email..."
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                className="w-full rounded-lg border border-blue-200 bg-white pl-10 pr-4 py-2.5 text-sm text-blue-900 placeholder:text-blue-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <select
              value={filtreRole}
              onChange={(e) => setFiltreRole(e.target.value as "TOUS" | "USER" | "ADMIN")}
              className="rounded-lg border border-blue-200 bg-white px-4 py-2.5 text-sm text-blue-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="TOUS">Tous les rôles</option>
              <option value="USER">Utilisateurs</option>
              <option value="ADMIN">Administrateurs</option>
            </select>

            <select
              value={filtreVerification}
              onChange={(e) => setFiltreVerification(e.target.value as "TOUS" | "VERIFIE" | "NON_VERIFIE")}
              className="rounded-lg border border-blue-200 bg-white px-4 py-2.5 text-sm text-blue-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="TOUS">Tous les statuts</option>
              <option value="VERIFIE">Vérifiés</option>
              <option value="NON_VERIFIE">Non vérifiés</option>
            </select>

            {filtresActifs && (
              <button
                type="button"
                onClick={reinitialiserFiltres}
                className="flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2.5 text-sm font-medium text-blue-700 transition hover:bg-blue-50"
              >
                <X size={16} />
                Réinitialiser
              </button>
            )}
          </div>
        </Card>

        {erreur && (
          <Card className="p-6">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-red-50 p-2 text-red-600">
                <AlertCircle size={20} />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-zinc-900">Impossible de charger les utilisateurs</h2>
                <p className="mt-1 text-sm text-zinc-500">{erreur}</p>
                <button
                  type="button"
                  onClick={() => chargerUtilisateurs(page)}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-zinc-800"
                >
                  <RefreshCw size={14} />
                  Réessayer
                </button>
              </div>
            </div>
          </Card>
        )}

        {chargement && utilisateurs.length === 0 ? (
          <Card className="p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <Loader2 size={28} className="animate-spin text-zinc-400" />
              <p className="mt-4 text-sm font-medium text-zinc-700">Chargement des utilisateurs...</p>
              <p className="mt-1 text-xs text-zinc-400">Récupération des données depuis le serveur.</p>
            </div>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            {/* VERSION MOBILE */}
            <div className="divide-y divide-zinc-100 md:hidden">
              {utilisateursFiltres.length === 0 ? (
                <div className="p-10 text-center">
                  <UserRound size={32} className="mx-auto text-zinc-300" />
                  <p className="mt-3 text-sm font-medium text-zinc-700">
                    {utilisateurs.length === 0 ? "Aucun utilisateur" : "Aucun résultat"}
                  </p>
                </div>
              ) : (
                utilisateursFiltres.map((utilisateur) => (
                  <div key={utilisateur.id} className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-600">
                          <UserRound size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-zinc-900">
                            {utilisateur.displayName || "Utilisateur sans nom"}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-zinc-500">{utilisateur.email}</p>
                        </div>
                      </div>
                      {utilisateur.role === "ADMIN" ? (
                        <Badge variant="warning">Admin</Badge>
                      ) : (
                        <Badge>User</Badge>
                      )}
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-2">
                      <div className="rounded-xl bg-zinc-50 p-3">
                        <p className="text-[11px] text-zinc-400">Expériences</p>
                        <p className="mt-1 text-sm font-semibold text-zinc-900">{utilisateur._count.experiences}</p>
                      </div>
                      <div className="rounded-xl bg-zinc-50 p-3">
                        <p className="text-[11px] text-zinc-400">Commentaires</p>
                        <p className="mt-1 text-sm font-semibold text-zinc-900">{utilisateur._count.comments}</p>
                      </div>
                      <div className="rounded-xl bg-zinc-50 p-3">
                        <p className="text-[11px] text-zinc-400">Signalements</p>
                        <p className="mt-1 text-sm font-semibold text-zinc-900">{utilisateur._count.reports}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-zinc-100 pt-4">
                      <div className="flex items-center gap-2">
                        {utilisateur.emailVerified ? (
                          <>
                            <CheckCircle2 size={15} className="text-emerald-600" />
                            <span className="text-xs text-emerald-700">Email vérifié</span>
                          </>
                        ) : (
                          <>
                            <XCircle size={15} className="text-zinc-400" />
                            <span className="text-xs text-zinc-500">Email non vérifié</span>
                          </>
                        )}
                      </div>
                      <span className="text-xs text-zinc-400">{formaterDate(utilisateur.createdAt)}</span>
                    </div>

                    <div className="mt-4 flex items-center gap-2 border-t border-zinc-100 pt-4">
                      <button
                        type="button"
                        onClick={() =>
                          setModaleConfirmation({
                            type: "role",
                            utilisateurId: utilisateur.id,
                            utilisateurEmail: utilisateur.email,
                            nouveauRole: utilisateur.role === "ADMIN" ? "USER" : "ADMIN",
                          })
                        }
                        disabled={actionEnCours === utilisateur.id}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {utilisateur.role === "ADMIN" ? <UserMinus size={14} /> : <UserPlus size={14} />}
                        {utilisateur.role === "ADMIN" ? "Rétrograder" : "Promouvoir"}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setModaleConfirmation({
                            type: "supprimer",
                            utilisateurId: utilisateur.id,
                            utilisateurEmail: utilisateur.email,
                          })
                        }
                        disabled={actionEnCours === utilisateur.id}
                        className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-white p-2 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                        title="Supprimer l'utilisateur"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* VERSION DESKTOP */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-900px">
                <thead className="border-b border-zinc-100 bg-zinc-50/70">
                  <tr className="text-left">
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">Utilisateur</th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">Rôle</th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">Vérification</th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">Activité</th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">Signalements</th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">Inscription</th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {utilisateursFiltres.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-14 text-center">
                        <UserRound size={32} className="mx-auto text-zinc-300" />
                        <p className="mt-3 text-sm font-medium text-zinc-700">
                          {utilisateurs.length === 0 ? "Aucun utilisateur" : "Aucun résultat"}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    utilisateursFiltres.map((utilisateur) => (
                      <tr key={utilisateur.id} className="transition hover:bg-zinc-50/70">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-600">
                              <UserRound size={17} />
                            </div>
                            <div className="min-w-0">
                              <p className="max-w-220px truncate text-sm font-semibold text-zinc-900">
                                {utilisateur.displayName || "Utilisateur sans nom"}
                              </p>
                              <div className="mt-1 flex items-center gap-1.5">
                                <Mail size={13} className="shrink-0 text-zinc-400" />
                                <p className="max-w-220px truncate text-xs text-zinc-500">{utilisateur.email}</p>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          {utilisateur.role === "ADMIN" ? (
                            <Badge variant="warning">
                              <span className="inline-flex items-center gap-1.5">
                                <Shield size={12} />
                                Administrateur
                              </span>
                            </Badge>
                          ) : (
                            <Badge>Utilisateur</Badge>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          {utilisateur.emailVerified ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                              <CheckCircle2 size={15} />
                              Vérifié
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500">
                              <XCircle size={15} />
                              Non vérifié
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1 rounded-lg bg-zinc-100 px-2 py-1 text-xs text-zinc-600">
                              <UserRound size={12} />
                              {utilisateur._count.experiences}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-lg bg-zinc-100 px-2 py-1 text-xs text-zinc-600">
                              <MessageSquare size={12} />
                              {utilisateur._count.comments}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          {utilisateur._count.reports > 0 ? (
                            <Badge variant="danger">{utilisateur._count.reports}</Badge>
                          ) : (
                            <span className="text-xs text-zinc-400">Aucun</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-xs text-zinc-500">{formaterDate(utilisateur.createdAt)}</span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setModaleConfirmation({
                                  type: "role",
                                  utilisateurId: utilisateur.id,
                                  utilisateurEmail: utilisateur.email,
                                  nouveauRole: utilisateur.role === "ADMIN" ? "USER" : "ADMIN",
                                })
                              }
                              disabled={actionEnCours === utilisateur.id}
                              className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white p-2 text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-40"
                              title={utilisateur.role === "ADMIN" ? "Rétrograder en utilisateur" : "Promouvoir en administrateur"}
                            >
                              {utilisateur.role === "ADMIN" ? <UserMinus size={16} /> : <UserPlus size={16} />}
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setModaleConfirmation({
                                  type: "supprimer",
                                  utilisateurId: utilisateur.id,
                                  utilisateurEmail: utilisateur.email,
                                })
                              }
                              disabled={actionEnCours === utilisateur.id}
                              className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-white p-2 text-red-600 transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                              title="Supprimer l'utilisateur"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {pages > 0 && (
              <div className="flex flex-col gap-3 border-t border-zinc-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-zinc-500">
                  Page <span className="font-medium text-zinc-700">{page}</span> sur{" "}
                  <span className="font-medium text-zinc-700">{pages}</span>
                  {" · "}
                  {total} utilisateur{total > 1 ? "s" : ""}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={pagePrecedente}
                    disabled={page <= 1 || chargement}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-600 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={15} />
                    Précédent
                  </button>
                  <button
                    type="button"
                    onClick={pageSuivante}
                    disabled={page >= pages || chargement}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-600 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
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

      {modaleConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-zinc-100 p-2.5 text-zinc-600">
                {modaleConfirmation.type === "supprimer" ? <Trash2 size={20} /> : <ShieldAlert size={20} />}
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-zinc-900">
                  {modaleConfirmation.type === "supprimer" ? "Supprimer l'utilisateur" : "Modifier le rôle"}
                </h2>
                <p className="mt-2 text-sm text-zinc-600">
                  {modaleConfirmation.type === "supprimer"
                    ? `Êtes-vous sûr de vouloir supprimer le compte de ${modaleConfirmation.utilisateurEmail} ? Cette action est irréversible.`
                    : `Êtes-vous sûr de vouloir ${modaleConfirmation.nouveauRole === "ADMIN" ? "promouvoir" : "rétrograder"} ${modaleConfirmation.utilisateurEmail} ${modaleConfirmation.nouveauRole === "ADMIN" ? "en administrateur" : "en utilisateur"} ?`}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={annulerAction}
                disabled={actionEnCours !== null}
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={confirmerAction}
                disabled={actionEnCours !== null}
                className={
                  modaleConfirmation.type === "supprimer"
                    ? "inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                    : "inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
                }
              >
                {actionEnCours === modaleConfirmation.utilisateurId ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    En cours...
                  </>
                ) : modaleConfirmation.type === "supprimer" ? (
                  <>
                    <Trash2 size={16} />
                    Supprimer
                  </>
                ) : (
                  <>
                    <ShieldAlert size={16} />
                    Confirmer
                  </>
                )}
              </button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}