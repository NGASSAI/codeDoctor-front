
import { useState, type FormEvent } from "react";
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

interface InscriptionResponse {
  utilisateur: {
    id: string;
    email: string;
    displayName: string | null;
    emailVerified: boolean;
  };
  tokenVerification: string;
  message: string;
}

interface ErreurApi {
  erreur?: string;
  message?: string;
}

export default function InscriptionPage() {
  const navigate = useNavigate();

  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [confirmerMotDePasse, setConfirmerMotDePasse] =
    useState("");

  const [recoveryAnswer, setRecoveryAnswer] =
    useState("");

  const [recoveryHint, setRecoveryHint] =
    useState("");

  const [afficherMotDePasse, setAfficherMotDePasse] =
    useState(false);

  const [afficherConfirmation, setAfficherConfirmation] =
    useState(false);

  const [afficherPhrase, setAfficherPhrase] =
    useState(false);

  const [afficherConfirmationPhrase, setAfficherConfirmationPhrase] =
    useState(false);

  const [confirmationPhrase, setConfirmationPhrase] =
    useState("");

  const [chargement, setChargement] =
    useState(false);

  const [erreur, setErreur] =
    useState("");

  const [succes, setSucces] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErreur("");
    setSucces(false);

    const nomNormalise =
      nom.trim();

    const emailNormalise =
      email.trim().toLowerCase();

    const phraseNormalisee =
      recoveryAnswer.trim();

    const confirmationPhraseNormalisee =
      confirmationPhrase.trim();

    const indiceNormalise =
      recoveryHint.trim();

    if (
      !nomNormalise ||
      !emailNormalise ||
      !motDePasse ||
      !confirmerMotDePasse ||
      !phraseNormalisee ||
      !confirmationPhraseNormalisee ||
      !indiceNormalise
    ) {
      setErreur(
        "Veuillez remplir tous les champs."
      );
      return;
    }

    if (nomNormalise.length < 2) {
      setErreur(
        "Le nom doit contenir au moins 2 caractères."
      );
      return;
    }

    if (motDePasse.length < 8) {
      setErreur(
        "Le mot de passe doit contenir au moins 8 caractères."
      );
      return;
    }

    if (
      motDePasse !==
      confirmerMotDePasse
    ) {
      setErreur(
        "Les mots de passe ne correspondent pas."
      );
      return;
    }

    if (phraseNormalisee.length < 8) {
      setErreur(
        "La phrase secrète doit contenir au moins 8 caractères."
      );
      return;
    }

    if (
      phraseNormalisee.toLowerCase() ===
      motDePasse.toLowerCase()
    ) {
      setErreur(
        "La phrase secrète doit être différente du mot de passe."
      );
      return;
    }

    if (
      phraseNormalisee !==
      confirmationPhraseNormalisee
    ) {
      setErreur(
        "Les phrases secrètes ne correspondent pas."
      );
      return;
    }

    if (indiceNormalise.length < 3) {
      setErreur(
        "L'indice doit contenir au moins 3 caractères."
      );
      return;
    }

    try {
      setChargement(true);

      const response =
        await api.post<InscriptionResponse>(
          "/auth/inscription",
          {
            displayName: nomNormalise,
            email: emailNormalise,
            motDePasse,
            recoveryAnswer:
              phraseNormalisee,
            recoveryHint:
              indiceNormalise,
          }
        );

      const {
        utilisateur,
        tokenVerification,
      } = response.data;

      if (
        !utilisateur ||
        !tokenVerification
      ) {
        setErreur(
          "La réponse du serveur est invalide."
        );
        return;
      }

      setSucces(true);

      navigate(
        `/verification-email?token=${encodeURIComponent(
          tokenVerification
        )}`,
        {
          replace: true,
        }
      );
    } catch (error: unknown) {
      console.error(
        "Erreur d'inscription :",
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
            "Impossible de créer le compte. Veuillez réessayer."
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
        {/* Présentation */}

        <section className="relative hidden overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 lg:flex">
          <div className="absolute inset-0">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl"
            />

            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute -bottom-40 -right-20 h-[30rem] w-[30rem] rounded-full bg-blue-400/20 blur-3xl"
            />
          </div>

          <div className="relative flex w-full flex-col justify-between p-12 xl:p-16">
            <motion.div
              initial={{
                opacity: 0,
                y: -20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
              }}
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
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
                delay: 0.2,
              }}
              className="max-w-xl"
            >
              <p className="mb-5 text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">
                Rejoignez-nous
              </p>

              <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white xl:text-5xl">
                Créez votre
                <br />
                compte.
                <br />
                Commencez.
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-blue-200">
                Rejoignez la communauté de développeurs,
                améliorez vos compétences et résolvez des
                problèmes techniques avec CodeDoctor.
              </p>
            </motion.div>

            <p className="text-xs text-blue-300">
              CodeDoctor · Plateforme technique
            </p>
          </div>
        </section>

        {/* Formulaire */}

        <section className="flex items-center justify-center px-5 py-12 sm:px-8">
          <motion.div
            initial={{
              opacity: 0,
              x: 20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            className="w-full max-w-md"
          >
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

            <div>
              <p className="text-sm font-medium text-blue-600">
                Nouveau ici ?
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
                Créer un compte
              </h2>

              <p className="mt-3 text-sm leading-6 text-zinc-600">
                Rejoignez CodeDoctor en quelques secondes.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >
              {erreur && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
                >
                  {erreur}
                </motion.div>
              )}

              {succes && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  role="status"
                  className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm leading-5 text-green-700"
                >
                  Compte créé avec succès. Vérification en cours...
                </motion.div>
              )}

              <div>
                <label
                  htmlFor="nom"
                  className="mb-2 block text-sm font-medium text-zinc-800"
                >
                  Nom complet
                </label>

                <input
                  id="nom"
                  type="text"
                  autoComplete="name"
                  value={nom}
                  onChange={(event) =>
                    setNom(event.target.value)
                  }
                  placeholder="Votre nom"
                  disabled={chargement}
                  className="h-12 w-full rounded-xl border border-blue-200 bg-white px-4 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-zinc-50"
                />
              </div>

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
                  className="h-12 w-full rounded-xl border border-blue-200 bg-white px-4 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-zinc-50"
                />
              </div>

              <div>
                <label
                  htmlFor="motDePasse"
                  className="mb-2 block text-sm font-medium text-zinc-800"
                >
                  Mot de passe
                </label>

                <div className="relative">
                  <input
                    id="motDePasse"
                    type={
                      afficherMotDePasse
                        ? "text"
                        : "password"
                    }
                    autoComplete="new-password"
                    value={motDePasse}
                    onChange={(event) =>
                      setMotDePasse(
                        event.target.value
                      )
                    }
                    placeholder="Minimum 8 caractères"
                    disabled={chargement}
                    className="h-12 w-full rounded-xl border border-blue-200 bg-white px-4 pr-12 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-zinc-50"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setAfficherMotDePasse(
                        (value) => !value
                      )
                    }
                    disabled={chargement}
                    aria-label={
                      afficherMotDePasse
                        ? "Masquer le mot de passe"
                        : "Afficher le mot de passe"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-zinc-400 transition hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
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
                  htmlFor="confirmerMotDePasse"
                  className="mb-2 block text-sm font-medium text-zinc-800"
                >
                  Confirmer le mot de passe
                </label>

                <div className="relative">
                  <input
                    id="confirmerMotDePasse"
                    type={
                      afficherConfirmation
                        ? "text"
                        : "password"
                    }
                    autoComplete="new-password"
                    value={confirmerMotDePasse}
                    onChange={(event) =>
                      setConfirmerMotDePasse(
                        event.target.value
                      )
                    }
                    placeholder="Confirmez votre mot de passe"
                    disabled={chargement}
                    className="h-12 w-full rounded-xl border border-blue-200 bg-white px-4 pr-12 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-zinc-50"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setAfficherConfirmation(
                        (value) => !value
                      )
                    }
                    disabled={chargement}
                    aria-label={
                      afficherConfirmation
                        ? "Masquer le mot de passe"
                        : "Afficher le mot de passe"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-zinc-400 transition hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {afficherConfirmation ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Phrase secrète */}

              <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 sm:p-5">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900">
                    Phrase secrète de récupération
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-zinc-600">
                    Cette phrase permettra de vérifier votre
                    identité si vous oubliez votre mot de passe.
                    Choisissez une phrase personnelle, difficile
                    à deviner, et mémorisez-la.
                  </p>

                  <p className="mt-2 text-xs font-medium text-blue-700">
                    Ne choisissez pas une information publique
                    comme votre ville, votre sport préféré ou le
                    nom d’un proche.
                  </p>
                </div>

                <div className="mt-4">
                  <label
                    htmlFor="recoveryAnswer"
                    className="mb-2 block text-sm font-medium text-zinc-800"
                  >
                    Votre phrase secrète
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
                      placeholder="Ex. Mon premier ordinateur était bleu"
                      disabled={chargement}
                      className="h-12 w-full rounded-xl border border-blue-200 bg-white px-4 pr-12 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-zinc-50"
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
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-zinc-400 transition hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {afficherPhrase ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <label
                    htmlFor="confirmationPhrase"
                    className="mb-2 block text-sm font-medium text-zinc-800"
                  >
                    Confirmer la phrase secrète
                  </label>

                  <div className="relative">
                    <input
                      id="confirmationPhrase"
                      type={
                        afficherConfirmationPhrase
                          ? "text"
                          : "password"
                      }
                      autoComplete="off"
                      value={confirmationPhrase}
                      onChange={(event) =>
                        setConfirmationPhrase(
                          event.target.value
                        )
                      }
                      placeholder="Répétez votre phrase secrète"
                      disabled={chargement}
                      className="h-12 w-full rounded-xl border border-blue-200 bg-white px-4 pr-12 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-zinc-50"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setAfficherConfirmationPhrase(
                          (value) => !value
                        )
                      }
                      disabled={chargement}
                      aria-label={
                        afficherConfirmationPhrase
                          ? "Masquer la phrase secrète"
                          : "Afficher la phrase secrète"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-zinc-400 transition hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {afficherConfirmationPhrase ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <label
                    htmlFor="recoveryHint"
                    className="mb-2 block text-sm font-medium text-zinc-800"
                  >
                    Indice de récupération
                  </label>

                  <input
                    id="recoveryHint"
                    type="text"
                    autoComplete="off"
                    value={recoveryHint}
                    onChange={(event) =>
                      setRecoveryHint(
                        event.target.value
                      )
                    }
                    placeholder="Ex. Mon premier ordinateur"
                    disabled={chargement}
                    className="h-12 w-full rounded-xl border border-blue-200 bg-white px-4 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-zinc-50"
                  />

                  <p className="mt-2 text-xs leading-5 text-zinc-500">
                    L’indice sera visible dans votre espace
                    personnel. Il ne doit pas révéler directement
                    votre phrase secrète.
                  </p>
                </div>
              </div>

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
                    Création...
                  </>
                ) : (
                  <>
                    Créer mon compte
                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </>
                )}
              </motion.button>
            </form>

            <p className="mt-8 text-center text-xs leading-5 text-zinc-400">
              En créant un compte, vous acceptez les
              conditions d'utilisation de CodeDoctor.
            </p>

            <div className="mt-6 text-center">
              <p className="text-sm text-zinc-600">
                Déjà un compte ?{" "}
                <Link
                  to="/connexion"
                  className="font-semibold text-blue-600 transition hover:text-blue-700 hover:underline"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
