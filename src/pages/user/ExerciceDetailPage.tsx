
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Eye,
  EyeOff,
  Lightbulb,
  Loader2,
  Send,
  XCircle,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

import {
  obtenirExercice,
  obtenirIndice,
  tenterExercice,
} from "../../services/exercice.service";

import type { Exercice } from "../../services/exercice.service";

export default function ExerciceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [exercice, setExercice] =
    useState<Exercice | null>(null);

  const [reponse, setReponse] = useState("");

  const [indiceActuel, setIndiceActuel] =
    useState<number | null>(null);

  const [indices, setIndices] = useState<
    Record<number, string>
  >({});

  const [chargement, setChargement] =
    useState(true);

  const [chargementIndice, setChargementIndice] =
    useState(false);

  const [soumission, setSoumission] =
    useState(false);

  const [erreur, setErreur] = useState("");

  const [resultat, setResultat] = useState<{
    correct: boolean;
    progression: unknown;
  } | null>(null);

 useEffect(() => {
  if (!id) {
    return;
  }

  const exerciceId = id;
  let actif = true;

  async function charger() {
    try {
      setChargement(true);
      setErreur("");

      const resultatExercice =
        await obtenirExercice(exerciceId);

      if (actif) {
        setExercice(resultatExercice);
      }
    } catch (error) {
      console.error(
        "Erreur lors du chargement de l'exercice :",
        error
      );

      if (actif) {
        setErreur(
          "Impossible de récupérer cet exercice."
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

  async function demanderIndice(numero: number) {
    if (!id) {
      setErreur("Exercice invalide.");
      return;
    }

    if (indices[numero]) {
      setIndiceActuel(numero);
      return;
    }

    try {
      setChargementIndice(true);
      setErreur("");
      setIndiceActuel(numero);

      const resultatIndice =
        await obtenirIndice(id, numero);

      setIndices((anciens) => ({
        ...anciens,
        [numero]: resultatIndice.indice,
      }));
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de l'indice :",
        error
      );

      setErreur(
        "Impossible de récupérer cet indice."
      );
    } finally {
      setChargementIndice(false);
    }
  }

  async function soumettre(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!id || !reponse.trim()) {
      return;
    }

    try {
      setSoumission(true);
      setErreur("");
      setResultat(null);

      const resultatTentative =
        await tenterExercice(
          id,
          reponse,
          Object.keys(indices).length
        );

      setResultat({
        correct: resultatTentative.correct,
        progression:
          resultatTentative.progression,
      });
    } catch (error) {
      console.error(
        "Erreur lors de la soumission :",
        error
      );

      setErreur(
        "Impossible d'enregistrer votre réponse."
      );
    } finally {
      setSoumission(false);
    }
  }

  if (chargement) {
    return (
      <div className="mx-auto max-w-5xl">
        <Card className="p-12">
          <div className="flex flex-col items-center text-center">
            <Loader2
              size={30}
              className="animate-spin text-zinc-400"
            />

            <p className="mt-4 text-sm font-medium text-zinc-700">
              Chargement de l'exercice...
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (!id) {
    return (
      <div className="mx-auto max-w-5xl">
        <Card className="p-10 text-center">
          <XCircle
            size={36}
            className="mx-auto text-red-400"
          />

          <h1 className="mt-4 text-lg font-semibold text-zinc-900">
            Exercice invalide
          </h1>

          <p className="mt-1 text-sm text-zinc-500">
            Aucun identifiant d'exercice valide n'a été fourni.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/exercices")
            }
            className="
              mt-5 inline-flex items-center gap-2
              rounded-xl bg-zinc-900
              px-4 py-2.5
              text-sm font-medium text-white
              hover:bg-zinc-800
            "
          >
            <ArrowLeft size={16} />
            Retour aux exercices
          </button>
        </Card>
      </div>
    );
  }

  if (!exercice) {
    return (
      <div className="mx-auto max-w-5xl">
        <Card className="p-10 text-center">
          <XCircle
            size={36}
            className="mx-auto text-red-400"
          />

          <h1 className="mt-4 text-lg font-semibold text-zinc-900">
            Exercice introuvable
          </h1>

          <p className="mt-1 text-sm text-zinc-500">
            {erreur ||
              "Cet exercice n'existe pas ou n'est plus disponible."}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/exercices")
            }
            className="
              mt-5 inline-flex items-center gap-2
              rounded-xl bg-zinc-900
              px-4 py-2.5
              text-sm font-medium text-white
              hover:bg-zinc-800
            "
          >
            <ArrowLeft size={16} />
            Retour aux exercices
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* RETOUR */}

      <button
        type="button"
        onClick={() =>
          navigate("/exercices")
        }
        className="
          inline-flex items-center gap-2
          text-sm font-medium
          text-zinc-500
          transition
          hover:text-zinc-900
        "
      >
        <ArrowLeft size={17} />
        Retour aux exercices
      </button>

      {/* EN-TÊTE */}

      <Card className="p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              {exercice.category}
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
              {exercice.title}
            </h1>
          </div>

          <Badge variant="warning">
            {exercice.difficulty}
          </Badge>
        </div>

        <div className="mt-5 flex items-center gap-2 text-xs text-zinc-400">
          <Clock3 size={14} />
          Analysez le code puis proposez votre correction.
        </div>
      </Card>

      {/* CODE À CORRIGER */}

      <Card className="overflow-hidden">
        <div className="border-b border-zinc-100 px-5 py-4 sm:px-6">
          <h2 className="text-sm font-semibold text-zinc-900">
            Code à corriger
          </h2>

          <p className="mt-1 text-xs text-zinc-400">
            Identifiez le problème avant de proposer votre
            correction.
          </p>
        </div>

        <div className="overflow-x-auto bg-zinc-950 p-5 sm:p-6">
          <pre className="min-w-full whitespace-pre-wrap wrap-break-word font-mono text-sm leading-6 text-zinc-200">
            {exercice.buggyCode}
          </pre>
        </div>
      </Card>

      {/* INDICES */}

      <Card className="p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
            <Lightbulb size={18} />
          </div>

          <div className="flex-1">
            <h2 className="text-sm font-semibold text-zinc-900">
              Besoin d'aide ?
            </h2>

            <p className="mt-1 text-xs leading-5 text-zinc-500">
              Utilisez progressivement les indices si vous
              êtes bloqué.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-3">
          {[1, 2, 3].map((numero) => {
            const affiche =
              indiceActuel === numero;

            return (
              <button
                key={numero}
                type="button"
                onClick={() =>
                  void demanderIndice(numero)
                }
                disabled={chargementIndice}
                className="
                  inline-flex items-center justify-center
                  gap-2 rounded-xl
                  border border-zinc-200
                  bg-white px-4 py-3
                  text-xs font-medium text-zinc-700
                  transition
                  hover:bg-zinc-50
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {chargementIndice &&
                indiceActuel === numero ? (
                  <Loader2
                    size={14}
                    className="animate-spin"
                  />
                ) : affiche ? (
                  <EyeOff size={14} />
                ) : (
                  <Eye size={14} />
                )}

                Indice {numero}
              </button>
            );
          })}
        </div>

        {indiceActuel !== null &&
          indices[indiceActuel] && (
            <div className="mt-4 rounded-xl bg-amber-50 p-4">
              <p className="text-xs font-semibold text-amber-800">
                Indice {indiceActuel}
              </p>

              <p className="mt-1 text-sm leading-6 text-amber-900">
                {indices[indiceActuel]}
              </p>
            </div>
          )}
      </Card>

      {/* RÉPONSE */}

      <Card className="p-5 sm:p-6">
        <form onSubmit={soumettre}>
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">
              Votre correction
            </h2>

            <p className="mt-1 text-xs leading-5 text-zinc-500">
              Expliquez ou écrivez votre correction.
            </p>
          </div>

          <textarea
            value={reponse}
            onChange={(event) =>
              setReponse(event.target.value)
            }
            placeholder="Écrivez votre réponse ici..."
            rows={10}
            disabled={
              soumission || resultat?.correct === true
            }
            className="
              mt-4 w-full
              resize-y
              rounded-xl
              border border-zinc-200
              bg-white
              p-4
              font-mono
              text-sm
              leading-6
              text-zinc-900
              outline-none
              transition
              placeholder:font-sans
              placeholder:text-zinc-400
              focus:border-zinc-900
              focus:ring-4
              focus:ring-zinc-900/5
              disabled:bg-zinc-50
            "
          />

          <button
            type="submit"
            disabled={
              soumission ||
              !reponse.trim() ||
              resultat?.correct === true
            }
            className="
              mt-4 inline-flex w-full
              items-center justify-center
              gap-2 rounded-xl
              bg-zinc-900
              px-5 py-3
              text-sm font-medium text-white
              transition
              hover:bg-zinc-800
              disabled:cursor-not-allowed
              disabled:opacity-50
              sm:w-auto
            "
          >
            {soumission ? (
              <Loader2
                size={17}
                className="animate-spin"
              />
            ) : (
              <Send size={17} />
            )}

            Vérifier ma correction
          </button>
        </form>
      </Card>

      {/* ERREUR */}

      {erreur && (
        <Card className="border-red-100 p-5">
          <p className="text-sm text-red-600">
            {erreur}
          </p>
        </Card>
      )}

      {/* RÉSULTAT */}

      {resultat && (
        <Card className="p-6">
          {resultat.correct ? (
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-green-50 p-2.5 text-green-600">
                <CheckCircle2 size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-zinc-900">
                  Correction réussie !
                </h2>

                <p className="mt-1 text-sm leading-6 text-zinc-500">
                  Votre réponse correspond à la correction
                  attendue. Votre progression a été mise à
                  jour.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-red-50 p-2.5 text-red-600">
                <XCircle size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-zinc-900">
                  Correction incorrecte
                </h2>

                <p className="mt-1 text-sm leading-6 text-zinc-500">
                  Votre réponse ne correspond pas encore à
                  la correction attendue. Analysez à nouveau
                  le code ou utilisez un indice.
                </p>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

