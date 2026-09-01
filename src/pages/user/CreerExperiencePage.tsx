import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Send } from "lucide-react";

import Card from "../../components/ui/Card";
import { creerExperience } from "../../services/experience.service";
import type { CategorieExperience } from "../../types/experience";

const CATEGORIES: { valeur: CategorieExperience; label: string }[] = [
  { valeur: "JAVASCRIPT", label: "JavaScript" },
  { valeur: "TYPESCRIPT", label: "TypeScript" },
  { valeur: "REACT", label: "React" },
  { valeur: "HTTP", label: "HTTP" },
  { valeur: "API", label: "API" },
  { valeur: "HTML_CSS", label: "HTML / CSS" },
];

export default function CreerExperiencePage() {
  const navigate = useNavigate();

  const [titre, setTitre] = useState("");
  const [probleme, setProbleme] = useState("");
  const [code, setCode] = useState("");
  const [cause, setCause] = useState("");
  const [solution, setSolution] = useState("");
  const [technologie, setTechnologie] = useState("");
  const [categorie, setCategorie] =
    useState<CategorieExperience>("JAVASCRIPT");

  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");

  async function soumettre(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!titre.trim() || !probleme.trim() || !cause.trim() || !solution.trim()) {
      setErreur("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    try {
      setEnvoi(true);
      setErreur("");

      const resultat = await creerExperience({
        titre: titre.trim(),
        probleme: probleme.trim(),
        code: code.trim() || undefined,
        cause: cause.trim(),
        solution: solution.trim(),
        technologie: technologie.trim() || undefined,
        categorie,
      });

      navigate(`/experiences/${resultat.experience.id}`);
    } catch (error) {
      console.error("Erreur création expérience :", error);
      setErreur(
        "Impossible de publier votre expérience. Vérifiez les champs et réessayez."
      );
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-800"
      >
        <ArrowLeft size={17} />
        Retour
      </button>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-blue-950 sm:text-3xl">
          Partager une expérience
        </h1>
        <p className="mt-2 text-sm leading-6 text-blue-700/70">
          Décrivez un problème que vous avez rencontré, sa cause et la solution
          que vous avez trouvée. Votre expérience aidera d'autres développeurs.
        </p>
      </div>

      <Card className="border-blue-100 p-5 sm:p-6">
        <form onSubmit={soumettre} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-blue-900">
              Titre *
            </label>
            <input
              type="text"
              value={titre}
              onChange={(event) => setTitre(event.target.value)}
              placeholder="Ex: Erreur 'Cannot read property of undefined' avec useEffect"
              className="mt-2 h-11 w-full rounded-xl border border-blue-200 bg-white px-3 text-sm text-blue-950 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-blue-900">
                Catégorie *
              </label>
              <select
                value={categorie}
                onChange={(event) =>
                  setCategorie(event.target.value as CategorieExperience)
                }
                className="mt-2 h-11 w-full rounded-xl border border-blue-200 bg-white px-3 text-sm text-blue-950 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
              >
                {CATEGORIES.map((item) => (
                  <option key={item.valeur} value={item.valeur}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-blue-900">
                Technologie (optionnel)
              </label>
              <input
                type="text"
                value={technologie}
                onChange={(event) => setTechnologie(event.target.value)}
                placeholder="Ex: React 18, Express, Prisma"
                className="mt-2 h-11 w-full rounded-xl border border-blue-200 bg-white px-3 text-sm text-blue-950 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-blue-900">
              Description du problème *
            </label>
            <textarea
              value={probleme}
              onChange={(event) => setProbleme(event.target.value)}
              rows={4}
              placeholder="Décrivez le problème rencontré..."
              className="mt-2 w-full resize-y rounded-xl border border-blue-200 bg-white p-3 text-sm text-blue-950 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-blue-900">
              Code concerné (optionnel)
            </label>
            <textarea
              value={code}
              onChange={(event) => setCode(event.target.value)}
              rows={6}
              placeholder="Collez le code lié au problème..."
              className="mt-2 w-full resize-y rounded-xl border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs leading-5 text-zinc-100 outline-none focus:border-zinc-700 focus:ring-4 focus:ring-zinc-900/10"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-blue-900">
              Cause identifiée *
            </label>
            <textarea
              value={cause}
              onChange={(event) => setCause(event.target.value)}
              rows={3}
              placeholder="Qu'est-ce qui causait ce problème ?"
              className="mt-2 w-full resize-y rounded-xl border border-blue-200 bg-white p-3 text-sm text-blue-950 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-blue-900">
              Solution apportée *
            </label>
            <textarea
              value={solution}
              onChange={(event) => setSolution(event.target.value)}
              rows={4}
              placeholder="Comment avez-vous résolu ce problème ?"
              className="mt-2 w-full resize-y rounded-xl border border-blue-200 bg-white p-3 text-sm text-blue-950 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
            />
          </div>

          {erreur && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3">
              <p className="text-sm text-red-700">{erreur}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={envoi}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-cyan-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:from-blue-700 hover:to-cyan-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {envoi ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <Send size={17} />
            )}
            Publier l'expérience
          </button>
        </form>
      </Card>
    </div>
  );
}