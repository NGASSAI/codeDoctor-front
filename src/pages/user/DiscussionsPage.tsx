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
    <Card className="overflow-hidden">
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-950 text-white">
            <MessageCircle size={18} />
          </div>

          <div className="min-w-0 flex-1">
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

            <h2 className="mt-3 text-lg font-semibold text-zinc-950">
              {experience.titre}
            </h2>

            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-400">
              <span>
                {experience.user.displayName ||
                  "Utilisateur CodeDoctor"}
              </span>

              <span>
                {formaterDate(experience.createdAt)}
              </span>
            </div>

            <p className="mt-4 line-clamp-3 text-sm leading-6 text-zinc-600">
              {experience.probleme}
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to={`/experiences/${experience.id}`}
                className="
                  inline-flex items-center
                  gap-2 rounded-xl
                  border border-zinc-200
                  bg-white px-4 py-2.5
                  text-sm font-medium
                  text-zinc-700
                  transition
                  hover:bg-zinc-50
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
                  bg-zinc-950
                  px-4 py-2.5
                  text-sm font-medium
                  text-white
                  transition
                  hover:bg-zinc-800
                "
              >
                <MessageCircle size={15} />
                {commentairesOuverts
                  ? "Masquer"
                  : "Discussion"}
                <span className="text-zinc-400">
                  ({experience._count.comments})
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {commentairesOuverts && (
        <div className="border-t border-zinc-100 bg-zinc-50 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-zinc-900">
                Discussion
              </h3>

              <p className="mt-1 text-xs text-zinc-400">
                Échangez autour de cette expérience.
              </p>
            </div>

            <span className="text-xs text-zinc-400">
              {commentaires.length} commentaire
              {commentaires.length > 1 ? "s" : ""}
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {commentaires.length === 0 ? (
              <div className="rounded-xl border border-dashed border-zinc-200 bg-white p-5 text-center">
                <p className="text-sm text-zinc-500">
                  Aucun commentaire pour le moment.
                </p>

                <p className="mt-1 text-xs text-zinc-400">
                  Soyez le premier à participer.
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

          <div className="mt-5 rounded-xl border border-zinc-200 bg-white p-4">
            <label
              htmlFor={`commentaire-${experience.id}`}
              className="text-sm font-medium text-zinc-800"
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
                border border-zinc-200
                bg-white
                p-3
                text-sm text-zinc-900
                outline-none
                transition
                placeholder:text-zinc-400
                focus:border-zinc-900
                focus:ring-4
                focus:ring-zinc-900/5
              "
            />

            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs text-zinc-400">
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
                  rounded-xl bg-zinc-950
                  px-4 py-2.5
                  text-sm font-medium
                  text-white
                  transition
                  hover:bg-zinc-800
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {commentaireEnCours ? (
                  <Loader2
                    size={15}
                    className="animate-spin"
                  />
                ) : (
                  <Send size={15} />
                )}

                Publier
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
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700">
            {(commentaire.user.displayName ||
              "U")
              .charAt(0)
              .toUpperCase()}
          </div>

          <div>
            <p className="text-xs font-semibold text-zinc-900">
              {commentaire.user.displayName ||
                "Utilisateur CodeDoctor"}
            </p>

            <p className="mt-0.5 text-[11px] text-zinc-400">
              {formaterDate(
                commentaire.createdAt
              )}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onSupprimer}
          className="
            rounded-lg p-2
            text-zinc-400
            transition
            hover:bg-red-50
            hover:text-red-600
          "
          aria-label="Supprimer le commentaire"
        >
          <Trash2 size={15} />
        </button>
      </div>

      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-600">
        {commentaire.contenu}
      </p>
    </div>
  );
}

export default function DiscussionsPage() {
  const [experiences, setExperiences] = useState<
    Experience[]
  >([]);

  const [commentaires, setCommentaires] =
    useState<
      Record<string, CommentaireExperience[]>
    >({});

  const [
    discussionsOuvertes,
    setDiscussionsOuvertes,
  ] = useState<Record<string, boolean>>({});

  const [commentairesSaisis, setCommentairesSaisis] =
    useState<Record<string, string>>({});

  const [
    commentaireEnCours,
    setCommentaireEnCours,
  ] = useState<string | null>(null);

  const [chargement, setChargement] =
    useState(true);

  const [erreur, setErreur] = useState("");

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
          setExperiences(resultat.experiences);
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

  async function ouvrirDiscussion(
    experienceId: string
  ) {
    const dejaOuverte =
      discussionsOuvertes[experienceId];

    setDiscussionsOuvertes((anciennes) => ({
      ...anciennes,
      [experienceId]: !dejaOuverte,
    }));

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

  async function publierCommentaire(
    experienceId: string
  ) {
    const contenu =
      commentairesSaisis[experienceId]?.trim() ||
      "";

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

      setCommentairesSaisis((anciens) => ({
        ...anciens,
        [experienceId]: "",
      }));

      setExperiences((anciennes) =>
        anciennes.map((experience) =>
          experience.id === experienceId
            ? {
                ...experience,
                _count: {
                  ...experience._count,
                  comments:
                    experience._count.comments + 1,
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

  async function supprimerMonCommentaire(
    experienceId: string,
    commentaireId: string
  ) {
    const confirmer = window.confirm(
      "Voulez-vous vraiment supprimer ce commentaire ?"
    );

    if (!confirmer) {
      return;
    }

    try {
      await supprimerCommentaire(
        commentaireId
      );

      setCommentaires((anciens) => ({
        ...anciens,
        [experienceId]: (
          anciens[experienceId] ?? []
        ).filter(
          (commentaire) =>
            commentaire.id !== commentaireId
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
                    experience._count.comments - 1
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

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <section>
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600">
          <MessageCircle size={14} />
          Communauté
        </div>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          Discussions
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500 sm:text-base">
          Échangez avec d'autres développeurs autour
          de problèmes réels, de solutions et de bonnes
          pratiques.
        </p>
      </section>

      {erreur && (
        <Card className="border-red-200 bg-red-50 p-5">
          <div className="flex items-start gap-3">
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0 text-red-600"
            />

            <p className="text-sm text-red-700">
              {erreur}
            </p>
          </div>
        </Card>
      )}

      {chargement ? (
        <Card className="p-12">
          <div className="flex flex-col items-center text-center">
            <Loader2
              size={28}
              className="animate-spin text-zinc-400"
            />

            <p className="mt-4 text-sm font-medium text-zinc-700">
              Chargement des discussions...
            </p>
          </div>
        </Card>
      ) : experiences.length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen
            size={36}
            className="mx-auto text-zinc-300"
          />

          <h2 className="mt-4 text-sm font-semibold text-zinc-800">
            Aucune discussion pour le moment
          </h2>

          <p className="mt-1 text-xs leading-5 text-zinc-400">
            Les expériences publiées apparaîtront ici.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {experiences.map((experience) => (
            <DiscussionCard
              key={experience.id}
              experience={experience}
              commentaires={
                commentaires[experience.id] ?? []
              }
              commentairesOuverts={
                Boolean(
                  discussionsOuvertes[
                    experience.id
                  ]
                )
              }
              commentaireEnCours={
                commentaireEnCours === experience.id
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
              onChangeCommentaire={(valeur) =>
                setCommentairesSaisis(
                  (anciens) => ({
                    ...anciens,
                    [experience.id]: valeur,
                  })
                )
              }
              onEnvoyerCommentaire={() =>
                void publierCommentaire(
                  experience.id
                )
              }
              onSupprimerCommentaire={(id) =>
                void supprimerMonCommentaire(
                  experience.id,
                  id
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}