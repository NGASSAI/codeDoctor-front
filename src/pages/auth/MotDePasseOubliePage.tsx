
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Code2, Loader2, Mail } from "lucide-react";
import axios from "axios";

import { api } from "../../lib/api";

interface MotDePasseOublieResponse {
  message: string;
  token?: string;
}

interface ErreurApi {
  erreur?: string;
  message?: string;
}

export default function MotDePasseOubliePage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState("");
  const [succes, setSucces] = useState("");
  const [token, setToken] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErreur("");
    setSucces("");
    setToken("");

    const emailNormalise = email.trim().toLowerCase();

    if (!emailNormalise) {
      setErreur("Veuillez renseigner votre adresse email.");
      return;
    }

    try {
      setChargement(true);

      const response =
        await api.post<MotDePasseOublieResponse>(
          "/auth/mot-de-passe-oublie",
          {
            email: emailNormalise,
          }
        );

      setSucces(
        response.data.message ||
          "Si un compte correspond à cet email, un lien de réinitialisation sera envoyé."
      );

      /*
       * Le backend retourne actuellement le token
       * uniquement pour les tests.
       *
       * Lorsque l'envoi d'email sera configuré,
       * ce champ pourra être supprimé sans modifier
       * le reste du composant.
       */
      if (response.data.token) {
        setToken(response.data.token);
      }
    } catch (error: unknown) {
      console.error(
        "Erreur demande réinitialisation :",
        error
      );

      if (axios.isAxiosError<ErreurApi>(error)) {
        setErreur(
          error.response?.data?.erreur ??
            error.response?.data?.message ??
            "Impossible de traiter votre demande."
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

  function allerConnexion() {
    navigate("/connexion");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-slate-50">
      <div className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-md">
          {/* Logo */}

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
              <Mail size={19} />
            </div>

            <p className="mt-6 text-sm font-medium text-blue-600">
              Récupération du compte
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
              Mot de passe oublié ?
            </h1>

            <p className="mt-3 text-sm leading-6 text-zinc-600">
              Entrez votre adresse email. Si un compte
              correspond, vous recevrez les informations
              nécessaires pour réinitialiser votre mot de
              passe.
            </p>

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
                  {succes}
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-zinc-800"
                >
                  Adresse email
                </label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="vous@exemple.com"
                  disabled={chargement}
                  className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-4 focus:ring-zinc-950/5 disabled:cursor-not-allowed disabled:bg-zinc-50"
                />
              </div>

              <button
                type="submit"
                disabled={chargement}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:shadow-blue-500/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {chargement ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Vérification...
                  </>
                ) : (
                  "Réinitialiser mon mot de passe"
                )}
              </button>

              {token && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                    Token de test
                  </p>

                  <p className="mt-2 break-all font-mono text-xs leading-5 text-amber-900">
                    {token}
                  </p>

                  <p className="mt-3 text-xs leading-5 text-amber-700">
                    Ce token est temporairement affiché
                    par le backend pour les tests. Il devra
                    être retiré lorsque l'envoi d'emails sera
                    activé.
                  </p>
                </div>
              )}
            </form>

            <div className="mt-6 border-t border-zinc-100 pt-6 text-center">
              <button
                type="button"
                onClick={allerConnexion}
                className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-zinc-950"
              >
                <ArrowLeft size={16} />
                Retour à la connexion
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
