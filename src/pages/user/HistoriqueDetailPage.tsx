
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  MessageSquare,
} from "lucide-react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  useEffect,
  useState,
} from "react";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

import {
  creerConversation,
  obtenirHistoriqueDetail,
} from "../../services/historique.service";

import type {
  HistoriqueDetail,
} from "../../types/historique";

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

function classeSeverite(
  severite: HistoriqueDetail["severite"]
) {
  if (severite === "CRITIQUE") {
    return "danger" as const;
  }

  if (severite === "FAIBLE") {
    return "success" as const;
  }

  return "warning" as const;
}

export default function HistoriqueDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [historique, setHistorique] =
    useState<HistoriqueDetail | null>(null);

  const [chargement, setChargement] =
    useState(true);

  const [creationConversation, setCreationConversation] =
    useState(false);

  const [erreur, setErreur] = useState("");

  const [titreConversation, setTitreConversation] =
    useState("");

  useEffect(() => {
    if (!id) {
      return;
    }

    const historiqueId = id;
    let actif = true;

    async function charger() {
      try {
        setChargement(true);
        setErreur("");

        const resultat =
          await obtenirHistoriqueDetail(
            historiqueId
          );

        if (!actif) {
          return;
        }

        setHistorique(resultat.historique);
      } catch (error) {
        console.error(
          "Erreur chargement détail historique :",
          error
        );

        if (actif) {
          setErreur(
            "Impossible de récupérer cette entrée d'historique."
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

  async function creerNouvelleConversation() {
    if (!id || historique?.conversation) {
      return;
    }

    try {
      setCreationConversation(true);
      setErreur("");

      const conversation =
        await creerConversation(
          id,
          titreConversation.trim() || undefined
        );
setHistorique((ancien) =>
  ancien
    ? {
        ...ancien,
        conversation,
      }
    : ancien
);

      setTitreConversation("");
    } catch (error) {
      console.error(
        "Erreur création conversation :",
        error
      );

      setErreur(
        "Impossible de créer la conversation."
      );
    } finally {
      setCreationConversation(false);
    }
  }

  if (chargement) {
    return (
      <div className="mx-auto w-full max-w-5xl">
        <Card className="p-12">
          <div className="flex flex-col items-center text-center">
            <Loader2
              size={30}
              className="animate-spin text-zinc-400"
            />

            <p className="mt-4 text-sm font-medium text-zinc-700">
              Chargement de l'historique...
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (!id || !historique) {
    return (
      <div className="mx-auto w-full max-w-5xl">
        <Card className="p-10 text-center">
          <AlertCircle
            size={36}
            className="mx-auto text-red-400"
          />

          <h1 className="mt-4 text-lg font-semibold text-zinc-900">
            Entrée introuvable
          </h1>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            {erreur ||
              "Cette entrée d'historique n'existe pas ou n'est plus disponible."}
          </p>

          <Link
            to="/historique"
            className="
              mt-5 inline-flex items-center gap-2
              rounded-xl bg-zinc-950
              px-4 py-2.5
              text-sm font-medium text-white
              transition hover:bg-zinc-800
            "
          >
            <ArrowLeft size={16} />
            Retour à l'historique
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <button
        type="button"
        onClick={() => navigate("/historique")}
        className="
          inline-flex items-center gap-2
          text-sm font-medium
          text-zinc-500
          transition hover:text-zinc-950
        "
      >
        <ArrowLeft size={17} />
        Retour à l'historique
      </button>

      {erreur && (
        <Card className="border-red-200 bg-red-50 p-5">
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

      {/* En-tête */}

      <Card className="p-6 sm:p-8">
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>
              {libelleCategorie(
                historique.categorie
              )}
            </Badge>

            {historique.severite && (
              <Badge
                variant={classeSeverite(
                  historique.severite
                )}
              >
                {historique.severite}
              </Badge>
            )}

            {historique.conversation && (
              <Badge variant="success">
                Conversation disponible
              </Badge>
            )}
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
              {historique.titre}
            </h1>

            <div className="mt-4 flex flex-wrap gap-4 text-xs text-zinc-400">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={14} />
                {formaterDate(
                  historique.createdAt
                )}
              </span>

              {historique.ruleId && (
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 size={14} />
                  Règle : {historique.ruleId}
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Extrait */}

      {historique.extrait && (
        <Card className="overflow-hidden">
          <div className="border-b border-zinc-100 px-5 py-4 sm:px-6">
            <h2 className="text-sm font-semibold text-zinc-950">
              Extrait du diagnostic
            </h2>

            <p className="mt-1 text-xs text-zinc-400">
              Contenu enregistré dans votre historique.
            </p>
          </div>

          <div className="overflow-x-auto bg-zinc-950 p-5 sm:p-6">
            <pre className="whitespace-pre-wrap wrap-break-word font-mono text-sm leading-6 text-zinc-200">
              {historique.extrait}
            </pre>
          </div>
        </Card>
      )}

      {/* Conversation */}

      <Card className="p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-950 text-white">
            <MessageSquare size={18} />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold text-zinc-950">
              Conversation
            </h2>

            <p className="mt-1 text-sm leading-6 text-zinc-500">
              Continuez votre analyse dans une
              conversation liée à cette entrée.
            </p>

            {historique.conversation ? (
              <div className="mt-5 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-zinc-400">
                      Conversation
                    </p>

                    <p className="mt-1 text-sm font-semibold text-zinc-900">
                      {historique.conversation.title}
                    </p>

                    <p className="mt-1 text-xs text-zinc-400">
                      Créée le{" "}
                      {formaterDate(
                        historique.conversation.createdAt
                      )}
                    </p>
                  </div>

                  <Link
                    to={`/historique/conversations/${historique.conversation.id}`}
                    className="
                      inline-flex items-center
                      justify-center gap-2
                      rounded-xl bg-zinc-950
                      px-4 py-2.5
                      text-sm font-medium
                      text-white
                      transition hover:bg-zinc-800
                    "
                  >
                    Ouvrir la conversation
                    <MessageSquare size={15} />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-dashed border-zinc-200 bg-zinc-50 p-4">
                <p className="text-sm font-medium text-zinc-800">
                  Aucune conversation associée
                </p>

                <p className="mt-1 text-xs leading-5 text-zinc-400">
                  Vous pouvez créer une conversation
                  liée à ce diagnostic.
                </p>

                <input
                  type="text"
                  value={titreConversation}
                  onChange={(event) =>
                    setTitreConversation(
                      event.target.value
                    )
                  }
                  maxLength={100}
                  placeholder="Titre de la conversation (facultatif)"
                  className="
                    mt-4 h-11 w-full rounded-xl
                    border border-zinc-200
                    bg-white px-3
                    text-sm text-zinc-900
                    outline-none
                    placeholder:text-zinc-400
                    focus:border-zinc-900
                    focus:ring-4
                    focus:ring-zinc-900/5
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    void creerNouvelleConversation()
                  }
                  disabled={creationConversation}
                  className="
                    mt-3 inline-flex
                    items-center justify-center
                    gap-2 rounded-xl
                    bg-zinc-950
                    px-4 py-2.5
                    text-sm font-medium
                    text-white
                    transition
                    hover:bg-zinc-800
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {creationConversation ? (
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />
                  ) : (
                    <MessageSquare size={15} />
                  )}

                  Créer une conversation
                </button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Résumé */}

      <Card className="border-green-200 bg-green-50 p-6">
        <div className="flex items-start gap-3">
          <CheckCircle2
            size={20}
            className="mt-0.5 shrink-0 text-green-600"
          />

          <div>
            <h2 className="text-sm font-semibold text-green-900">
              Entrée enregistrée
            </h2>

            <p className="mt-1 text-sm leading-6 text-green-800">
              Cette analyse fait partie de votre
              historique personnel CodeDoctor.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
