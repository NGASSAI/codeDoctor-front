
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Code2,
  ExternalLink,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
} from "lucide-react";
import axios from "axios";

import { api } from "../../lib/api";

interface RecuperationResponse {
  message: string;
  recoveryHint?: string | null;
  resetUrl?: string;
}

interface ErreurApi {
  erreur?: string;
  message?: string;
}

export default function MotDePasseOubliePage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [recoveryAnswer, setRecoveryAnswer] =
    useState("");

  const [recoveryHint, setRecoveryHint] =
    useState("");

  const [resetUrl, setResetUrl] =
    useState("");

  const [etape, setEtape] = useState<
    "email" | "phrase" | "succes"
  >("email");

  const [chargement, setChargement] =
    useState(false);

  const [erreur, setErreur] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [afficherPhrase, setAfficherPhrase] =
    useState(false);
  const [sansPhraseConfiguree, setSansPhraseConfiguree] = useState(false);

  async function demanderIndice(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErreur("");
    setMessage("");
    setResetUrl("");
    setSansPhraseConfiguree(false);

    const emailNormalise = email
      .trim()
      .toLowerCase();

    if (!emailNormalise) {
      setErreur(
        "Veuillez renseigner votre adresse email."
      );
      return;
    }

    try {
      setChargement(true);

      const response =
        await api.post<RecuperationResponse>(
          "/auth/mot-de-passe-oublie",
          {
            email: emailNormalise,
          }
        );

      if (!response.data.recoveryHint) {
        setErreur(
          response.data.message ||
            "Aucune information de récupération n'est disponible pour ce compte."
        );
        return;
      }

      setRecoveryHint(
        response.data.recoveryHint
      );

      setMessage(
        "Utilisez votre indice pour retrouver votre phrase secrète."
      );

      setEtape("phrase");
      // ---------
   } catch (error: unknown) {
  console.error(
    "Erreur récupération compte :",
    error
  );

  if (axios.isAxiosError<ErreurApi>(error)) {
    if (error.response?.status === 403) {
      setSansPhraseConfiguree(true);
      setErreur(
        "Aucune phrase secrète de récupération n'est configurée pour ce compte. Si vous vous souvenez de votre mot de passe, connectez-vous puis configurez une phrase secrète depuis votre profil pour sécuriser votre compte à l'avenir."
      );
    } else {
      setErreur(
        error.response?.data?.erreur ??
          error.response?.data?.message ??
          "Impossible de traiter votre demande."
      );
    }
  } else {
    setErreur(
      "Une erreur inattendue est survenue."
    );
  }
} finally {
  setChargement(false);
}
    // ----------------
  }

  async function verifierPhrase(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErreur("");
    setMessage("");
    setResetUrl("");

    const emailNormalise = email
      .trim()
      .toLowerCase();

    const phraseNormalisee =
      recoveryAnswer.trim();

    if (!phraseNormalisee) {
      setErreur(
        "Veuillez renseigner votre phrase secrète."
      );
      return;
    }

    try {
      setChargement(true);

      const response =
        await api.post<RecuperationResponse>(
          "/auth/mot-de-passe-oublie",
          {
            email: emailNormalise,
            recoveryAnswer:
              phraseNormalisee,
          }
        );

      if (!response.data.resetUrl) {
        setErreur(
          response.data.message ||
            "La vérification n'a pas permis de générer un lien de réinitialisation."
        );
        return;
      }

      setResetUrl(
        response.data.resetUrl
      );

      setMessage(
        response.data.message ||
          "Votre identité a été vérifiée."
      );

      setEtape("succes");
    } catch (error: unknown) {
      console.error(
        "Erreur vérification phrase secrète :",
        error
      );

      if (
        axios.isAxiosError<ErreurApi>(
          error
        )
      ) {
        setErreur(
          error.response?.data?.erreur ??
            error.response?.data?.message ??
            "Phrase secrète incorrecte."
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

  function revenirEmail() {
    setEtape("email");
    setRecoveryHint("");
    setRecoveryAnswer("");
    setResetUrl("");
    setErreur("");
    setMessage("");
  }

  function allerConnexion() {
    navigate("/connexion");
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-cyan-50 to-slate-50">
      {/* Bouton de retour */}
      <motion.button
        type="button"
        onClick={() => navigate("/")}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-xl border border-blue-200 bg-white/80 backdrop-blur-sm px-4 py-2 text-sm font-medium text-blue-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800 lg:left-8 lg:top-8"
      >
        <ArrowLeft size={16} />
        <span>Retour</span>
      </motion.button>

      <div className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-md">
          {/* Logo */}

          <Link
            to="/"
            className="mb-10 flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-cyan-600 text-white shadow-lg">
              <Code2 size={20} />
            </div>

            <span className="text-xl font-semibold tracking-tight text-zinc-950">
              CodeDoctor
            </span>
          </Link>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            {/* Icône */}

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              {etape === "email" ? (
                <Mail size={19} />
              ) : etape === "phrase" ? (
                <LockKeyhole size={19} />
              ) : (
                <CheckCircle2 size={19} />
              )}
            </div>

            {/* =========================
                ÉTAPE 1
            ========================== */}

            {etape === "email" && (
              <>
                <p className="mt-6 text-sm font-medium text-blue-600">
                  Récupération du compte
                </p>

                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
                  Mot de passe oublié ?
                </h1>

                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  Entrez l'adresse email associée à votre
                  compte. Nous afficherons ensuite votre
                  indice de récupération.
                </p>

                <form
                  onSubmit={demanderIndice}
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
{sansPhraseConfiguree && (
  <Link
    to="/connexion"
    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
  >
    Se connecter avec mon mot de passe
  </Link>
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
                        setEmail(
                          event.target.value
                        )
                      }
                      placeholder="vous@exemple.com"
                      disabled={chargement}
                      className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-4 focus:ring-zinc-950/5 disabled:cursor-not-allowed disabled:bg-zinc-50"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={chargement}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-br from-blue-600 to-cyan-600 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:shadow-blue-500/40 disabled:cursor-not-allowed disabled:opacity-60"
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
                      "Continuer"
                    )}
                  </button>
                </form>
              </>
            )}

            {/* =========================
                ÉTAPE 2
            ========================== */}

            {etape === "phrase" && (
              <>
                <p className="mt-6 text-sm font-medium text-blue-600">
                  Vérification de votre identité
                </p>

                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
                  Votre phrase secrète
                </h1>

                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  Utilisez l'indice ci-dessous pour retrouver
                  la phrase secrète définie lors de votre
                  inscription.
                </p>

                {recoveryHint && (
                  <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                      Votre indice
                    </p>

                    <p className="mt-2 text-sm font-medium leading-6 text-blue-950">
                      {recoveryHint}
                    </p>
                  </div>
                )}

                <form
                  onSubmit={verifierPhrase}
                  className="mt-6 space-y-5"
                >
                  {erreur && (
                    <div
                      role="alert"
                      className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
                    >
                      {erreur}
                    </div>
                  )}

                  {message && (
                    <div
                      role="status"
                      className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm leading-5 text-blue-700"
                    >
                      {message}
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="recoveryAnswer"
                      className="mb-2 block text-sm font-medium text-zinc-800"
                    >
                      Phrase secrète
                    </label>

                    <div className="relative">
                      <input
                        id="recoveryAnswer"
                        type={
                          afficherPhrase
                            ? "text"
                            : "password"
                        }
                        autoComplete="off"
                        value={recoveryAnswer}
                        onChange={(event) =>
                          setRecoveryAnswer(
                            event.target.value
                          )
                        }
                        placeholder="Entrez votre phrase secrète"
                        disabled={chargement}
                        className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 pr-12 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-4 focus:ring-zinc-950/5 disabled:cursor-not-allowed disabled:bg-zinc-50"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setAfficherPhrase(
                            (value) => !value
                          )
                        }
                        disabled={chargement}
                        aria-label={
                          afficherPhrase
                            ? "Masquer la phrase secrète"
                            : "Afficher la phrase secrète"
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {afficherPhrase ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={chargement}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-br from-blue-600 to-cyan-600 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:shadow-blue-500/40 disabled:cursor-not-allowed disabled:opacity-60"
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
                      "Vérifier ma phrase"
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={revenirEmail}
                    disabled={chargement}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ArrowLeft size={16} />
                    Modifier mon email
                  </button>
                </form>
              </>
            )}

            {/* =========================
                SUCCÈS
            ========================== */}

            {etape === "succes" && (
              <>
                <p className="mt-6 text-sm font-medium text-green-600">
                  Vérification réussie
                </p>

                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
                  Vous pouvez continuer
                </h1>

                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  Votre phrase secrète a été vérifiée.
                  Le lien de réinitialisation est valable
                  pendant 5 minutes.
                </p>

                {resetUrl && (
                  <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4">
                    <p className="text-sm font-semibold text-green-900">
                      Réinitialisation autorisée
                    </p>

                    <p className="mt-2 text-xs leading-5 text-green-700">
                      Utilisez le bouton ci-dessous pour
                      choisir votre nouveau mot de passe.
                    </p>

                    <a
                      href={resetUrl}
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
                    >
                      <ExternalLink size={16} />
                      Choisir un nouveau mot de passe
                    </a>
                  </div>
                )}

                <button
                  type="button"
                  onClick={allerConnexion}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-950"
                >
                  <ArrowLeft size={16} />
                  Retour à la connexion
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
