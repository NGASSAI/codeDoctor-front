import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";


import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Loader2,
  Mail,
  RefreshCw,
  Smartphone,
  UserRound,
  XCircle,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

import {
  obtenirPaiementsAdmin,
  approuverPaiementAdmin,
  rejeterPaiementAdmin,
} from "../../services/admin.service";

import type {
  PaiementAdmin,
  StatutPaiementAdmin,
} from "../../types/admin";

export default function PaiementsAdminPage() {
  const [paiements, setPaiements] = useState<PaiementAdmin[]>(
    []
  );

  const [page, setPage] = useState(1);
  const [limite] = useState(20);

  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);

  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  const [paiementEnModification, setPaiementEnModification] =
    useState<string | null>(null);

  const [recherche, setRecherche] = useState("");

  /*
   * ============================================================
   * CHARGEMENT DES PAIEMENTS
   * ============================================================
   */

  const chargerPaiements = useCallback(
    async (pageDemandee: number) => {
      try {
        setChargement(true);
        setErreur("");

        const resultat = await obtenirPaiementsAdmin(
          pageDemandee,
          limite
        );

        setPaiements(resultat.paiements);
        setPage(resultat.pagination.page);
        setTotal(resultat.pagination.total);
        setPages(resultat.pagination.pages);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des paiements :",
          error
        );

        setErreur(
          "Impossible de récupérer les demandes de paiement."
        );
      } finally {
        setChargement(false);
      }
    },
    [limite]
  );

  /*
   * ============================================================
   * CHARGEMENT INITIAL + PAGINATION
   * ============================================================
   */

  useEffect(() => {
    const lancerChargement = async () => {
      await Promise.resolve();
      await chargerPaiements(page);
    };

    void lancerChargement();
  }, [chargerPaiements, page]);

  /*
   * ============================================================
   * RECHERCHE
   * ============================================================
   */

  const paiementsFiltres = useMemo(() => {
    const terme = recherche.trim().toLowerCase();

    if (!terme) {
      return paiements;
    }

    return paiements.filter((paiement) => {
      return (
        paiement.user.email
          .toLowerCase()
          .includes(terme) ||
        (paiement.user.displayName ?? "")
          .toLowerCase()
          .includes(terme) ||
        paiement.statut
          .toLowerCase()
          .includes(terme)
      );
    });
  }, [paiements, recherche]);

  /*
   * ============================================================
   * APPROUVER / REJETER UN PAIEMENT
   * ============================================================
   */

  async function changerStatutPaiement(
    paiement: PaiementAdmin,
    action: "APPROVE" | "REJECT"
  ) {
    if (paiement.statut !== "PENDING") {
      return;
    }

    try {
      setPaiementEnModification(paiement.id);
      setErreur("");

      const resultat =
        action === "APPROVE"
          ? await approuverPaiementAdmin(
              paiement.id
            )
          : await rejeterPaiementAdmin(
              paiement.id
            );

      setPaiements((anciensPaiements) =>
        anciensPaiements.map(
          (ancienPaiement) =>
            ancienPaiement.id === paiement.id
              ? resultat.paiement
              : ancienPaiement
        )
      );
    } catch (error) {
      console.error(
        "Erreur lors de la modification du paiement :",
        error
      );

      setErreur(
        action === "APPROVE"
          ? "Impossible d'approuver ce paiement."
          : "Impossible de rejeter ce paiement."
      );
    } finally {
      setPaiementEnModification(null);
    }
  }

  /*
   * ============================================================
   * PAGINATION
   * ============================================================
   */

  function pagePrecedente() {
    if (page > 1) {
      setPage(
        (anciennePage) => anciennePage - 1
      );
    }
  }

  function pageSuivante() {
    if (page < pages) {
      setPage(
        (anciennePage) => anciennePage + 1
      );
    }
  }

  /*
   * ============================================================
   * FORMATAGE
   * ============================================================
   */

  function formaterDate(date: string) {
    return new Intl.DateTimeFormat(
      "fr-FR",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    ).format(new Date(date));
  }

  function formaterMontant(montant: number) {
    return new Intl.NumberFormat(
      "fr-FR"
    ).format(montant);
  }

  /*
   * ============================================================
   * LIBELLÉS DES STATUTS
   * ============================================================
   */

  function libelleStatut(
    statut: StatutPaiementAdmin
  ) {
    switch (statut) {
      case "PENDING":
        return "En attente";

      case "APPROVED":
        return "Approuvé";

      case "REJECTED":
        return "Rejeté";
    }
  }

  /*
   * ============================================================
   * BADGE STATUT
   * ============================================================
   */

  function BadgeStatut({
    statut,
  }: {
    statut: StatutPaiementAdmin;
  }) {
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

    if (statut === "APPROVED") {
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

      {/* =====================================================
          EN-TÊTE
      ====================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

        <div>
          <div className="flex flex-wrap items-center gap-3">

            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
              Paiements Premium
            </h1>

            <Badge>
              {total} demande
              {total > 1 ? "s" : ""}
            </Badge>

          </div>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
            Consultez et traitez les demandes d'activation
            Premium envoyées par les utilisateurs.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            chargerPaiements(page)
          }
          disabled={
            chargement ||
            paiementEnModification !== null
          }
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
          RECHERCHE
      ====================================================== */}

      <Card className="p-4">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-zinc-100 p-2.5 text-zinc-500">
            <UserRound size={18} />
          </div>

          <input
            type="search"
            value={recherche}
            onChange={(event) =>
              setRecherche(
                event.target.value
              )
            }
            placeholder="Rechercher par nom, email ou statut..."
            className="
              h-11 w-full
              rounded-xl
              border border-zinc-200
              bg-white
              px-4
              text-sm text-zinc-900
              outline-none
              transition
              placeholder:text-zinc-400
              focus:border-zinc-900
              focus:ring-4
              focus:ring-zinc-900/5
            "
          />

          {recherche && (
            <button
              type="button"
              onClick={() => setRecherche("")}
              className="
                shrink-0
                rounded-lg
                px-3 py-2
                text-xs font-medium
                text-zinc-500
                transition
                hover:bg-zinc-100
                hover:text-zinc-900
              "
            >
              Effacer
            </button>
          )}

        </div>

        {recherche && (
          <p className="mt-3 text-xs text-zinc-400">
            {paiementsFiltres.length} résultat
            {paiementsFiltres.length > 1
              ? "s"
              : ""}{" "}
            sur cette page.
          </p>
        )}

      </Card>

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
                Une erreur est survenue
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                {erreur}
              </p>

              <button
                type="button"
                onClick={() =>
                  chargerPaiements(page)
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

      {chargement &&
      paiements.length === 0 ? (
        <Card className="p-12">

          <div className="flex flex-col items-center justify-center text-center">

            <Loader2
              size={28}
              className="animate-spin text-zinc-400"
            />

            <p className="mt-4 text-sm font-medium text-zinc-700">
              Chargement des paiements...
            </p>

            <p className="mt-1 text-xs text-zinc-400">
              Récupération des demandes depuis le serveur.
            </p>

          </div>

        </Card>
      ) : (
        <Card className="overflow-hidden">

          {/* =================================================
              MOBILE
          ================================================== */}

          <div className="divide-y divide-zinc-100 md:hidden">

            {paiementsFiltres.length === 0 ? (
              <div className="p-10 text-center">

                <Smartphone
                  size={32}
                  className="mx-auto text-zinc-300"
                />

                <p className="mt-3 text-sm font-medium text-zinc-700">
                  Aucun paiement trouvé
                </p>

              </div>
            ) : (
              paiementsFiltres.map(
                (paiement) => {

                  const modificationEnCours =
                    paiementEnModification ===
                    paiement.id;

                  return (
                    <div
                      key={paiement.id}
                      className="space-y-5 p-5"
                    >

                      {/* Utilisateur */}

                      <div className="flex items-start justify-between gap-3">

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
                              {paiement.user.displayName ||
                                "Utilisateur sans nom"}
                            </p>

                            <p className="mt-0.5 truncate text-xs text-zinc-500">
                              {paiement.user.email}
                            </p>

                          </div>

                        </div>

                        <BadgeStatut
                          statut={paiement.statut}
                        />

                      </div>

                      {/* Informations */}

                      <div className="grid grid-cols-2 gap-2">

                        <div className="rounded-xl bg-zinc-50 p-3">

                          <p className="text-[11px] text-zinc-400">
                            Montant
                          </p>

                          <p className="mt-1 text-sm font-semibold text-zinc-900">
                            {formaterMontant(
                              paiement.montant
                            )}
                          </p>

                          <p className="text-[10px] text-zinc-400">
                            FCFA
                          </p>

                        </div>

                        <div className="rounded-xl bg-zinc-50 p-3">

                          <p className="text-[11px] text-zinc-400">
                            Méthode
                          </p>

                          <p className="mt-1 text-sm font-semibold text-zinc-900">
                            WhatsApp
                          </p>

                        </div>

                      </div>

                      {/* Date */}

                      <div className="
                        flex items-center gap-2
                        border-t border-zinc-100
                        pt-4
                        text-xs text-zinc-400
                      ">
                        <Clock3 size={13} />

                        Demande du{" "}
                        {formaterDate(
                          paiement.createdAt
                        )}
                      </div>

                      {/* Actions */}

                      {paiement.statut ===
                        "PENDING" && (
                        <div className="
                          grid grid-cols-2
                          gap-2
                          border-t
                          border-zinc-100
                          pt-4
                        ">

                          <button
                            type="button"
                            disabled={
                              modificationEnCours
                            }
                            onClick={() =>
                              void changerStatutPaiement(
                                paiement,
                                "REJECT"
                              )
                            }
                            className="
                              inline-flex
                              items-center
                              justify-center
                              gap-2
                              rounded-xl
                              border
                              border-red-200
                              bg-white
                              px-3 py-2.5
                              text-xs
                              font-medium
                              text-red-600
                              transition
                              hover:bg-red-50
                              disabled:cursor-not-allowed
                              disabled:opacity-50
                            "
                          >
                            {modificationEnCours ? (
                              <Loader2
                                size={14}
                                className="animate-spin"
                              />
                            ) : (
                              <XCircle size={14} />
                            )}

                            Rejeter
                          </button>

                          <button
                            type="button"
                            disabled={
                              modificationEnCours
                            }
                            onClick={() =>
                              void changerStatutPaiement(
                                paiement,
                                "APPROVE"
                              )
                            }
                            className="
                              inline-flex
                              items-center
                              justify-center
                              gap-2
                              rounded-xl
                              bg-zinc-900
                              px-3 py-2.5
                              text-xs
                              font-medium
                              text-white
                              transition
                              hover:bg-zinc-800
                              disabled:cursor-not-allowed
                              disabled:opacity-50
                            "
                          >
                            {modificationEnCours ? (
                              <Loader2
                                size={14}
                                className="animate-spin"
                              />
                            ) : (
                              <CheckCircle2 size={14} />
                            )}

                            Approuver
                          </button>

                        </div>
                      )}

                    </div>
                  );
                }
              )
            )}

          </div>

          {/* =================================================
              DESKTOP
          ================================================== */}

          <div className="hidden overflow-x-auto md:block">

            <table className="w-full min-w-237.5">

              <thead className="border-b border-zinc-100 bg-zinc-50/70">

                <tr className="text-left">

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Utilisateur
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Montant
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Méthode
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Statut
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Demande
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-zinc-100">

                {paiementsFiltres.length === 0 ? (
                  <tr>

                    <td
                      colSpan={6}
                      className="px-5 py-14 text-center"
                    >

                      <Smartphone
                        size={32}
                        className="mx-auto text-zinc-300"
                      />

                      <p className="mt-3 text-sm font-medium text-zinc-700">
                        Aucun paiement trouvé
                      </p>

                    </td>

                  </tr>
                ) : (
                  paiementsFiltres.map(
                    (paiement) => {

                      const modificationEnCours =
                        paiementEnModification ===
                        paiement.id;

                      return (
                        <tr
                          key={paiement.id}
                          className="transition hover:bg-zinc-50/70"
                        >

                          {/* Utilisateur */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-3">

                              <div className="
                                flex h-9 w-9 shrink-0
                                items-center justify-center
                                rounded-full
                                bg-zinc-100
                                text-zinc-600
                              ">
                                <UserRound size={16} />
                              </div>

                              <div className="min-w-0">

                                <p className="max-w-50 truncate text-sm font-semibold text-zinc-900">
                                  {paiement.user.displayName ||
                                    "Sans nom"}
                                </p>

                                <div className="mt-1 flex items-center gap-1.5">

                                  <Mail
                                    size={12}
                                    className="text-zinc-400"
                                  />

                                  <p className="max-w-55 truncate text-xs text-zinc-500">
                                    {paiement.user.email}
                                  </p>

                                </div>

                              </div>

                            </div>

                          </td>

                          {/* Montant */}

                          <td className="px-5 py-4">

                            <p className="text-sm font-semibold text-zinc-900">
                              {formaterMontant(
                                paiement.montant
                              )}{" "}
                              FCFA
                            </p>

                          </td>

                          {/* Méthode */}

                          <td className="px-5 py-4">

                            <span className="
                              inline-flex
                              items-center
                              gap-1.5
                              rounded-lg
                              bg-zinc-100
                              px-2.5 py-1.5
                              text-xs
                              font-medium
                              text-zinc-600
                            ">
                              <Smartphone size={13} />
                              WhatsApp
                            </span>

                          </td>

                          {/* Statut */}

                          <td className="px-5 py-4">

                            <BadgeStatut
                              statut={
                                paiement.statut
                              }
                            />

                          </td>

                          {/* Date */}

                          <td className="px-5 py-4">

                            <div className="
                              flex
                              items-center
                              gap-1.5
                              text-xs
                              text-zinc-500
                            ">
                              <Clock3 size={13} />

                              {formaterDate(
                                paiement.createdAt
                              )}
                            </div>

                          </td>

                          {/* Actions */}

                          <td className="px-5 py-4">

                            {paiement.statut ===
                            "PENDING" ? (
                              <div className="flex items-center gap-2">

                                <button
                                  type="button"
                                  disabled={
                                    modificationEnCours
                                  }
                                  onClick={() =>
                                    void changerStatutPaiement(
                                      paiement,
                                      "REJECT"
                                    )
                                  }
                                  className="
                                    inline-flex
                                    items-center
                                    gap-1.5
                                    rounded-lg
                                    border
                                    border-red-200
                                    bg-white
                                    px-3 py-2
                                    text-xs
                                    font-medium
                                    text-red-600
                                    transition
                                    hover:bg-red-50
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                  "
                                >
                                  {modificationEnCours ? (
                                    <Loader2
                                      size={13}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    <XCircle size={13} />
                                  )}

                                  Rejeter
                                </button>

                                <button
                                  type="button"
                                  disabled={
                                    modificationEnCours
                                  }
                                  onClick={() =>
                                    void changerStatutPaiement(
                                      paiement,
                                      "APPROVE"
                                    )
                                  }
                                  className="
                                    inline-flex
                                    items-center
                                    gap-1.5
                                    rounded-lg
                                    bg-zinc-900
                                    px-3 py-2
                                    text-xs
                                    font-medium
                                    text-white
                                    transition
                                    hover:bg-zinc-800
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                  "
                                >
                                  {modificationEnCours ? (
                                    <Loader2
                                      size={13}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    <CheckCircle2 size={13} />
                                  )}

                                  Approuver
                                </button>

                              </div>
                            ) : (
                              <span className="text-xs text-zinc-400">
                                Traité
                              </span>
                            )}

                          </td>

                        </tr>
                      );
                    }
                  )
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

                {total} demande
                {total > 1 ? "s" : ""}

              </p>

              <div className="flex items-center gap-2">

                <button
                  type="button"
                  onClick={pagePrecedente}
                  disabled={
                    page <= 1 ||
                    chargement
                  }
                  className="
                    inline-flex items-center gap-1.5
                    rounded-lg
                    border border-zinc-200
                    bg-white
                    px-3 py-2
                    text-xs font-medium
                    text-zinc-600
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
                    page >= pages ||
                    chargement
                  }
                  className="
                    inline-flex items-center gap-1.5
                    rounded-lg
                    border border-zinc-200
                    bg-white
                    px-3 py-2
                    text-xs font-medium
                    text-zinc-600
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