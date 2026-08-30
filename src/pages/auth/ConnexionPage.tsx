
import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Code2,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import axios from "axios";

import { api } from "../../lib/api";
import { useAuthStore } from "../../stores/auth.store";

interface ConnexionResponse {
  utilisateur: {
    id: string;
    email: string;
    displayName: string | null;
    role?: "USER" | "ADMIN";
  };
  jeton: string;
  refreshToken: string;
}

interface ErreurApi {
  erreur?: string;
  message?: string;
}

export default function ConnexionPage() {
  const navigate = useNavigate();

  const definirSession = useAuthStore(
    (state) => state.definirSession
  );

  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [afficherMotDePasse, setAfficherMotDePasse] =
    useState(false);

  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErreur("");

    const emailNormalise = email.trim();

    if (!emailNormalise || !motDePasse) {
      setErreur(
        "Veuillez renseigner votre email et votre mot de passe."
      );
      return;
    }

    try {
      setChargement(true);

      const response = await api.post<ConnexionResponse>(
        "/auth/connexion",
        {
          email: emailNormalise,
          motDePasse,
        }
      );

      const {
        utilisateur,
        jeton,
        refreshToken,
      } = response.data;

      if (
        !utilisateur ||
        !jeton ||
        !refreshToken
      ) {
        setErreur(
          "La réponse du serveur est invalide."
        );
        return;
      }

      definirSession(
        utilisateur,
        jeton,
        refreshToken
      );

      if (utilisateur.role === "ADMIN") {
        navigate("/admin/dashboard", {
          replace: true,
        });
      } else {
        navigate("/dashboard", {
          replace: true,
        });
      }
    } catch (error: unknown) {
      console.error(
        "Erreur de connexion :",
        error
      );

      if (axios.isAxiosError<ErreurApi>(error)) {
        const message =
          error.response?.data?.erreur ??
          error.response?.data?.message ??
          "Impossible de se connecter. Vérifiez vos identifiants.";

        setErreur(message);
      } else {
        setErreur(
          "Impossible de se connecter. Une erreur inattendue est survenue."
        );
      }
    } finally {
      setChargement(false);
    }
  }

  function allerMotDePasseOublie() {
    navigate("/mot-de-passe-oublie");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-slate-50">
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

      <div className="grid min-h-screen lg:grid-cols-2">

        {/* =========================
            PRÉSENTATION
        ========================== */}

        <section className="relative hidden overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 lg:flex">
          <div className="absolute inset-0">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl"
            />

            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute -bottom-40 -right-20 h-[30rem] w-[30rem] rounded-full bg-blue-400/20 blur-3xl"
            />
          </div>

          <div className="relative flex w-full flex-col justify-between p-12 xl:p-16">

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-900 shadow-lg">
                <Code2 size={20} />
              </div>

              <span className="text-xl font-semibold tracking-tight text-white">
                CodeDoctor
              </span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-xl"
            >
              <p className="mb-5 text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">
                Communauté développeurs
              </p>

              <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white xl:text-5xl">
                Résolvez.
                <br />
                Apprenez.
                <br />
                Partagez.
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-blue-200">
                Retrouvez vos expériences techniques,
                échangez avec la communauté et construisez
                votre expertise avec CodeDoctor.
              </p>
            </motion.div>

            <p className="text-xs text-blue-300">
              CodeDoctor · Plateforme technique
            </p>

          </div>
        </section>

        {/* =========================
            FORMULAIRE
        ========================== */}

        <section className="flex items-center justify-center px-5 py-12 sm:px-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >

            {/* Logo mobile */}

            <div className="mb-10 lg:hidden">
              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-lg">
                  <Code2 size={20} />
                </div>

                <span className="text-xl font-semibold tracking-tight text-zinc-950">
                  CodeDoctor
                </span>

              </div>
            </div>

            {/* En-tête */}

            <div>
              <p className="text-sm font-medium text-blue-600">
                Bienvenue
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
                Se connecter
              </h2>

              <p className="mt-3 text-sm leading-6 text-zinc-600">
                Accédez à votre espace CodeDoctor.
              </p>
            </div>

            {/* Formulaire */}

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >

              {/* Erreur */}

              {erreur && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
                >
                  {erreur}
                </div>
              )}

              {/* Email */}

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

              {/* Mot de passe */}

              <div>
                <div className="mb-2 flex items-center justify-between">

                  <label
                    htmlFor="motDePasse"
                    className="block text-sm font-medium text-zinc-800"
                  >
                    Mot de passe
                  </label>

                  <button
                    type="button"
                    onClick={allerMotDePasseOublie}
                    disabled={chargement}
                    className="text-xs font-medium text-zinc-500 transition hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Mot de passe oublié ?
                  </button>

                </div>

                <div className="relative">

                  <input
                    id="motDePasse"
                    type={
                      afficherMotDePasse
                        ? "text"
                        : "password"
                    }
                    autoComplete="current-password"
                    value={motDePasse}
                    onChange={(event) =>
                      setMotDePasse(event.target.value)
                    }
                    placeholder="Votre mot de passe"
                    disabled={chargement}
                    className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 pr-12 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-4 focus:ring-zinc-950/5 disabled:cursor-not-allowed disabled:bg-zinc-50"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setAfficherMotDePasse(
                        (value) => !value
                      )
                    }
                    disabled={chargement}
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

              {/* Bouton connexion */}

              <motion.button
                type="submit"
                disabled={chargement}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:shadow-blue-500/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {chargement ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />

                    Connexion...
                  </>
                ) : (
                  <>
                    Se connecter

                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </>
                )}
              </motion.button>

            </form>

            {/* Informations */}

            <p className="mt-8 text-center text-xs leading-5 text-zinc-400">
              En vous connectant, vous accédez à votre espace
              personnel CodeDoctor.
            </p>

            {/* Lien création compte */}

            <div className="mt-6 text-center">
              <p className="text-sm text-zinc-600">
                Pas encore de compte ?{" "}
                <Link
                  to="/inscription"
                  className="font-semibold text-blue-600 transition hover:text-blue-700 hover:underline"
                >
                  Créer un compte
                </Link>
              </p>
            </div>

          </motion.div>
        </section>

      </div>
    </div>
  );
}

