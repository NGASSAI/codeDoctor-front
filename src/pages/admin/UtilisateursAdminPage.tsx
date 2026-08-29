
import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Mail,
  MessageSquare,
  RefreshCw,
  Shield,
  UserRound,
  XCircle,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

import {
  obtenirUtilisateursAdmin,
} from "../../services/admin.service";

import type {
  UtilisateurAdmin,
} from "../../types/admin";

export default function UtilisateursAdminPage() {
  const [utilisateurs, setUtilisateurs] = useState<
    UtilisateurAdmin[]
  >([]);

  const [page, setPage] = useState(1);
  const [limite] = useState(10);

  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);

  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  const chargerUtilisateurs = useCallback(
    async (pageDemandee: number) => {
      try {
        setChargement(true);
        setErreur("");

        const resultat =
          await obtenirUtilisateursAdmin(
            pageDemandee,
            limite
          );

        setUtilisateurs(resultat.utilisateurs);

        setPage(resultat.pagination.page);
        setTotal(resultat.pagination.total);
        setPages(resultat.pagination.pages);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des utilisateurs :",
          error
        );

        setErreur(
          "Impossible de récupérer les utilisateurs."
        );
      } finally {
        setChargement(false);
      }
    },
    [limite]
  );

 useEffect(() => {
  const lancerChargement = async () => {
    await Promise.resolve();
    await chargerUtilisateurs(page);
  };

  void lancerChargement();
}, [chargerUtilisateurs, page]);
  function pagePrecedente() {
    if (page > 1) {
      setPage((anciennePage) => anciennePage - 1);
    }
  }

  function pageSuivante() {
    if (page < pages) {
      setPage((anciennePage) => anciennePage + 1);
    }
  }

  function formaterDate(date: string) {
    return new Intl.DateTimeFormat(
      "fr-FR",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    ).format(new Date(date));
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">

      {/* =====================================================
          EN-TÊTE
      ====================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

        <div>
          <div className="flex flex-wrap items-center gap-3">

            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
              Utilisateurs
            </h1>

            <Badge>
              {total} utilisateur{total > 1 ? "s" : ""}
            </Badge>

          </div>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
            Consultez les comptes, les rôles et l'activité
            de la communauté CodeDoctor.
          </p>
        </div>

        <button
          type="button"
          onClick={() => chargerUtilisateurs(page)}
          disabled={chargement}
          className="
            inline-flex items-center justify-center gap-2
            rounded-xl border border-zinc-200
            bg-white px-4 py-2.5
            text-sm font-medium text-zinc-700
            shadow-sm
            transition
            hover:bg-zinc-50
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <RefreshCw
            size={16}
            className={
              chargement
                ? "animate-spin"
                : ""
            }
          />

          Actualiser
        </button>

      </div>


      {/* =====================================================
          ERREUR
      ====================================================== */}

      {erreur && (
        <Card className="p-6">

          <div className="flex items-start gap-3">

            <div className="rounded-xl bg-red-50 p-2 text-red-600">
              <AlertCircle size={20} />
            </div>

            <div className="flex-1">

              <h2 className="font-semibold text-zinc-900">
                Impossible de charger les utilisateurs
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                {erreur}
              </p>

              <button
                type="button"
                onClick={() =>
                  chargerUtilisateurs(page)
                }
                className="
                  mt-4
                  inline-flex items-center gap-2
                  rounded-lg
                  bg-zinc-900
                  px-3 py-2
                  text-xs font-medium
                  text-white
                  transition
                  hover:bg-zinc-800
                "
              >
                <RefreshCw size={14} />
                Réessayer
              </button>

            </div>

          </div>

        </Card>
      )}


      {/* =====================================================
          CHARGEMENT
      ====================================================== */}

      {chargement && utilisateurs.length === 0 ? (
        <Card className="p-12">

          <div className="flex flex-col items-center justify-center text-center">

            <Loader2
              size={28}
              className="animate-spin text-zinc-400"
            />

            <p className="mt-4 text-sm font-medium text-zinc-700">
              Chargement des utilisateurs...
            </p>

            <p className="mt-1 text-xs text-zinc-400">
              Récupération des données depuis le serveur.
            </p>

          </div>

        </Card>
      ) : (
        <Card className="overflow-hidden">

          {/* =================================================
              VERSION MOBILE
          ================================================== */}

          <div className="divide-y divide-zinc-100 md:hidden">

            {utilisateurs.length === 0 ? (
              <div className="p-10 text-center">

                <UserRound
                  size={32}
                  className="mx-auto text-zinc-300"
                />

                <p className="mt-3 text-sm font-medium text-zinc-700">
                  Aucun utilisateur
                </p>

              </div>
            ) : (
              utilisateurs.map((utilisateur) => (

                <div
                  key={utilisateur.id}
                  className="p-5"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div className="flex min-w-0 items-center gap-3">

                      <div className="
                        flex h-10 w-10 shrink-0
                        items-center justify-center
                        rounded-full
                        bg-zinc-100
                        text-zinc-600
                      ">
                        <UserRound size={18} />
                      </div>

                      <div className="min-w-0">

                        <p className="truncate text-sm font-semibold text-zinc-900">
                          {utilisateur.displayName ||
                            "Utilisateur sans nom"}
                        </p>

                        <p className="mt-0.5 truncate text-xs text-zinc-500">
                          {utilisateur.email}
                        </p>

                      </div>

                    </div>

                    {utilisateur.role === "ADMIN" ? (
                      <Badge variant="warning">
                        Admin
                      </Badge>
                    ) : (
                      <Badge>
                        User
                      </Badge>
                    )}

                  </div>


                  <div className="mt-5 grid grid-cols-3 gap-2">

                    <div className="rounded-xl bg-zinc-50 p-3">
                      <p className="text-[11px] text-zinc-400">
                        Expériences
                      </p>

                      <p className="mt-1 text-sm font-semibold text-zinc-900">
                        {utilisateur._count.experiences}
                      </p>
                    </div>

                    <div className="rounded-xl bg-zinc-50 p-3">
                      <p className="text-[11px] text-zinc-400">
                        Commentaires
                      </p>

                      <p className="mt-1 text-sm font-semibold text-zinc-900">
                        {utilisateur._count.comments}
                      </p>
                    </div>

                    <div className="rounded-xl bg-zinc-50 p-3">
                      <p className="text-[11px] text-zinc-400">
                        Signalements
                      </p>

                      <p className="mt-1 text-sm font-semibold text-zinc-900">
                        {utilisateur._count.reports}
                      </p>
                    </div>

                  </div>


                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-zinc-100 pt-4">

                    <div className="flex items-center gap-2">

                      {utilisateur.emailVerified ? (
                        <>
                          <CheckCircle2
                            size={15}
                            className="text-emerald-600"
                          />

                          <span className="text-xs text-emerald-700">
                            Email vérifié
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle
                            size={15}
                            className="text-zinc-400"
                          />

                          <span className="text-xs text-zinc-500">
                            Email non vérifié
                          </span>
                        </>
                      )}

                    </div>

                    <span className="text-xs text-zinc-400">
                      {formaterDate(
                        utilisateur.createdAt
                      )}
                    </span>

                  </div>

                </div>

              ))
            )}

          </div>


          {/* =================================================
              VERSION DESKTOP
          ================================================== */}

          <div className="hidden overflow-x-auto md:block">

            <table className="w-full min-w-900px">

              <thead className="border-b border-zinc-100 bg-zinc-50/70">

                <tr className="text-left">

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Utilisateur
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Rôle
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Vérification
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Activité
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Signalements
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Inscription
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-zinc-100">

                {utilisateurs.length === 0 ? (
                  <tr>

                    <td
                      colSpan={6}
                      className="px-5 py-14 text-center"
                    >

                      <UserRound
                        size={32}
                        className="mx-auto text-zinc-300"
                      />

                      <p className="mt-3 text-sm font-medium text-zinc-700">
                        Aucun utilisateur trouvé
                      </p>

                    </td>

                  </tr>
                ) : (
                  utilisateurs.map((utilisateur) => (

                    <tr
                      key={utilisateur.id}
                      className="transition hover:bg-zinc-50/70"
                    >

                      {/* Utilisateur */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="
                            flex h-10 w-10 shrink-0
                            items-center justify-center
                            rounded-full
                            bg-zinc-100
                            text-zinc-600
                          ">
                            <UserRound size={17} />
                          </div>

                          <div className="min-w-0">

                            <p className="max-w-220px truncate text-sm font-semibold text-zinc-900">
                              {utilisateur.displayName ||
                                "Utilisateur sans nom"}
                            </p>

                            <div className="mt-1 flex items-center gap-1.5">

                              <Mail
                                size={13}
                                className="shrink-0 text-zinc-400"
                              />

                              <p className="max-w-220px truncate text-xs text-zinc-500">
                                {utilisateur.email}
                              </p>

                            </div>

                          </div>

                        </div>

                      </td>


                      {/* Rôle */}

                      <td className="px-5 py-4">

                        {utilisateur.role === "ADMIN" ? (
                          <Badge variant="warning">
                            <span className="inline-flex items-center gap-1.5">
                              <Shield size={12} />
                              Administrateur
                            </span>
                          </Badge>
                        ) : (
                          <Badge>
                            Utilisateur
                          </Badge>
                        )}

                      </td>


                      {/* Vérification */}

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


                      {/* Activité */}

                      <td className="px-5 py-4">

                        <div className="flex flex-wrap gap-2">

                          <span className="
                            inline-flex items-center gap-1
                            rounded-lg
                            bg-zinc-100
                            px-2 py-1
                            text-xs text-zinc-600
                          ">
                            <UserRound size={12} />
                            {utilisateur._count.experiences}
                          </span>

                          <span className="
                            inline-flex items-center gap-1
                            rounded-lg
                            bg-zinc-100
                            px-2 py-1
                            text-xs text-zinc-600
                          ">
                            <MessageSquare size={12} />
                            {utilisateur._count.comments}
                          </span>

                        </div>

                      </td>


                      {/* Signalements */}

                      <td className="px-5 py-4">

                        {utilisateur._count.reports > 0 ? (
                          <Badge variant="danger">
                            {utilisateur._count.reports}
                          </Badge>
                        ) : (
                          <span className="text-xs text-zinc-400">
                            Aucun
                          </span>
                        )}

                      </td>


                      {/* Date */}

                      <td className="px-5 py-4">

                        <span className="text-xs text-zinc-500">
                          {formaterDate(
                            utilisateur.createdAt
                          )}
                        </span>

                      </td>

                    </tr>

                  ))
                )}

              </tbody>

            </table>

          </div>


          {/* =================================================
              PAGINATION
          ================================================== */}

          {pages > 0 && (
            <div className="
              flex flex-col gap-3
              border-t border-zinc-100
              px-5 py-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            ">

              <p className="text-xs text-zinc-500">
                Page{" "}
                <span className="font-medium text-zinc-700">
                  {page}
                </span>{" "}
                sur{" "}
                <span className="font-medium text-zinc-700">
                  {pages}
                </span>
                {" · "}
                {total} utilisateur
                {total > 1 ? "s" : ""}
              </p>


              <div className="flex items-center gap-2">

                <button
                  type="button"
                  onClick={pagePrecedente}
                  disabled={
                    page <= 1 || chargement
                  }
                  className="
                    inline-flex items-center gap-1.5
                    rounded-lg
                    border border-zinc-200
                    bg-white
                    px-3 py-2
                    text-xs font-medium text-zinc-600
                    transition
                    hover:bg-zinc-50
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  <ChevronLeft size={15} />
                  Précédent
                </button>


                <button
                  type="button"
                  onClick={pageSuivante}
                  disabled={
                    page >= pages || chargement
                  }
                  className="
                    inline-flex items-center gap-1.5
                    rounded-lg
                    border border-zinc-200
                    bg-white
                    px-3 py-2
                    text-xs font-medium text-zinc-600
                    transition
                    hover:bg-zinc-50
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
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

