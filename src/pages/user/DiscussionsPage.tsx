
import {
  useEffect,
  useState,
} from "react";
import {
  AlertCircle,
  BookOpen,
  ChevronRight,
  Loader2,
  MessageCircle,
  Send,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

import {
  obtenirExperiences,
  obtenirCommentaires,
  ajouterCommentaire,
  supprimerCommentaire,
} from "../../services/experience.service";

import type {
  CommentaireExperience,
  Experience,
} from "../../types/experience";

const LIMITE_EXPERIENCES = 10;

function formaterDate(date: string) {
  const valeur = new Date(date);

  if (Number.isNaN(valeur.getTime())) {
    return "Date inconnue";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(valeur);
}

function libelleCategorie(categorie: string) {
  switch (categorie) {
    case "JAVASCRIPT":
      return "JavaScript";

    case "TYPESCRIPT":
      return "TypeScript";

    case "REACT":
      return "React";

    case "HTTP":
      return "HTTP";

    case "API":
      return "API";

    case "HTML_CSS":
      return "HTML / CSS";

    default:
      return categorie;
  }
}

interface DiscussionCardProps {
  experience: Experience;
  commentaires: CommentaireExperience[];
  commentairesOuverts: boolean;
  commentaireEnCours: boolean;
  commentaire: string;
  onToggle: () => void;
  onChangeCommentaire: (valeur: string) => void;
  onEnvoyerCommentaire: () => void;
  onSupprimerCommentaire: (
    commentaireId: string
  ) => void;
}

function DiscussionCard({
  experience,
  commentaires,
  commentairesOuverts,
  commentaireEnCours,
  commentaire,
  onToggle,
  onChangeCommentaire,
  onEnvoyerCommentaire,
  onSupprimerCommentaire,
}: DiscussionCardProps) {
  return (
    <Card className="overflow-hidden border border-blue-100 bg-white shadow-sm transition hover:border-blue-200 hover:shadow-md">
      {/* =========================
          CONTENU EXPÉRIENCE
      ========================== */}

      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-4">
          {/* Icône */}

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/20">
            <MessageCircle
              size={18}
              strokeWidth={2}
            />
          </div>

          <div className="min-w-0 flex-1">
            {/* Badges */}

            <div className="flex flex-wrap items-center gap-2">
              <Badge>
                {libelleCategorie(
                  experience.categorie
                )}
              </Badge>

              {experience.technologie && (
                <Badge variant="success">
                  {experience.technologie}
                </Badge>
              )}
            </div>

            {/* Titre */}

            <h2 className="mt-3 text-lg font-semibold text-slate-900">
              {experience.titre}
            </h2>

            {/* Auteur + date */}

            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
              <span className="font-medium text-blue-700">
                {experience.user.displayName ||
                  "Utilisateur CodeDoctor"}
              </span>

              <span>
                {formaterDate(
                  experience.createdAt
                )}
              </span>
            </div>

            {/* Problème */}

            <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
              {experience.probleme}
            </p>

            {/* Actions */}

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to={`/experiences/${experience.id}`}
                className="
                  inline-flex items-center
                  gap-2 rounded-xl
                  border border-blue-200
                  bg-white px-4 py-2.5
                  text-sm font-semibold
                  text-blue-700
                  transition
                  hover:border-blue-300
                  hover:bg-blue-50
                "
              >
                Voir le problème
                <ChevronRight size={15} />
              </Link>

              <button
                type="button"
                onClick={onToggle}
                className="
                  inline-flex items-center
                  gap-2 rounded-xl
                  bg-gradient-to-r
                  from-blue-600
                  to-cyan-600
                  px-4 py-2.5
                  text-sm font-semibold
                  text-white
                  shadow-md
                  shadow-blue-500/20
                  transition
                  hover:from-blue-700
                  hover:to-cyan-700
                  hover:shadow-lg
                  hover:shadow-blue-500/25
                "
              >
                <MessageCircle size={15} />

                {commentairesOuverts
                  ? "Masquer"
                  : "Discussion"}

                <span className="text-blue-100">
                  ({experience._count.comments})
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          ZONE DISCUSSION
      ========================== */}

      {commentairesOuverts && (
        <div className="border-t border-blue-100 bg-blue-50/50 p-5 sm:p-6">
          {/* En-tête */}

          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Discussion
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Échangez autour de cette
                expérience avec la communauté.
              </p>
            </div>

            <span className="shrink-0 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
              {commentaires.length} commentaire
              {commentaires.length > 1
                ? "s"
                : ""}
            </span>
          </div>

          {/* Commentaires */}

          <div className="mt-5 space-y-3">
            {commentaires.length === 0 ? (
              <div className="rounded-xl border border-dashed border-blue-200 bg-white p-5 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <MessageCircle
                    size={18}
                  />
                </div>

                <p className="mt-3 text-sm font-medium text-slate-700">
                  Aucun commentaire pour le
                  moment.
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Soyez le premier à participer
                  à cette discussion.
                </p>
              </div>
            ) : (
              commentaires.map((commentaire) => (
                <CommentaireItem
                  key={commentaire.id}
                  commentaire={commentaire}
                  onSupprimer={() =>
                    onSupprimerCommentaire(
                      commentaire.id
                    )
                  }
                />
              ))
            )}
          </div>

          {/* Formulaire commentaire */}

          <div className="mt-5 rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
            <label
              htmlFor={`commentaire-${experience.id}`}
              className="text-sm font-semibold text-slate-800"
            >
              Votre réponse
            </label>

            <textarea
              id={`commentaire-${experience.id}`}
              value={commentaire}
              onChange={(event) =>
                onChangeCommentaire(
                  event.target.value
                )
              }
              rows={4}
              maxLength={1000}
              disabled={commentaireEnCours}
              placeholder="Partagez une idée, une solution ou une remarque..."
              className="
                mt-2 w-full resize-y
                rounded-xl
                border border-blue-200
                bg-white
                p-3
                text-sm text-slate-900
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-500/10
                disabled:cursor-not-allowed
                disabled:bg-slate-50
              "
            />

            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs text-slate-500">
                {commentaire.length}/1000
              </span>

              <button
                type="button"
                onClick={onEnvoyerCommentaire}
                disabled={
                  commentaireEnCours ||
                  !commentaire.trim()
                }
                className="
                  inline-flex items-center
                  justify-center gap-2
                  rounded-xl
                  bg-gradient-to-r
                  from-blue-600
                  to-cyan-600
                  px-4 py-2.5
                  text-sm font-semibold
                  text-white
                  shadow-md
                  shadow-blue-500/20
                  transition
                  hover:from-blue-700
                  hover:to-cyan-700
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  disabled:shadow-none
                "
              >
                {commentaireEnCours ? (
                  <>
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />

                    Publication...
                  </>
                ) : (
                  <>
                    <Send size={15} />

                    Publier
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

function CommentaireItem({
  commentaire,
  onSupprimer,
}: {
  commentaire: CommentaireExperience;
  onSupprimer: () => void;
}) {
  const initiale =
    (
      commentaire.user.displayName ||
      "U"
    )
      .charAt(0)
      .toUpperCase();

  return (
    <div className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm transition hover:border-blue-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {/* Avatar */}

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
            {initiale}
          </div>

          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-slate-900">
              {commentaire.user.displayName ||
                "Utilisateur CodeDoctor"}
            </p>

            <p className="mt-0.5 text-[11px] text-slate-500">
              {formaterDate(
                commentaire.createdAt
              )}
            </p>
          </div>
        </div>

        {/* Suppression */}

        <button
          type="button"
          onClick={onSupprimer}
          className="
            shrink-0
            rounded-lg
            p-2
            text-slate-400
            transition
            hover:bg-red-50
            hover:text-red-600
          "
          aria-label="Supprimer le commentaire"
          title="Supprimer le commentaire"
        >
          <Trash2 size={15} />
        </button>
      </div>

      {/* Contenu */}

      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
        {commentaire.contenu}
      </p>
    </div>
  );
}

export default function DiscussionsPage() {
  const [experiences, setExperiences] =
    useState<Experience[]>([]);

  const [commentaires, setCommentaires] =
    useState<
      Record<string, CommentaireExperience[]>
    >({});

  const [
    discussionsOuvertes,
    setDiscussionsOuvertes,
  ] = useState<Record<string, boolean>>({});

  const [
    commentairesSaisis,
    setCommentairesSaisis,
  ] = useState<Record<string, string>>({});

  const [
    commentaireEnCours,
    setCommentaireEnCours,
  ] = useState<string | null>(null);

  const [chargement, setChargement] =
    useState(true);

  const [erreur, setErreur] =
    useState("");

  /* =========================
     CHARGEMENT DES EXPÉRIENCES
  ========================== */

  useEffect(() => {
    let actif = true;

    async function charger() {
      try {
        setChargement(true);
        setErreur("");

        const resultat =
          await obtenirExperiences({
            page: 1,
            limite: LIMITE_EXPERIENCES,
          });

        if (actif) {
          setExperiences(
            resultat.experiences
          );
        }
      } catch (error) {
        console.error(
          "Erreur chargement discussions :",
          error
        );

        if (actif) {
          setErreur(
            "Impossible de récupérer les discussions."
          );
        }
      } finally {
        if (actif) {
          setChargement(false);
        }
      }
    }

    void charger();

    return () => {
      actif = false;
    };
  }, []);

  /* =========================
     OUVRIR / FERMER DISCUSSION
  ========================== */

  async function ouvrirDiscussion(
    experienceId: string
  ) {
    const dejaOuverte =
      discussionsOuvertes[experienceId];

    setDiscussionsOuvertes(
      (anciennes) => ({
        ...anciennes,
        [experienceId]: !dejaOuverte,
      })
    );

    if (
      dejaOuverte ||
      commentaires[experienceId]
    ) {
      return;
    }

    try {
      const resultat =
        await obtenirCommentaires(
          experienceId
        );

      setCommentaires((anciens) => ({
        ...anciens,
        [experienceId]: resultat,
      }));
    } catch (error) {
      console.error(
        "Erreur chargement commentaires :",
        error
      );

      setErreur(
        "Impossible de récupérer les commentaires."
      );
    }
  }

  /* =========================
     PUBLIER COMMENTAIRE
  ========================== */

  async function publierCommentaire(
    experienceId: string
  ) {
    const contenu =
      commentairesSaisis[
        experienceId
      ]?.trim() || "";

    if (!contenu) {
      return;
    }

    try {
      setCommentaireEnCours(
        experienceId
      );

      setErreur("");

      const commentaire =
        await ajouterCommentaire(
          experienceId,
          contenu
        );

      setCommentaires((anciens) => ({
        ...anciens,
        [experienceId]: [
          ...(anciens[experienceId] ?? []),
          commentaire,
        ],
      }));

      setCommentairesSaisis(
        (anciens) => ({
          ...anciens,
          [experienceId]: "",
        })
      );

      setExperiences((anciennes) =>
        anciennes.map((experience) =>
          experience.id === experienceId
            ? {
                ...experience,
                _count: {
                  ...experience._count,
                  comments:
                    experience._count
                      .comments + 1,
                },
              }
            : experience
        )
      );
    } catch (error) {
      console.error(
        "Erreur publication commentaire :",
        error
      );

      setErreur(
        "Impossible de publier votre commentaire."
      );
    } finally {
      setCommentaireEnCours(null);
    }
  }

  /* =========================
     SUPPRIMER COMMENTAIRE
  ========================== */

  async function supprimerMonCommentaire(
    experienceId: string,
    commentaireId: string
  ) {
    const confirmer =
      window.confirm(
        "Voulez-vous vraiment supprimer ce commentaire ?"
      );

    if (!confirmer) {
      return;
    }

    try {
      setErreur("");

      await supprimerCommentaire(
        commentaireId
      );

      setCommentaires((anciens) => ({
        ...anciens,
        [experienceId]: (
          anciens[experienceId] ?? []
        ).filter(
          (commentaire) =>
            commentaire.id !==
            commentaireId
        ),
      }));

      setExperiences((anciennes) =>
        anciennes.map((experience) =>
          experience.id === experienceId
            ? {
                ...experience,
                _count: {
                  ...experience._count,
                  comments: Math.max(
                    0,
                    experience._count
                      .comments - 1
                  ),
                },
              }
            : experience
        )
      );
    } catch (error) {
      console.error(
        "Erreur suppression commentaire :",
        error
      );

      setErreur(
        "Impossible de supprimer le commentaire."
      );
    }
  }

  /* =========================
     RENDU
  ========================== */

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      {/* =========================
          EN-TÊTE
      ========================== */}

      <section>
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
          <MessageCircle
            size={14}
          />

          Communauté CodeDoctor
        </div>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Discussions
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
          Échangez avec d'autres développeurs
          autour de problèmes réels, de
          solutions et de bonnes pratiques.
        </p>
      </section>

      {/* =========================
          ERREUR
      ========================== */}

      {erreur && (
        <Card className="border-red-200 bg-red-50 p-5">
          <div className="flex items-start gap-3">
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0 text-red-600"
            />

            <p className="text-sm font-medium text-red-700">
              {erreur}
            </p>
          </div>
        </Card>
      )}

      {/* =========================
          CHARGEMENT
      ========================== */}

      {chargement ? (
        <Card className="border-blue-100 bg-white p-12">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
              <Loader2
                size={25}
                className="animate-spin text-blue-600"
              />
            </div>

            <p className="mt-4 text-sm font-semibold text-slate-800">
              Chargement des discussions...
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Récupération des expériences de
              la communauté.
            </p>
          </div>
        </Card>
      ) : experiences.length === 0 ? (
        /* =========================
           AUCUNE EXPÉRIENCE
        ========================== */

        <Card className="border-blue-100 bg-white p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <BookOpen size={28} />
          </div>

          <h2 className="mt-4 text-sm font-semibold text-slate-800">
            Aucune discussion pour le moment
          </h2>

          <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-500">
            Les expériences publiées par la
            communauté apparaîtront ici.
          </p>
        </Card>
      ) : (
        /* =========================
           LISTE
        ========================== */

        <div className="space-y-4">
          {experiences.map(
            (experience) => (
              <DiscussionCard
                key={experience.id}
                experience={experience}
                commentaires={
                  commentaires[
                    experience.id
                  ] ?? []
                }
                commentairesOuverts={Boolean(
                  discussionsOuvertes[
                    experience.id
                  ]
                )}
                commentaireEnCours={
                  commentaireEnCours ===
                  experience.id
                }
                commentaire={
                  commentairesSaisis[
                    experience.id
                  ] ?? ""
                }
                onToggle={() =>
                  void ouvrirDiscussion(
                    experience.id
                  )
                }
                onChangeCommentaire={(
                  valeur
                ) =>
                  setCommentairesSaisis(
                    (anciens) => ({
                      ...anciens,
                      [experience.id]:
                        valeur,
                    })
                  )
                }
                onEnvoyerCommentaire={() =>
                  void publierCommentaire(
                    experience.id
                  )
                }
                onSupprimerCommentaire={(
                  id
                ) =>
                  void supprimerMonCommentaire(
                    experience.id,
                    id
                  )
                }
              />
            )
          )}
        </div>
      )}
    </div>
  );
}
