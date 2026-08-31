import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Code2,
  Loader2,
  MessageCircle,
  Send,
  Trash2,
  UserRound,
} from "lucide-react";
import {
  useEffect,
  useState,
  type FormEvent,
} from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

import {
  ajouterCommentaire,
  obtenirExperience,
  supprimerCommentaire,
} from "../../services/experience.service";

import type {
  CommentaireExperience,
  ExperienceDetail,
} from "../../types/experience";

import { useAuthStore } from "../../stores/auth.store";

function formaterDate(date: string) {
  const valeur = new Date(date);

  if (Number.isNaN(valeur.getTime())) {
    return "Date inconnue";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(valeur);
}

function nomCategorie(categorie: string) {
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

export default function ExperienceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const utilisateur = useAuthStore(
    (state) => state.utilisateur
  );

  const [experience, setExperience] =
    useState<ExperienceDetail | null>(null);

  const [commentaires, setCommentaires] =
    useState<CommentaireExperience[]>([]);

  const [commentaire, setCommentaire] =
    useState("");

  const [chargement, setChargement] =
    useState(true);

  const [envoiCommentaire, setEnvoiCommentaire] =
    useState(false);

  const [suppressionId, setSuppressionId] =
    useState<string | null>(null);

  const [erreur, setErreur] = useState("");

  useEffect(() => {
    if (!id) {
      return;
    }

    const experienceId = id;
    let actif = true;

    async function charger() {
      try {
        setChargement(true);
        setErreur("");

        const resultat =
          await obtenirExperience(experienceId);

        if (!actif) {
          return;
        }

        setExperience(resultat);
        setCommentaires(
          resultat.comments ?? []
        );
      } catch (error) {
        console.error(
          "Erreur chargement expérience :",
          error
        );

        if (actif) {
          setErreur(
            "Impossible de récupérer cette expérience."
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
  }, [id]);

  async function publierCommentaire(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!id || !commentaire.trim()) {
      return;
    }

    const contenu = commentaire.trim();

    if (contenu.length > 1000) {
      setErreur(
        "Le commentaire ne peut pas dépasser 1000 caractères."
      );
      return;
    }

    try {
      setEnvoiCommentaire(true);
      setErreur("");

      const resultat =
        await ajouterCommentaire(
          id,
          contenu
        );

      setCommentaires((anciens) => [
        ...anciens,
        resultat,
      ]);

      setCommentaire("");

      setExperience((ancien) =>
        ancien
          ? {
              ...ancien,
              _count: {
                ...ancien._count,
                comments:
                  ancien._count.comments + 1,
              },
            }
          : ancien
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
      setEnvoiCommentaire(false);
    }
  }

  async function supprimerMonCommentaire(
    commentaireId: string
  ) {
    const confirmer = window.confirm(
      "Voulez-vous vraiment supprimer ce commentaire ?"
    );

    if (!confirmer) {
      return;
    }

    try {
      setSuppressionId(commentaireId);
      setErreur("");

      await supprimerCommentaire(
        commentaireId
      );

      setCommentaires((anciens) =>
        anciens.filter(
          (item) =>
            item.id !== commentaireId
        )
      );

      setExperience((ancien) =>
        ancien
          ? {
              ...ancien,
              _count: {
                ...ancien._count,
                comments: Math.max(
                  0,
                  ancien._count.comments - 1
                ),
              },
            }
          : ancien
      );
    } catch (error) {
      console.error(
        "Erreur suppression commentaire :",
        error
      );

      setErreur(
        "Impossible de supprimer ce commentaire."
      );
    } finally {
      setSuppressionId(null);
    }
  }

  if (chargement) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-12">
        <Card className="border-blue-100/60 bg-white/80 p-12 shadow-sm backdrop-blur-sm">
          <div className="flex flex-col items-center text-center">
            <Loader2
              size={32}
              className="animate-spin text-blue-600"
            />
            <p className="mt-4 text-sm font-medium text-slate-600">
              Chargement de l'expérience...
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (!id || !experience) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-12">
        <Card className="border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <AlertCircle size={30} />
          </div>

          <h1 className="mt-4 text-xl font-bold text-slate-900">
            Expérience introuvable
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {erreur ||
              "Cette expérience n'existe pas ou n'est plus disponible."}
          </p>

          <Link
            to="/experiences"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
          >
            <ArrowLeft size={16} />
            Retour aux expériences
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6">
      <button
        type="button"
        onClick={() => navigate("/experiences")}
        className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
      >
        <ArrowLeft size={17} className="transition-transform group-hover:-translate-x-1" />
        Retour aux expériences
      </button>

      {erreur && (
        <Card className="border-red-200 bg-red-50/70 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0 text-red-600"
            />
            <p className="text-sm leading-6 text-red-700">
              {erreur}
            </p>
          </div>
        </Card>
      )}

      {/* EN-TÊTE */}
      <Card className="border-blue-100 bg-linear-to-br from-white via-white to-blue-50/30 p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>
              {nomCategorie(experience.categorie)}
            </Badge>

            {experience.technologie && (
              <Badge variant="success">
                {experience.technologie}
              </Badge>
            )}
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {experience.titre}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-slate-700">
                <UserRound size={14} className="text-blue-600" />
                {experience.user.displayName || "Développeur CodeDoctor"}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={14} className="text-slate-400" />
                {formaterDate(experience.createdAt)}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <MessageCircle size={14} className="text-slate-400" />
                {experience._count.comments} commentaire
                {experience._count.comments > 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* PROBLÈME */}
      <Card className="border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <AlertCircle size={18} />
          </div>
          <h2 className="text-base font-bold text-slate-900">
            Problème rencontré
          </h2>
        </div>

        <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600 sm:text-base">
          {experience.probleme}
        </p>
      </Card>

      {/* CODE */}
      {experience.code && (
        <Card className="overflow-hidden border-slate-800 bg-slate-950 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-5 py-3 sm:px-6">
            <div className="flex items-center gap-2">
              <Code2 size={16} className="text-blue-400" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Code concerné
              </h2>
            </div>
          </div>

          <div className="overflow-x-auto p-5 sm:p-6">
            <pre className="wrap-break-word whitespace-pre-wrap font-mono text-sm leading-6 text-slate-200">
              {experience.code}
            </pre>
          </div>
        </Card>
      )}

      {/* CAUSE */}
      <Card className="border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <BookOpen size={18} />
          </div>
          <h2 className="text-base font-bold text-slate-900">
            Cause du problème
          </h2>
        </div>

        <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">
          {experience.cause}
        </p>
      </Card>

      {/* SOLUTION */}
      <Card className="border-blue-200 bg-linear-to-br from-blue-600 to-blue-700 p-6 text-white shadow-md sm:p-8">
        <div className="flex items-center gap-2.5 border-b border-blue-500/40 pb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white">
            <CheckCircle2 size={18} />
          </div>
          <h2 className="text-base font-bold text-white">
            Solution proposée
          </h2>
        </div>

        <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-blue-50 sm:text-base">
          {experience.solution}
        </p>
      </Card>

      {/* DISCUSSION */}
      <section className="pt-2">
        <div className="mb-4">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Discussion
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Échangez avec la communauté autour de cette expérience technique.
          </p>
        </div>

        <Card className="border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
          <div className="space-y-4">
            {commentaires.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-500">
                  <MessageCircle size={22} />
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-800">
                  Aucun commentaire pour le moment
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Soyez le premier à participer à la discussion.
                </p>
              </div>
            ) : (
              commentaires.map((item) => {
                const estMonCommentaire =
                  utilisateur?.id === item.user.id;

                return (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition hover:bg-slate-50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                          {(
                            item.user.displayName || "U"
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <p className="text-xs font-bold text-slate-900">
                            {item.user.displayName ||
                              "Utilisateur CodeDoctor"}
                          </p>

                          <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                            {formaterDate(item.createdAt)}
                          </p>
                        </div>
                      </div>

                      {estMonCommentaire && (
                        <button
                          type="button"
                          onClick={() =>
                            void supprimerMonCommentaire(item.id)
                          }
                          disabled={suppressionId === item.id}
                          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                          aria-label="Supprimer mon commentaire"
                        >
                          {suppressionId === item.id ? (
                            <Loader2
                              size={15}
                              className="animate-spin text-red-600"
                            />
                          ) : (
                            <Trash2 size={15} />
                          )}
                        </button>
                      )}
                    </div>

                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                      {item.contenu}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          {utilisateur ? (
            <form
              onSubmit={publierCommentaire}
              className="mt-6 border-t border-slate-100 pt-6"
            >
              <label
                htmlFor="commentaire"
                className="text-sm font-semibold text-slate-800"
              >
                Votre commentaire
              </label>

              <textarea
                id="commentaire"
                value={commentaire}
                onChange={(event) =>
                  setCommentaire(event.target.value)
                }
                maxLength={1000}
                rows={4}
                disabled={envoiCommentaire}
                placeholder="Partagez votre analyse, une solution ou une remarque..."
                className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 disabled:bg-slate-50"
              />

              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-xs font-medium text-slate-400">
                  {commentaire.length}/1000
                </span>

                <button
                  type="submit"
                  disabled={
                    envoiCommentaire || !commentaire.trim()
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {envoiCommentaire ? (
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                  ) : (
                    <Send size={16} />
                  )}
                  Publier le commentaire
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-6 border-t border-slate-100 pt-6">
              <div className="rounded-xl bg-blue-50/50 p-5 text-center">
                <p className="text-sm font-medium text-slate-800">
                  Connectez-vous pour participer à la discussion
                </p>

                <Link
                  to="/connexion"
                  className="mt-3 inline-flex rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  Se connecter
                </Link>
              </div>
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}