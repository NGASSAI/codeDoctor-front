import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  ChevronRight,
  Filter,
  Loader2,
  Search,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import {
  obtenirExercices,
  type CategorieExercice,
  type Exercice,
} from "../../services/exercice.service";

const CATEGORIES: {
  valeur: CategorieExercice | "";
  label: string;
}[] = [
  { valeur: "", label: "Toutes les catégories" },
  { valeur: "JAVASCRIPT", label: "JavaScript" },
  { valeur: "TYPESCRIPT", label: "TypeScript" },
  { valeur: "REACT", label: "React" },
  { valeur: "HTTP", label: "HTTP" },
  { valeur: "API", label: "API" },
  { valeur: "HTML_CSS", label: "HTML / CSS" },
];

function libelleCategorie(categorie: string) {
  const categorieTrouvee = CATEGORIES.find(
    (item) => item.valeur === categorie
  );

  return categorieTrouvee?.label ?? categorie;
}

function classeDifficulte(difficulte: string) {
  const valeur = difficulte.toLowerCase();

  if (
    valeur === "facile" ||
    valeur === "easy"
  ) {
    return "success" as const;
  }

  if (
    valeur === "difficile" ||
    valeur === "hard"
  ) {
    return "danger" as const;
  }

  return "warning" as const;
}

function libelleDifficulte(difficulte: string) {
  const valeur = difficulte.toLowerCase();

  if (valeur === "easy") return "Facile";
  if (valeur === "medium") return "Moyen";
  if (valeur === "hard") return "Difficile";

  return difficulte;
}

export default function ExercicesPage() {
  const [exercices, setExercices] = useState<Exercice[]>(
    []
  );

  const [categorie, setCategorie] =
    useState<CategorieExercice | "">("");

  const [recherche, setRecherche] = useState("");

  const [chargement, setChargement] =
    useState(true);

  const [erreur, setErreur] = useState("");

  useEffect(() => {
    let actif = true;

    async function charger() {
      try {
        setChargement(true);
        setErreur("");

        const resultat = await obtenirExercices(
          categorie || undefined
        );

        if (actif) {
          setExercices(resultat.exercices);
        }
      } catch (error) {
        console.error(
          "Erreur lors du chargement des exercices :",
          error
        );

        if (actif) {
          setErreur(
            "Impossible de récupérer les exercices."
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
  }, [categorie]);

  const exercicesFiltres = useMemo(() => {
    const terme = recherche
      .trim()
      .toLowerCase();

    if (!terme) {
      return exercices;
    }

    return exercices.filter((exercice) => {
      return (
        exercice.title
          .toLowerCase()
          .includes(terme) ||
        exercice.category
          .toLowerCase()
          .includes(terme) ||
        exercice.difficulty
          .toLowerCase()
          .includes(terme)
      );
    });
  }, [exercices, recherche]);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* EN-TÊTE */}

      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            Exercices
          </h1>

          {!chargement && (
            <Badge>
              {exercices.length} exercice
              {exercices.length > 1 ? "s" : ""}
            </Badge>
          )}
        </div>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
          Entraînez-vous à identifier et corriger des
          problèmes de code. La correction est vérifiée
          directement par CodeDoctor.
        </p>
      </div>

      {/* FILTRES */}

      <Card className="p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_260px]">
          <div className="relative">
            <Search
              size={18}
              className="
                pointer-events-none
                absolute left-3.5 top-1/2
                -translate-y-1/2
                text-zinc-400
              "
            />

            <input
              type="search"
              value={recherche}
              onChange={(event) =>
                setRecherche(event.target.value)
              }
              placeholder="Rechercher un exercice..."
              className="
                h-11 w-full
                rounded-xl
                border border-zinc-200
                bg-white
                pl-10 pr-4
                text-sm text-zinc-900
                outline-none
                transition
                placeholder:text-zinc-400
                focus:border-zinc-900
                focus:ring-4
                focus:ring-zinc-900/5
              "
            />
          </div>

          <div className="relative">
            <Filter
              size={17}
              className="
                pointer-events-none
                absolute left-3.5 top-1/2
                -translate-y-1/2
                text-zinc-400
              "
            />

            <select
              value={categorie}
              onChange={(event) =>
                setCategorie(
                  event.target.value as
                    | CategorieExercice
                    | ""
                )
              }
              className="
                h-11 w-full
                appearance-none
                rounded-xl
                border border-zinc-200
                bg-white
                pl-10 pr-4
                text-sm text-zinc-700
                outline-none
                transition
                focus:border-zinc-900
                focus:ring-4
                focus:ring-zinc-900/5
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
        </div>
      </Card>

      {/* ERREUR */}

      {erreur && (
        <Card className="p-6">
          <div className="text-center">
            <p className="text-sm font-medium text-red-600">
              {erreur}
            </p>

            <button
              type="button"
              onClick={() => {
                setCategorie((ancienne) => ancienne);
              }}
              className="
                mt-3 rounded-lg
                bg-zinc-900
                px-4 py-2
                text-xs font-medium
                text-white
                hover:bg-zinc-800
              "
            >
              Réessayer
            </button>
          </div>
        </Card>
      )}

      {/* CHARGEMENT */}

      {chargement ? (
        <Card className="p-12">
          <div className="flex flex-col items-center text-center">
            <Loader2
              size={28}
              className="animate-spin text-zinc-400"
            />

            <p className="mt-4 text-sm font-medium text-zinc-700">
              Chargement des exercices...
            </p>

            <p className="mt-1 text-xs text-zinc-400">
              Récupération des exercices disponibles.
            </p>
          </div>
        </Card>
      ) : exercicesFiltres.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <BookOpen
              size={36}
              className="mx-auto text-zinc-300"
            />

            <h2 className="mt-4 text-sm font-semibold text-zinc-800">
              Aucun exercice trouvé
            </h2>

            <p className="mt-1 text-xs text-zinc-400">
              Essayez une autre recherche ou une autre
              catégorie.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {exercicesFiltres.map((exercice) => (
            <ExerciceCard
              key={exercice.id}
              exercice={exercice}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ExerciceCard({
  exercice,
}: {
  exercice: Exercice;
}) {
  return (
    <Card className="group flex h-full flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700">
          <BookOpen size={19} />
        </div>

        <Badge
          variant={classeDifficulte(
            exercice.difficulty
          )}
        >
          {libelleDifficulte(
            exercice.difficulty
          )}
        </Badge>
      </div>

      <div className="mt-5 flex-1">
        <p className="text-xs font-medium text-zinc-400">
          {libelleCategorie(exercice.category)}
        </p>

        <h2 className="mt-1.5 line-clamp-2 text-base font-semibold text-zinc-900">
          {exercice.title}
        </h2>

        <div className="mt-4 rounded-xl bg-zinc-50 p-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-400">
            Code à corriger
          </p>

          <pre className="mt-2 max-h-28 overflow-hidden whitespace-pre-wrap wrap-break-word font-mono text-xs leading-5 text-zinc-600">
            {exercice.buggyCode}
          </pre>
        </div>
      </div>

      <a
        href={`/dashboard/exercices/${exercice.id}`}
        className="
          mt-5
          inline-flex
          items-center
          justify-between
          rounded-xl
          bg-zinc-900
          px-4 py-3
          text-sm
          font-medium
          text-white
          transition
          hover:bg-zinc-800
        "
      >
        <span>Commencer l'exercice</span>

        <ChevronRight
          size={17}
          className="transition-transform group-hover:translate-x-0.5"
        />
      </a>
    </Card>
  );
}