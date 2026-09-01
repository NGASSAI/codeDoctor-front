import { useEffect, useState, type FormEvent } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Code2,
  Info,
  Loader2,
  Search,
  Sparkles,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import HelpButton from "../../components/ui/HelpButton";

import {
  analyserCode,
  obtenirCapacites,
  type CapaciteDiagnostic,
  type CategorieDiagnostic,
  type DiagnosticResultat,
} from "../../services/diagnostic.service";

import {
  analyserCodeIA,
  obtenirQuotaIA,
  type QuotaIA,
} from "../../services/ia.service";

const CATEGORIES: { valeur: CategorieDiagnostic; label: string }[] = [
  { valeur: "JAVASCRIPT", label: "JavaScript" },
  { valeur: "TYPESCRIPT", label: "TypeScript" },
  { valeur: "REACT", label: "React" },
  { valeur: "HTTP", label: "HTTP" },
  { valeur: "API", label: "API" },
  { valeur: "HTML_CSS", label: "HTML / CSS" },
];

function classeSeverite(severite: string) {
  if (severite === "CRITIQUE") return "danger" as const;
  if (severite === "FAIBLE") return "success" as const;
  return "warning" as const;
}

export default function DiagnosticPage() {
  const [code, setCode] = useState("");
  const [categorie, setCategorie] = useState<CategorieDiagnostic>("JAVASCRIPT");
  const [messageErreur, setMessageErreur] = useState("");

  const [resultats, setResultats] = useState<DiagnosticResultat[]>([]);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState("");
  const [analyseEffectuee, setAnalyseEffectuee] = useState(false);

  const [quota, setQuota] = useState<QuotaIA | null>(null);
  const [iaChargement, setIaChargement] = useState(false);
  const [iaResultat, setIaResultat] = useState<string | null>(null);
  const [iaErreur, setIaErreur] = useState("");

  const [capacites, setCapacites] = useState<CapaciteDiagnostic[]>([]);
  const [capacitesOuvertes, setCapacitesOuvertes] = useState(false);

  useEffect(() => {
    let actif = true;

    async function chargerQuota() {
      try {
        const resultat = await obtenirQuotaIA();
        if (actif) setQuota(resultat);
      } catch (error) {
        console.error("Erreur chargement quota IA :", error);
      }
    }

    void chargerQuota();

    return () => {
      actif = false;
    };
  }, []);

  useEffect(() => {
    let actif = true;

    async function chargerCapacites() {
      try {
        const resultat = await obtenirCapacites(categorie);
        if (actif) setCapacites(resultat);
      } catch (error) {
        console.error("Erreur chargement capacités :", error);
        if (actif) setCapacites([]);
      }
    }

    void chargerCapacites();

    return () => {
      actif = false;
    };
  }, [categorie]);

  async function soumettre(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!code.trim()) {
      setErreur("Collez d'abord le code que vous souhaitez analyser.");
      return;
    }

    try {
      setChargement(true);
      setErreur("");
      setAnalyseEffectuee(false);
      setResultats([]);

      const resultat = await analyserCode({ code, categorie });

      setResultats(resultat.resultats);
      setAnalyseEffectuee(true);
    } catch (error) {
      console.error("Erreur lors du diagnostic :", error);
      setErreur("Impossible d'effectuer le diagnostic.");
    } finally {
      setChargement(false);
    }
  }

  async function lancerAnalyseIA() {
    if (!code.trim()) {
      setIaErreur("Collez d'abord le code que vous souhaitez analyser.");
      return;
    }

    const langageLabel =
      CATEGORIES.find((item) => item.valeur === categorie)?.label ?? categorie;

    try {
      setIaChargement(true);
      setIaErreur("");
      setIaResultat(null);

      const resultat = await analyserCodeIA({
        code,
        langage: langageLabel,
        erreur: messageErreur.trim() || undefined,
      });

      setIaResultat(resultat.analyse);
      setQuota(resultat.quota);
    } catch (error) {
      console.error("Erreur lors de l'analyse IA :", error);

      const reponse = (
        error as { response?: { status?: number; data?: { quota?: QuotaIA } } }
      )?.response;

      if (reponse?.status === 429 && reponse.data?.quota) {
        setQuota(reponse.data.quota as QuotaIA);
      }

      const messageErreurIA =
        (error as { message?: string })?.message ??
        "Impossible d'effectuer l'analyse IA.";

      setIaErreur(messageErreurIA);
    } finally {
      setIaChargement(false);
    }
  }

  const quotaAtteint =
    quota !== null && !quota.illimite && (quota.restant ?? 0) <= 0;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">
      <section>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
              <Code2 size={14} />
              Diagnostic CodeDoctor
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-blue-950 sm:text-4xl">
              Analysez votre code
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-700/70 sm:text-base">
              CodeDoctor recherche d'abord les problèmes connus dans sa propre base de règles et vous explique directement comment les corriger.
            </p>
          </div>

          <HelpButton
            title="Aide – Diagnostic"
            description="Cette page sert à détecter les erreurs de code et à comprendre leur cause avant de corriger le projet."
            items={[
              "Choisissez la catégorie du code pour cibler les règles de détection adaptées.",
              "Collez un extrait de code et lancez l'analyse pour voir les erreurs détectées.",
              "Ajoutez le message d'erreur si vous avez l'exception exacte pour améliorer la précision de l'IA.",
              "Utilisez l'analyse IA comme second avis avant d'appliquer une correction en production.",
              "Chaque résultat explique la cause, la correction recommandée et un exemple avant/après."
            ]}
          />
        </div>
      </section>

      <Card className="border-blue-100 p-5 sm:p-6">
        <form onSubmit={soumettre}>
          <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
            <div>
              <label htmlFor="categorie" className="text-sm font-medium text-blue-900">
                Langage / catégorie
              </label>

              <select
                id="categorie"
                value={categorie}
                onChange={(event) =>
                  setCategorie(event.target.value as CategorieDiagnostic)
                }
                disabled={chargement}
                className="mt-2 h-11 w-full rounded-xl border border-blue-200 bg-white px-3 text-sm text-blue-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
              >
                {CATEGORIES.map((item) => (
                  <option key={item.valeur} value={item.valeur}>
                    {item.label}
                  </option>
                ))}
              </select>

              {/* Encart : ce que cette catégorie détecte sans IA */}
              <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                <button
                  type="button"
                  onClick={() => setCapacitesOuvertes((v) => !v)}
                  className="flex w-full items-center justify-between gap-2 text-left"
                >
                  <span className="flex items-center gap-2 text-xs font-semibold text-blue-900">
                    <Info size={14} />
                    Sans IA, cette catégorie détecte automatiquement
                  </span>
                  <span className="text-xs font-medium text-blue-500">
                    {capacitesOuvertes ? "Masquer" : "Voir"}
                  </span>
                </button>

                {capacitesOuvertes && (
                  <div className="mt-3">
                    {capacites.length === 0 ? (
                      <p className="text-xs text-blue-600">
                        Aucune règle spécifique enregistrée pour cette catégorie pour le moment. Utilisez l'analyse IA.
                      </p>
                    ) : (
                      <ul className="space-y-1.5">
                        {capacites.map((c) => (
                          <li
                            key={c.code}
                            className="flex items-start gap-2 text-xs text-blue-700/80"
                          >
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                            {c.titre}
                          </li>
                        ))}
                      </ul>
                    )}

                    <p className="mt-3 border-t border-blue-100 pt-3 text-xs leading-5 text-blue-500">
                      Toute autre erreur (logique métier, contexte spécifique, bugs complexes) ne sera pas détectée ici — utilisez l'analyse IA pour un second avis.
                    </p>
                  </div>
                )}
              </div>

              <label
                htmlFor="messageErreur"
                className="mt-4 block text-sm font-medium text-blue-900"
              >
                Message d'erreur (optionnel)
              </label>

              <textarea
                id="messageErreur"
                value={messageErreur}
                onChange={(event) => setMessageErreur(event.target.value)}
                disabled={chargement || iaChargement}
                rows={3}
                placeholder="Collez ici le message d'erreur si vous en avez un..."
                className="mt-2 w-full resize-y rounded-xl border border-blue-200 bg-white p-3 text-sm text-blue-900 outline-none placeholder:text-blue-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
              />

              <p className="mt-2 text-xs leading-5 text-blue-600">
                Utilisé uniquement par l'analyse IA, pour affiner sa réponse.
              </p>
            </div>

            <div>
              <label htmlFor="code" className="text-sm font-medium text-blue-900">
                Code à analyser
              </label>

              <textarea
                id="code"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                disabled={chargement}
                rows={16}
                placeholder="Collez votre code ici..."
                className="mt-2 w-full resize-y rounded-xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-sm leading-6 text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-zinc-700 focus:ring-4 focus:ring-zinc-900/10"
              />
            </div>
          </div>

          {erreur && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-700">{erreur}</p>
            </div>
          )}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <button
              type="submit"
              disabled={chargement || !code.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {chargement ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <Search size={17} />
              )}
              {chargement ? "Analyse en cours..." : "Analyser le code"}
            </button>

            <button
              type="button"
              onClick={() => void lancerAnalyseIA()}
              disabled={iaChargement || !code.trim() || quotaAtteint}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-300 bg-white px-5 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
              title={quotaAtteint ? "Quota IA quotidien atteint" : undefined}
            >
              {iaChargement ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <Sparkles size={17} />
              )}
              {iaChargement ? "Analyse IA en cours..." : "Analyse IA (en plus)"}
            </button>

            {quota && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
                {quota.illimite
                  ? "IA illimitée (admin)"
                  : `IA : ${quota.utilise}/${quota.limite} aujourd'hui${
                      quota.plan === "PREMIUM" ? " (Premium)" : ""
                    }`}
              </span>
            )}
          </div>

          {quotaAtteint && quota?.plan === "FREE" && (
            <p className="mt-3 text-xs leading-5 text-blue-600">
              Quota IA quotidien atteint. Passez à Premium pour augmenter votre limite quotidienne.
            </p>
          )}
        </form>
      </Card>

      {iaErreur && (
        <Card className="border-red-200 bg-red-50 p-5">
          <p className="text-sm text-red-700">{iaErreur}</p>
        </Card>
      )}

      {iaResultat && (
        <Card className="border-blue-200 bg-blue-50/40 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-blue-600 p-2.5 text-white shadow-md shadow-blue-500/20">
              <Sparkles size={18} />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-base font-bold text-blue-950">Analyse IA</h2>
              <p className="mt-1 text-xs text-blue-600">
                Réponse générée par IA — à vérifier avant application.
              </p>

              <div className="mt-4 whitespace-pre-wrap rounded-xl border border-blue-100 bg-white p-4 text-sm leading-6 text-blue-900">
                {iaResultat}
              </div>
            </div>
          </div>
        </Card>
      )}

      {analyseEffectuee && resultats.length === 0 && (
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
                CodeDoctor n'a trouvé aucune règle correspondant à ce code dans sa base de connaissances (voir la liste des détections disponibles ci-dessus). Essayez l'analyse IA pour un second avis.
              </p>
            </div>
          </div>
        </Card>
      )}

      {resultats.length > 0 && (
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-blue-950">Problèmes détectés</h2>
            <p className="mt-1 text-sm text-blue-700/70">
              {resultats.length} problème{resultats.length > 1 ? "s" : ""} identifié
              {resultats.length > 1 ? "s" : ""}.
            </p>
          </div>

          {resultats.map((resultat) => (
            <Card key={resultat.regleId} className="overflow-hidden border-blue-100">
              <div className="border-b border-blue-100 p-5 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={classeSeverite(resultat.severite)}>
                        {resultat.severite}
                      </Badge>
                      <Badge>{resultat.code}</Badge>
                    </div>

                    <h3 className="mt-3 text-lg font-semibold text-blue-950">
                      {resultat.titre}
                    </h3>
                  </div>

                  <AlertTriangle size={20} className="shrink-0 text-blue-300" />
                </div>
              </div>

              <div className="space-y-6 p-5 sm:p-6">
                <div>
                  <h4 className="text-sm font-semibold text-blue-900">Diagnostic</h4>
                  <p className="mt-2 text-sm leading-6 text-blue-700/80">
                    {resultat.explication}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-blue-900">Cause</h4>
                  <p className="mt-2 text-sm leading-6 text-blue-700/80">
                    {resultat.cause}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-blue-900">
                    Comment le trouver
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-blue-700/80">
                    {resultat.commentTrouver}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-blue-900">
                    Correction recommandée
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-blue-700/80">
                    {resultat.correction}
                  </p>
                </div>
{/* ------------------------------------------------------------------------ */}
                        {(resultat.avant || resultat.apres) && (
  <div className="grid gap-4 lg:grid-cols-2">
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-400">
        Avant
      </p>
      <pre className="overflow-x-auto rounded-xl bg-red-950 p-4 text-xs leading-5 text-red-100">
        <code>{resultat.avant}</code>
      </pre>
    </div>

    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-400">
        Après
      </p>
      <pre className="overflow-x-auto rounded-xl bg-green-950 p-4 text-xs leading-5 text-green-100">
        <code>{resultat.apres}</code>
      </pre>
    </div>
  </div>
)}
                {/* ------------------------------------- */}
              </div>
            </Card>
          ))}
        </section>
      )}
    </div>
  );
}