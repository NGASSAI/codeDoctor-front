import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Code2,
  Copy,
  Check,
  Flag,
  Loader2,
  MessageSquare,
  Send,
  ThumbsUp,
  Trash2,
  User,
  X,
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

import {
  ajouterCommentaire,
  obtenirExperience,
  supprimerCommentaire,
} from "../../services/experience.service";

import {
  obtenirReactions,
  ajouterReaction,
  supprimerReaction,
  type Reaction,
} from "../../services/reaction.service";

import {
  signalerExperience,
  RAISONS_SIGNALEMENT,
  type RaisonSignalement,
} from "../../services/report.service";

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
  const [copie, setCopie] = useState(false);

  // Réactions
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [envoiReaction, setEnvoiReaction] = useState(false);

  // Signalement
  const [modaleSignalementOuverte, setModaleSignalementOuverte] =
    useState(false);
  const [raisonSignalement, setRaisonSignalement] =
    useState<RaisonSignalement>("SPAM");
  const [descriptionSignalement, setDescriptionSignalement] = useState("");
  const [envoiSignalement, setEnvoiSignalement] = useState(false);
  const [signalementEnvoye, setSignalementEnvoye] = useState(false);
  const [erreurSignalement, setErreurSignalement] = useState("");

  useEffect(() => {
    if (!id) return;

    const experienceId = id;
    let actif = true;

    async function charger() {
      try {
        setChargement(true);
        setErreur("");

        const resultat = await obtenirExperience(experienceId);

        if (!actif) return;

        setExperience(resultat);
        setCommentaires(resultat.comments ?? []);

        const resultatReactions = await obtenirReactions(experienceId);

        if (actif) {
          setReactions(resultatReactions);
        }
      } catch (error) {
        console.error("Erreur chargement expérience :", error);
        if (actif) {
          setErreur("Impossible de récupérer cette expérience.");
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

  async function publierCommentaire(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!id || !commentaire.trim()) return;

    const contenu = commentaire.trim();

    if (contenu.length > 1000) {
      setErreur("Le commentaire ne peut pas dépasser 1000 caractères.");
      return;
    }

    try {
      setEnvoiCommentaire(true);
      setErreur("");

      const resultat = await ajouterCommentaire(id, contenu);

      setCommentaires((anciens) => [...anciens, resultat]);
      setCommentaire("");

      setExperience((ancien) =>
        ancien
          ? {
              ...ancien,
              _count: {
                ...ancien._count,
                comments: ancien._count.comments + 1,
              },
            }
          : ancien
      );
    } catch (error) {
      console.error("Erreur publication commentaire :", error);
      setErreur("Impossible de publier votre commentaire.");
    } finally {
      setEnvoiCommentaire(false);
    }
  }

  async function supprimerMonCommentaire(commentaireId: string) {
    const confirmer = window.confirm(
      "Voulez-vous vraiment supprimer ce commentaire ?"
    );

    if (!confirmer) return;

    try {
      setSuppressionId(commentaireId);
      setErreur("");

      await supprimerCommentaire(commentaireId);

      setCommentaires((anciens) =>
        anciens.filter((item) => item.id !== commentaireId)
      );

      setExperience((ancien) =>
        ancien
          ? {
              ...ancien,
              _count: {
                ...ancien._count,
                comments: Math.max(0, ancien._count.comments - 1),
              },
            }
          : ancien
      );
    } catch (error) {
      console.error("Erreur suppression commentaire :", error);
      setErreur("Impossible de supprimer ce commentaire.");
    } finally {
      setSuppressionId(null);
    }
  }

  const maReactionUseful = reactions.find(
    (r) => r.type === "USEFUL" && r.userId === utilisateur?.id
  );

  async function basculerReactionUtile() {
    if (!id || !utilisateur) return;

    try {
      setEnvoiReaction(true);
      setErreur("");

      if (maReactionUseful) {
        await supprimerReaction(id, "USEFUL");

        setReactions((anciennes) =>
          anciennes.filter((r) => r.id !== maReactionUseful.id)
        );
      } else {
        const nouvelle = await ajouterReaction(id, "USEFUL");

        setReactions((anciennes) => [...anciennes, nouvelle]);
      }
    } catch (error) {
      console.error("Erreur réaction :", error);
      setErreur("Impossible d'enregistrer votre réaction.");
    } finally {
      setEnvoiReaction(false);
    }
  }

  async function envoyerSignalement() {
    if (!id) return;

    try {
      setEnvoiSignalement(true);
      setErreurSignalement("");

      await signalerExperience(id, raisonSignalement, descriptionSignalement);

      setSignalementEnvoye(true);
    } catch (error) {
      console.error("Erreur signalement :", error);
      setErreurSignalement(
        "Impossible d'envoyer le signalement. Vous avez peut-être déjà signalé cette expérience."
      );
    } finally {
      setEnvoiSignalement(false);
    }
  }

  function fermerModaleSignalement() {
    setModaleSignalementOuverte(false);
    setSignalementEnvoye(false);
    setErreurSignalement("");
    setDescriptionSignalement("");
    setRaisonSignalement("SPAM");
  }

  const copierCode = () => {
    if (!experience?.code) return;
    navigator.clipboard.writeText(experience.code);
    setCopie(true);
    setTimeout(() => setCopie(false), 2000);
  };

  const nombreUseful = reactions.filter((r) => r.type === "USEFUL").length;

  /* ÉCRAN DE CHARGEMENT */
  if (chargement) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-8 sm:p-12 shadow-xl border border-blue-50 text-center max-w-md w-full">
          <div className="relative flex items-center justify-center mb-4">
            <div className="absolute h-16 w-16 animate-ping rounded-full bg-blue-100 opacity-75"></div>
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500/30">
              <Loader2 size={26} className="animate-spin" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-slate-900">CodeDoctor</h3>
          <p className="mt-1 text-sm text-slate-500">
            Chargement de la fiche technique...
          </p>
        </div>
      </div>
    );
  }

  /* EXPÉRIENCE INTROUVABLE */
  if (!id || !experience) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-16">
        <Card className="border-slate-200/80 bg-white p-8 sm:p-12 text-center shadow-lg rounded-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500 ring-8 ring-red-50/50">
            <AlertCircle size={32} />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-slate-900">
            Expérience introuvable
          </h1>

          <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
            {erreur ||
              "Cette publication a été retirée ou le lien que vous avez suivi est incorrect."}
          </p>

          <div className="mt-8">
            <Link
              to="/experiences"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5"
            >
              <ArrowLeft size={18} />
              Retourner aux expériences
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6 sm:py-10">
      {/* BOUTON RETOUR */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate("/experiences")}
          className="group inline-flex items-center gap-2.5 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm border border-slate-200/80 transition-all hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200"
        >
          <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
          <span>Retour au catalogue</span>
        </button>
      </div>

      {/* ERREUR GLOBALE */}
      {erreur && (
        <div className="rounded-2xl border border-red-200 bg-red-50/90 p-4 text-red-800 shadow-sm flex items-start gap-3">
          <AlertCircle size={20} className="mt-0.5 shrink-0 text-red-600" />
          <p className="text-sm font-medium leading-relaxed">{erreur}</p>
        </div>
      )}

      {/* EN-TÊTE PRINCIPAL DE L'EXPÉRIENCE */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 p-6 sm:p-10 text-white shadow-xl shadow-slate-900/10">
        {/* Cercles décoratifs en arrière-plan */}
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-lg bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300 ring-1 ring-inset ring-blue-500/30">
              {nomCategorie(experience.categorie)}
            </span>

            {experience.technologie && (
              <span className="inline-flex items-center rounded-lg bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300 ring-1 ring-inset ring-indigo-500/30">
                {experience.technologie}
              </span>
            )}
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl md:text-4xl leading-tight">
            {experience.titre}
          </h1>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 border-t border-slate-800 pt-6 text-xs sm:text-sm font-medium text-slate-300">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600/30 ring-1 ring-blue-400/30 text-blue-300 font-bold">
                <User size={15} />
              </div>
              <span>{experience.user.displayName || "Développeur CodeDoctor"}</span>
            </div>

            <div className="flex items-center gap-2 text-slate-400">
              <CalendarDays size={16} className="text-blue-400" />
              <span>{formaterDate(experience.createdAt)}</span>
            </div>

            <div className="flex items-center gap-2 text-slate-400">
              <MessageSquare size={16} className="text-blue-400" />
              <span>
                {experience._count.comments} commentaire
                {experience._count.comments > 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* RÉACTIONS + SIGNALEMENT */}
          <div className="flex flex-wrap items-center gap-3 border-t border-slate-800 pt-6">
            {utilisateur ? (
              <button
                type="button"
                onClick={() => void basculerReactionUtile()}
                disabled={envoiReaction}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  maReactionUseful
                    ? "border-blue-500 bg-blue-600 text-white"
                    : "border-slate-700 bg-slate-800/60 text-slate-200 hover:bg-slate-800"
                }`}
              >
                <ThumbsUp size={15} />
                {maReactionUseful ? "Utile" : "Marquer comme utile"}
                <span
                  className={
                    maReactionUseful ? "text-blue-100" : "text-slate-400"
                  }
                >
                  ({nombreUseful})
                </span>
              </button>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-sm font-medium text-slate-300">
                <ThumbsUp size={15} />
                {nombreUseful} personne{nombreUseful > 1 ? "s ont" : " a"} trouvé
                cela utile
              </span>
            )}

            {utilisateur && (
              <button
                type="button"
                onClick={() => setModaleSignalementOuverte(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-300"
              >
                <Flag size={15} />
                Signaler
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SECTION DU PROBLÈME ET DE LA CAUSE */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* PROBLÈME */}
        <Card className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 ring-4 ring-amber-50/50">
              <AlertCircle size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Problème rencontré
              </h2>
              <p className="text-xs text-slate-400">Symptômes et erreurs obtenues</p>
            </div>
          </div>

          <div className="mt-4 flex-1">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
              {experience.probleme}
            </p>
          </div>
        </Card>

        {/* CAUSE */}
        <Card className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-4 ring-blue-50/50">
              <BookOpen size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Origine du dysfonctionnement
              </h2>
              <p className="text-xs text-slate-400">Explication technique du bug</p>
            </div>
          </div>

          <div className="mt-4 flex-1">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
              {experience.cause}
            </p>
          </div>
        </Card>
      </div>

      {/* EXTRAIT DE CODE */}
      {experience.code && (
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/90 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-500/80"></span>
                <span className="h-3 w-3 rounded-full bg-amber-500/80"></span>
                <span className="h-3 w-3 rounded-full bg-green-500/80"></span>
              </div>
              <span className="h-4 w-px bg-slate-800"></span>
              <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
                <Code2 size={15} className="text-blue-400" />
                <span>snippet.{experience.technologie?.toLowerCase() || 'code'}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={copierCode}
              className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              {copie ? (
                <>
                  <Check size={14} className="text-emerald-400" />
                  <span className="text-emerald-400">Copié !</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copier</span>
                </>
              )}
            </button>
          </div>

          <div className="overflow-x-auto p-4 sm:p-6 text-slate-200">
            <pre className="font-mono text-xs sm:text-sm leading-relaxed tab-4">
              <code>{experience.code}</code>
            </pre>
          </div>
        </div>
      )}

      {/* SOLUTION */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-blue-600 via-blue-700 to-indigo-700 p-6 sm:p-8 text-white shadow-lg shadow-blue-600/20">
        <div className="flex items-center gap-3 border-b border-white/20 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md text-white ring-2 ring-white/20">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              Solution validée
            </h2>
            <p className="text-xs text-blue-100">Procédure recommandée pour résoudre le bug</p>
          </div>
        </div>

        <div className="mt-4">
          <p className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed text-blue-50 font-normal">
            {experience.solution}
          </p>
        </div>
      </div>

      {/* SECTION COMMENTAIRES */}
      <section className="pt-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
              Commentaires
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Posez des questions ou complétez cette expérience avec vos remarques.
            </p>
          </div>
        </div>

        <Card className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          {/* LISTE DES COMMENTAIRES */}
          <div className="space-y-4">
            {commentaires.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <MessageSquare size={26} />
                </div>
                <h3 className="mt-4 text-sm font-bold text-slate-800">
                  Pas encore de commentaires
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Soyez le premier développeur à réagir à ce cas technique.
                </p>
              </div>
            ) : (
              commentaires.map((item) => {
                const estMonCommentaire = utilisateur?.id === item.user.id;

                return (
                  <div
                    key={item.id}
                    className="group relative rounded-2xl border border-slate-100 bg-slate-50/60 p-4 sm:p-5 transition-all hover:bg-white hover:border-slate-200 hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-r from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-sm">
                          {(item.user.displayName || "U").charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            {item.user.displayName || "Utilisateur CodeDoctor"}
                            {estMonCommentaire && (
                              <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                                Vous
                              </span>
                            )}
                          </p>

                          <p className="text-[11px] font-medium text-slate-400">
                            {formaterDate(item.createdAt)}
                          </p>
                        </div>
                      </div>

                      {estMonCommentaire && (
                        <button
                          type="button"
                          onClick={() => void supprimerMonCommentaire(item.id)}
                          disabled={suppressionId === item.id}
                          className="rounded-xl p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                          title="Supprimer mon commentaire"
                        >
                          {suppressionId === item.id ? (
                            <Loader2 size={16} className="animate-spin text-red-600" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      )}
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap pl-1">
                      {item.contenu}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          {/* FORMULAIRE D'ENVOI OU INVITATION À LA CONNEXION */}
          {utilisateur ? (
            <form onSubmit={publierCommentaire} className="mt-8 border-t border-slate-100 pt-6">
              <label htmlFor="commentaire" className="block text-sm font-bold text-slate-800 mb-2">
                Ajouter une contribution
              </label>

              <div className="relative rounded-2xl border border-slate-200 bg-slate-50/30 transition-within focus-within:border-blue-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-600/10">
                <textarea
                  id="commentaire"
                  value={commentaire}
                  onChange={(event) => setCommentaire(event.target.value)}
                  maxLength={1000}
                  rows={4}
                  disabled={envoiCommentaire}
                  placeholder="Partagez un conseil complémentaire, posez une question..."
                  className="w-full resize-none bg-transparent p-4 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />

                <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 bg-white/50 rounded-b-2xl">
                  <span className="text-xs font-medium text-slate-400">
                    {commentaire.length} / 1000 caractères
                  </span>

                  <button
                    type="submit"
                    disabled={envoiCommentaire || !commentaire.trim()}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {envoiCommentaire ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Send size={16} />
                    )}
                    <span>Envoyer</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="mt-8 border-t border-slate-100 pt-6">
              <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-6 text-center">
                <p className="text-sm font-semibold text-slate-800">
                  Rejoignez la communauté pour participer
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Vous devez être connecté pour publier des remarques ou poser des questions.
                </p>

                <div className="mt-4">
                  <Link
                    to="/connexion"
                    className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition-all"
                  >
                    Se connecter
                  </Link>
                </div>
              </div>
            </div>
          )}
        </Card>
      </section>

      {/* MODALE SIGNALEMENT */}
      {modaleSignalementOuverte && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Signaler cette expérience
              </h2>
              <button
                type="button"
                onClick={fermerModaleSignalement}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            {signalementEnvoye ? (
              <div className="px-6 py-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600">
                  <CheckCircle2 size={22} />
                </div>
                <p className="mt-4 text-sm font-semibold text-slate-800">
                  Signalement envoyé
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Merci, notre équipe va l'examiner.
                </p>
                <button
                  type="button"
                  onClick={fermerModaleSignalement}
                  className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Fermer
                </button>
              </div>
            ) : (
              <div className="space-y-4 px-6 py-5">
                <div>
                  <label className="text-sm font-medium text-slate-800">
                    Raison
                  </label>
                  <select
                    value={raisonSignalement}
                    onChange={(event) =>
                      setRaisonSignalement(
                        event.target.value as RaisonSignalement
                      )
                    }
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                  >
                    {RAISONS_SIGNALEMENT.map((r) => (
                      <option key={r.valeur} value={r.valeur}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-800">
                    Détails (optionnel)
                  </label>
                  <textarea
                    value={descriptionSignalement}
                    onChange={(event) =>
                      setDescriptionSignalement(event.target.value)
                    }
                    rows={3}
                    placeholder="Ajoutez des précisions si nécessaire..."
                    className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                  />
                </div>

                {erreurSignalement && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3">
                    <p className="text-sm text-red-700">{erreurSignalement}</p>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={fermerModaleSignalement}
                    disabled={envoiSignalement}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={() => void envoyerSignalement()}
                    disabled={envoiSignalement}
                    className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {envoiSignalement ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : null}
                    Envoyer le signalement
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}