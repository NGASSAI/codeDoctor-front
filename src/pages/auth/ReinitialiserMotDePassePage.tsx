
import { useState, type FormEvent } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  ArrowLeft,
  Code2,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
} from "lucide-react";
import axios from "axios";

import { api } from "../../lib/api";

interface ReinitialisationResponse {
  message?: string;
}

interface ErreurApi {
  erreur?: string;
  message?: string;
}

export default function ReinitialiserMotDePassePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [nouveauMotDePasse, setNouveauMotDePasse] =
    useState("");

  const [confirmation, setConfirmation] =
    useState("");

  const [afficherMotDePasse, setAfficherMotDePasse] =
    useState(false);

  const [afficherConfirmation, setAfficherConfirmation] =
    useState(false);

  const [chargement, setChargement] =
    useState(false);

  const [succes, setSucces] = useState("");

  const [erreur, setErreur] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErreur("");
    setSucces("");

    if (!token) {
      setErreur(
        "Le lien de réinitialisation est invalide ou incomplet."
      );
      return;
    }

    if (!nouveauMotDePasse || !confirmation) {
      setErreur(
        "Veuillez remplir tous les champs."
      );
      return;
    }

    if (nouveauMotDePasse.length < 8) {
      setErreur(
        "Le nouveau mot de passe doit contenir au moins 8 caractères."
      );
      return;
    }

    if (nouveauMotDePasse !== confirmation) {
      setErreur(
        "Les mots de passe ne correspondent pas."
      );
      return;
    }

    try {
      setChargement(true);

      const response =
        await api.post<ReinitialisationResponse>(
          "/auth/reinitialiser",
          {
            token,
            nouveauMotDePasse,
          }
        );

      setSucces(
        response.data.message ||
          "Votre mot de passe a été réinitialisé avec succès."
      );

      setNouveauMotDePasse("");
      setConfirmation("");

      setTimeout(() => {
        navigate("/connexion", {
          replace: true,
        });
      }, 2000);
    } catch (error: unknown) {
      console.error(
        "Erreur réinitialisation mot de passe :",
        error
      );

      if (axios.isAxiosError<ErreurApi>(error)) {
        setErreur(
          error.response?.data?.erreur ??
            error.response?.data?.message ??
            "Impossible de réinitialiser votre mot de passe."
        );
      } else {
        setErreur(
          "Une erreur inattendue est survenue."
        );
      }
    } finally {
      setChargement(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-slate-50">
      <div className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="mb-10 flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-lg">
              <Code2 size={20} />
            </div>

            <span className="text-xl font-semibold tracking-tight text-zinc-950">
              CodeDoctor
            </span>
          </Link>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <LockKeyhole size={19} />
            </div>

            <p className="mt-6 text-sm font-medium text-blue-600">
              Sécurité du compte
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
              Nouveau mot de passe
            </h1>

            <p className="mt-3 text-sm leading-6 text-zinc-600">
              Choisissez un nouveau mot de passe pour
              sécuriser votre compte CodeDoctor.
            </p>

            {!token && (
              <div
                role="alert"
                className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
              >
                Le lien de réinitialisation ne contient pas
                de token valide.
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >
              {erreur && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
                >
                  {erreur}
                </div>
              )}

              {succes && (
                <div
                  role="status"
                  className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm leading-5 text-green-700"
                >
                  {succes} Redirection vers la connexion...
                </div>
              )}

              <div>
                <label
                  htmlFor="nouveauMotDePasse"
                  className="mb-2 block text-sm font-medium text-zinc-800"
                >
                  Nouveau mot de passe
                </label>

                <div className="relative">
                  <input
                    id="nouveauMotDePasse"
                    type={
                      afficherMotDePasse
                        ? "text"
                        : "password"
                    }
                    autoComplete="new-password"
                    value={nouveauMotDePasse}
                    onChange={(event) =>
                      setNouveauMotDePasse(
                        event.target.value
                      )
                    }
                    placeholder="Minimum 8 caractères"
                    disabled={
                      chargement || !token
                    }
                    className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 pr-12 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-4 focus:ring-zinc-950/5 disabled:cursor-not-allowed disabled:bg-zinc-50"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setAfficherMotDePasse(
                        (value) => !value
                      )
                    }
                    disabled={
                      chargement || !token
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label={
                      afficherMotDePasse
                        ? "Masquer le mot de passe"
                        : "Afficher le mot de passe"
                    }
                  >
                    {afficherMotDePasse ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmation"
                  className="mb-2 block text-sm font-medium text-zinc-800"
                >
                  Confirmer le mot de passe
                </label>

                <div className="relative">
                  <input
                    id="confirmation"
                    type={
                      afficherConfirmation
                        ? "text"
                        : "password"
                    }
                    autoComplete="new-password"
                    value={confirmation}
                    onChange={(event) =>
                      setConfirmation(
                        event.target.value
                      )
                    }
                    placeholder="Confirmez votre mot de passe"
                    disabled={
                      chargement || !token
                    }
                    className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 pr-12 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-4 focus:ring-zinc-950/5 disabled:cursor-not-allowed disabled:bg-zinc-50"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setAfficherConfirmation(
                        (value) => !value
                      )
                    }
                    disabled={
                      chargement || !token
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label={
                      afficherConfirmation
                        ? "Masquer le mot de passe"
                        : "Afficher le mot de passe"
                    }
                  >
                    {afficherConfirmation ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={
                  chargement || !token
                }
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:shadow-blue-500/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {chargement ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Réinitialisation...
                  </>
                ) : (
                  "Enregistrer le nouveau mot de passe"
                )}
              </button>
            </form>

            <div className="mt-6 border-t border-zinc-100 pt-6 text-center">
              <Link
                to="/connexion"
                className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-zinc-950"
              >
                <ArrowLeft size={16} />
                Retour à la connexion
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
