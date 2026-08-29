
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AlertCircle,
  BookOpen,
 
  Clock3,
  Loader2,
  MessageSquare,
  Trash2,
  
} from "lucide-react";
import { Link } from "react-router-dom";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

import {
  obtenirHistorique,
  supprimerHistorique,
} from "../../services/historique.service";

import type {
  Historique,
  CategorieHistorique,
  SeveriteHistorique,
} from "../../types/historique";

const CATEGORIES: {
  valeur: CategorieHistorique | "";
  label: string;
}[] = [
  {
    valeur: "",
    label: "Toutes les catégories",
  },
  {
    valeur: "JAVASCRIPT",
    label: "JavaScript",
  },
  {
    valeur: "TYPESCRIPT",
    label: "TypeScript",
  },
  {
    valeur: "REACT",
    label: "React",
  },
  {
    valeur: "HTTP",
    label: "HTTP",
  },
  {
    valeur: "API",
    label: "API",
  },
  {
    valeur: "HTML_CSS",
    label: "HTML / CSS",
  },
];

function libelleCategorie(
  categorie: CategorieHistorique
) {
  return (
    CATEGORIES.find(
      (item) => item.valeur === categorie
    )?.label ?? categorie
  );
}

function classeSeverite(
  severite: SeveriteHistorique | null
) {
  if (severite === "CRITIQUE") {
    return "danger" as const;
  }

  if (severite === "FAIBLE") {
    return "success" as const;
  }

  return "warning" as const;
}

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

export default function HistoriquePage() {
  const [historique, setHistorique] = useState<
    Historique[]
  >([]);

  const [categorie, setCategorie] =
    useState<CategorieHistorique | "">("");

  const [chargement, setChargement] =
    useState(true);

  const [erreur, setErreur] = useState("");

  const [suppressionId, setSuppressionId] =
    useState<string | null>(null);

  useEffect(() => {
    let actif = true;

    async function charger() {
      try {
        setChargement(true);
        setErreur("");

        const resultat = await obtenirHistorique();

        if (actif) {
          setHistorique(resultat.historique);
        }
      } catch (error) {
        console.error(
          "Erreur lors du chargement de l'historique :",
          error
        );

        if (actif) {
          setErreur(
            "Impossible de récupérer votre historique."
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

  const historiqueFiltre = useMemo(() => {
    if (!categorie) {
      return historique;
    }

    return historique.filter(
      (element) =>
        element.categorie === categorie
    );
  }, [historique, categorie]);

  async function supprimer(id: string) {
    const confirmer = window.confirm(
      "Voulez-vous vraiment supprimer cette entrée de votre historique ?"
    );

    if (!confirmer) {
      return;
    }

    try {
      setSuppressionId(id);
      setErreur("");

      await supprimerHistorique(id);

      setHistorique((anciens) =>
        anciens.filter(
          (element) => element.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Erreur lors de la suppression :",
        error
      );

      setErreur(
        "Impossible de supprimer cette entrée."
      );
    } finally {
      setSuppressionId(null);
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">
      <section>
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600">
          <Clock3 size={14} />
          Historique
        </div>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          Votre historique
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500 sm:text-base">
          Retrouvez les diagnostics et événements que
          vous avez enregistrés dans CodeDoctor.
        </p>
      </section>

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
              Filtrer
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              {historiqueFiltre.length} entrée
              {historiqueFiltre.length > 1
                ? "s"
                : ""}
            </p>
          </div>

          <select
            value={categorie}
            onChange={(event) =>
              setCategorie(
                event.target.value as
                  | CategorieHistorique
                  | ""
              )
            }
            className="
              h-11 w-full rounded-xl
              border border-zinc-200
              bg-white px-3
              text-sm text-zinc-700
              outline-none
              focus:border-zinc-900
              focus:ring-4
              focus:ring-zinc-900/5
              sm:w-64
            "
          >
            {CATEGORIES.map((item) => (
              <option
                key={item.valeur}
                value={item.valeur}
              >
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {erreur && (
        <Card className="border-red-200 bg-red-50 p-5">
          <div className="flex items-start gap-3">
            <AlertCircle
              size={19}
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
              Chargement de votre historique...
            </p>
          </div>
        </Card>
      ) : historiqueFiltre.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <BookOpen
              size={36}
              className="mx-auto text-zinc-300"
            />

            <h2 className="mt-4 text-sm font-semibold text-zinc-800">
              Aucun historique
            </h2>

            <p className="mt-1 text-xs leading-5 text-zinc-400">
              Vos diagnostics enregistrés apparaîtront
              ici.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {historiqueFiltre.map((element) => (
            <Card
              key={element.id}
              className="overflow-hidden"
            >
              <div className="p-5 sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge>
                        {libelleCategorie(
                          element.categorie
                        )}
                      </Badge>

                      {element.severite && (
                        <Badge
                          variant={classeSeverite(
                            element.severite
                          )}
                        >
                          {element.severite}
                        </Badge>
                      )}

                      {element.conversation && (
                        <Badge variant="success">
                          Conversation
                        </Badge>
                      )}
                    </div>

                    <h2 className="mt-3 text-lg font-semibold text-zinc-950">
                      {element.titre}
                    </h2>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-400">
                      <span>
                        {formaterDate(
                          element.createdAt
                        )}
                      </span>

                      {element.ruleId && (
                        <span>
                          Règle : {element.ruleId}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      void supprimer(element.id)
                    }
                    disabled={
                      suppressionId === element.id
                    }
                    className="
                      inline-flex shrink-0
                      items-center justify-center
                      gap-2 rounded-xl
                      border border-zinc-200
                      bg-white
                      px-4 py-2.5
                      text-sm font-medium
                      text-zinc-600
                      transition
                      hover:border-red-200
                      hover:bg-red-50
                      hover:text-red-600
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    {suppressionId ===
                    element.id ? (
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                    ) : (
                      <Trash2 size={16} />
                    )}

                    Supprimer
                  </button>
                </div>

                {element.extrait && (
                  <div className="mt-5 rounded-xl bg-zinc-50 p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                      Extrait
                    </p>

                    <pre className="max-h-40 overflow-auto whitespace-pre-wrap font-mono text-xs leading-5 text-zinc-600">
                      {element.extrait}
                    </pre>
                  </div>
                )}

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Link
                    to={`/historique/${element.id}`}
                    className="
                      inline-flex items-center gap-2
                      rounded-xl bg-zinc-950
                      px-4 py-2.5
                      text-sm font-medium text-white
                      transition hover:bg-zinc-800
                    "
                  >
                    Voir le détail
                  </Link>

                  {element.conversation && (
                    <Link
                      to={`/historique/conversations/${element.conversation.id}`}
                      className="
                        inline-flex items-center gap-2
                        rounded-xl
                        border border-zinc-200
                        bg-white
                        px-4 py-2.5
                        text-sm font-medium
                        text-zinc-700
                        transition
                        hover:bg-zinc-50
                      "
                    >
                      <MessageSquare size={16} />
                      Conversation
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
