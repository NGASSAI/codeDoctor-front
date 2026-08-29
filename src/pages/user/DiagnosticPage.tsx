import {
  useState,
  type FormEvent,
} from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Code2,
  Loader2,
  Search,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

import {
  analyserCode,
  type CategorieDiagnostic,
  type DiagnosticResultat,
} from "../../services/diagnostic.service";

const CATEGORIES: {
  valeur: CategorieDiagnostic;
  label: string;
}[] = [
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

function classeSeverite(severite: string) {
  if (severite === "CRITIQUE") {
    return "danger" as const;
  }

  if (severite === "FAIBLE") {
    return "success" as const;
  }

  return "warning" as const;
}

export default function DiagnosticPage() {
  const [code, setCode] = useState("");
  const [categorie, setCategorie] =
    useState<CategorieDiagnostic>("JAVASCRIPT");

  const [resultats, setResultats] = useState<
    DiagnosticResultat[]
  >([]);

  const [chargement, setChargement] =
    useState(false);

  const [erreur, setErreur] = useState("");

  const [analyseEffectuee, setAnalyseEffectuee] =
    useState(false);

  async function soumettre(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!code.trim()) {
      setErreur(
        "Collez d'abord le code que vous souhaitez analyser."
      );
      return;
    }

    try {
      setChargement(true);
      setErreur("");
      setAnalyseEffectuee(false);
      setResultats([]);

      const resultat = await analyserCode({
        code,
        categorie,
      });

      setResultats(resultat.resultats);
      setAnalyseEffectuee(true);
    } catch (error) {
      console.error(
        "Erreur lors du diagnostic :",
        error
      );

      setErreur(
        "Impossible d'effectuer le diagnostic."
      );
    } finally {
      setChargement(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">
      <section>
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600">
          <Code2 size={14} />
          Diagnostic CodeDoctor
        </div>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          Analysez votre code
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500 sm:text-base">
          CodeDoctor recherche d'abord les problèmes
          connus dans sa propre base de règles et vous
          explique directement comment les corriger.
        </p>
      </section>

      <Card className="p-5 sm:p-6">
        <form onSubmit={soumettre}>
          <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
            <div>
              <label
                htmlFor="categorie"
                className="text-sm font-medium text-zinc-800"
              >
                Langage / catégorie
              </label>

              <select
                id="categorie"
                value={categorie}
                onChange={(event) =>
                  setCategorie(
                    event.target.value as CategorieDiagnostic
                  )
                }
                disabled={chargement}
                className="
                  mt-2 h-11 w-full
                  rounded-xl
                  border border-zinc-200
                  bg-white
                  px-3
                  text-sm text-zinc-800
                  outline-none
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

            <div>
              <label
                htmlFor="code"
                className="text-sm font-medium text-zinc-800"
              >
                Code à analyser
              </label>

              <textarea
                id="code"
                value={code}
                onChange={(event) =>
                  setCode(event.target.value)
                }
                disabled={chargement}
                rows={16}
                placeholder="Collez votre code ici..."
                className="
                  mt-2 w-full
                  resize-y
                  rounded-xl
                  border border-zinc-200
                  bg-zinc-950
                  p-4
                  font-mono
                  text-sm
                  leading-6
                  text-zinc-100
                  outline-none
                  placeholder:text-zinc-500
                  focus:border-zinc-700
                  focus:ring-4
                  focus:ring-zinc-900/10
                "
              />
            </div>
          </div>

          {erreur && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-700">
                {erreur}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={
              chargement || !code.trim()
            }
            className="
              mt-5
              inline-flex w-full
              items-center justify-center
              gap-2
              rounded-xl
              bg-zinc-950
              px-5 py-3
              text-sm font-semibold
              text-white
              transition
              hover:bg-zinc-800
              disabled:cursor-not-allowed
              disabled:opacity-50
              sm:w-auto
            "
          >
            {chargement ? (
              <Loader2
                size={17}
                className="animate-spin"
              />
            ) : (
              <Search size={17} />
            )}

            {chargement
              ? "Analyse en cours..."
              : "Analyser le code"}
          </button>
        </form>
      </Card>

      {analyseEffectuee &&
        resultats.length === 0 && (
          <Card className="border-green-200 bg-green-50 p-6">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-white p-2.5 text-green-600">
                <CheckCircle2 size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-green-900">
                  Aucun problème connu détecté
                </h2>

                <p className="mt-1 text-sm leading-6 text-green-800">
                  CodeDoctor n'a trouvé aucune règle
                  correspondant à ce code dans sa base
                  de connaissances.
                </p>
              </div>
            </div>
          </Card>
        )}

      {resultats.length > 0 && (
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-zinc-950">
              Problèmes détectés
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              {resultats.length} problème
              {resultats.length > 1 ? "s" : ""} identifié
              {resultats.length > 1 ? "s" : ""}.
            </p>
          </div>

          {resultats.map((resultat) => (
            <Card
              key={resultat.regleId}
              className="overflow-hidden"
            >
              <div className="border-b border-zinc-100 p-5 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant={classeSeverite(
                          resultat.severite
                        )}
                      >
                        {resultat.severite}
                      </Badge>

                      <Badge>
                        {resultat.code}
                      </Badge>
                    </div>

                    <h3 className="mt-3 text-lg font-semibold text-zinc-950">
                      {resultat.titre}
                    </h3>
                  </div>

                  <AlertTriangle
                    size={20}
                    className="shrink-0 text-zinc-400"
                  />
                </div>
              </div>

              <div className="space-y-6 p-5 sm:p-6">
                <div>
                  <h4 className="text-sm font-semibold text-zinc-900">
                    Diagnostic
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    {resultat.explication}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-zinc-900">
                    Cause
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    {resultat.cause}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-zinc-900">
                    Comment le trouver
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    {resultat.commentTrouver}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-zinc-900">
                    Correction recommandée
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    {resultat.correction}
                  </p>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                      Avant
                    </p>

                    <pre className="overflow-x-auto rounded-xl bg-red-950 p-4 text-xs leading-5 text-red-100">
                      <code>{resultat.avant}</code>
                    </pre>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                      Après
                    </p>

                    <pre className="overflow-x-auto rounded-xl bg-green-950 p-4 text-xs leading-5 text-green-100">
                      <code>{resultat.apres}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </section>
      )}
    </div>
  );
}