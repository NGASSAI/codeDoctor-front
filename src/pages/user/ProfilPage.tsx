
import {
  useEffect,
  useState,
  type FormEvent,
} from "react";
import {
  AtSign,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

import {
  modifierMonProfil,
  modifierSecuriteRecuperation,
  obtenirMonProfil,
} from "../../services/utilisateur.service";

import { useAuthStore } from "../../stores/auth.store";

import type {
  UtilisateurProfil,
} from "../../types/utilisateur";

function formaterDate(date: string) {
  const valeur = new Date(date);

  if (Number.isNaN(valeur.getTime())) {
    return "Date inconnue";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
  }).format(valeur);
}

export default function ProfilPage() {
  const mettreAJourUtilisateur =
    useAuthStore(
      (state) => state.mettreAJourUtilisateur
    );

  const [profil, setProfil] =
    useState<UtilisateurProfil | null>(null);

  const [displayName, setDisplayName] =
    useState("");

  const [recoveryAnswer, setRecoveryAnswer] =
    useState("");

  const [confirmationPhrase, setConfirmationPhrase] =
    useState("");

  const [recoveryHint, setRecoveryHint] =
    useState("");

  const [motDePasseActuel, setMotDePasseActuel] =
    useState("");

  const [afficherPhrase, setAfficherPhrase] =
    useState(false);

  const [
    afficherConfirmationPhrase,
    setAfficherConfirmationPhrase,
  ] = useState(false);

  const [
    afficherMotDePasseActuel,
    setAfficherMotDePasseActuel,
  ] = useState(false);

  const [chargement, setChargement] =
    useState(true);

  const [sauvegardeProfil, setSauvegardeProfil] =
    useState(false);

  const [
    sauvegardeSecurite,
    setSauvegardeSecurite,
  ] = useState(false);

  const [erreur, setErreur] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [
    messageSecurite,
    setMessageSecurite,
  ] = useState("");

  useEffect(() => {
    let actif = true;

    async function charger() {
      try {
        setChargement(true);
        setErreur("");

        const resultat =
          await obtenirMonProfil();

        if (!actif) {
          return;
        }

        setProfil(resultat);

        setDisplayName(
          resultat.displayName ?? ""
        );

        setRecoveryHint(
          resultat.recoveryHint ?? ""
        );
      } catch (error) {
        console.error(
          "Erreur chargement profil :",
          error
        );

        if (actif) {
          setErreur(
            "Impossible de récupérer votre profil."
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
  }, []);

  async function enregistrerProfil(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const nomNormalise =
      displayName.trim();

    if (nomNormalise.length > 50) {
      setErreur(
        "Le nom affiché ne peut pas dépasser 50 caractères."
      );
      return;
    }

    try {
      setSauvegardeProfil(true);
      setErreur("");
      setMessage("");

      const resultat =
        await modifierMonProfil({
          displayName:
            nomNormalise || null,
        });

      setProfil((ancien) =>
        ancien
          ? {
              ...ancien,
              ...resultat,
            }
          : resultat
      );

      mettreAJourUtilisateur({
        id: resultat.id,
        email: resultat.email,
        displayName:
          resultat.displayName,
        role:
          useAuthStore.getState()
            .utilisateur?.role,
      });

      setMessage(
        "Votre profil a été mis à jour avec succès."
      );
    } catch (error) {
      console.error(
        "Erreur modification profil :",
        error
      );

      setErreur(
        "Impossible de mettre à jour votre profil."
      );
    } finally {
      setSauvegardeProfil(false);
    }
  }

  async function enregistrerSecurite(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErreur("");
    setMessageSecurite("");

    const phrase =
      recoveryAnswer.trim();

    const confirmation =
      confirmationPhrase.trim();

    const indice =
      recoveryHint.trim();

    const aDejaUnePhrase =
      Boolean(
        profil?.recoveryHint
      );

    if (!phrase) {
      setErreur(
        "Veuillez saisir une phrase secrète."
      );
      return;
    }

    if (phrase.length < 8) {
      setErreur(
        "La phrase secrète doit contenir au moins 8 caractères."
      );
      return;
    }

    if (!confirmation) {
      setErreur(
        "Veuillez confirmer votre phrase secrète."
      );
      return;
    }

    if (phrase !== confirmation) {
      setErreur(
        "Les phrases secrètes ne correspondent pas."
      );
      return;
    }

    if (
      phrase.toLowerCase() ===
      motDePasseActuel.trim().toLowerCase()
    ) {
      setErreur(
        "La phrase secrète doit être différente du mot de passe."
      );
      return;
    }

    if (indice.length < 3) {
      setErreur(
        "L'indice doit contenir au moins 3 caractères."
      );
      return;
    }

    if (
      indice.toLowerCase() ===
      phrase.toLowerCase()
    ) {
      setErreur(
        "L'indice ne doit pas révéler directement la phrase secrète."
      );
      return;
    }

    if (
      aDejaUnePhrase &&
      !motDePasseActuel
    ) {
      setErreur(
        "Votre mot de passe actuel est requis pour modifier votre phrase secrète."
      );
      return;
    }

    try {
      setSauvegardeSecurite(true);

      const resultat =
        await modifierSecuriteRecuperation({
          recoveryAnswer: phrase,
          recoveryHint: indice,
          motDePasseActuel:
            motDePasseActuel ||
            undefined,
        });

      setProfil((ancien) =>
        ancien
          ? {
              ...ancien,
              ...resultat,
            }
          : resultat
      );

      setRecoveryHint(
        resultat.recoveryHint ?? ""
      );

      setRecoveryAnswer("");
      setConfirmationPhrase("");
      setMotDePasseActuel("");

      setMessageSecurite(
        "Vos informations de récupération ont été enregistrées avec succès."
      );
    } catch (error) {
      console.error(
        "Erreur modification sécurité :",
        error
      );

      const messageErreur =
        (
          error as {
            response?: {
              data?: {
                erreur?: string;
              };
            };
          }
        )?.response?.data?.erreur;

      setErreur(
        messageErreur ??
          "Impossible de mettre à jour vos informations de récupération."
      );
    } finally {
      setSauvegardeSecurite(false);
    }
  }

  if (chargement) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <Card className="p-12">
          <div className="flex flex-col items-center">
            <Loader2
              size={28}
              className="animate-spin text-zinc-400"
            />

            <p className="mt-4 text-sm text-zinc-600">
              Chargement du profil...
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      <section>
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600">
          <UserRound size={14} />
          Profil
        </div>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950">
          Mon profil
        </h1>

        <p className="mt-3 text-sm leading-6 text-zinc-500">
          Gérez les informations principales de votre
          compte CodeDoctor.
        </p>
      </section>

      {erreur && (
        <Card className="border-red-200 bg-red-50 p-5">
          <p className="text-sm text-red-700">
            {erreur}
          </p>
        </Card>
      )}

      {message && (
        <Card className="border-green-200 bg-green-50 p-5">
          <div className="flex items-start gap-3">
            <CheckCircle2
              size={18}
              className="mt-0.5 shrink-0 text-green-600"
            />

            <p className="text-sm text-green-700">
              {message}
            </p>
          </div>
        </Card>
      )}

      {profil && (
        <>
          {/* Présentation */}

          <Card className="p-6 sm:p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-950 text-lg font-semibold text-white">
                {(
                  profil.displayName ||
                  profil.email.split("@")[0] ||
                  "U"
                )
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <h2 className="text-lg font-semibold text-zinc-950">
                  {profil.displayName ||
                    "Utilisateur CodeDoctor"}
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Membre depuis{" "}
                  {formaterDate(
                    profil.createdAt
                  )}
                </p>
              </div>
            </div>
          </Card>

          {/* Informations personnelles */}

          <Card className="p-6 sm:p-8">
            <form
              onSubmit={enregistrerProfil}
            >
              <div>
                <h2 className="text-base font-semibold text-zinc-950">
                  Informations personnelles
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Vous pouvez modifier votre nom affiché.
                </p>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="displayName"
                  className="text-sm font-medium text-zinc-800"
                >
                  Nom affiché
                </label>

                <div className="relative mt-2">
                  <UserRound
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                  />

                  <input
                    id="displayName"
                    type="text"
                    value={displayName}
                    maxLength={50}
                    onChange={(event) =>
                      setDisplayName(
                        event.target.value
                      )
                    }
                    disabled={
                      sauvegardeProfil
                    }
                    placeholder="Votre nom affiché"
                    className="h-11 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-4 text-sm text-zinc-900 outline-none focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5"
                  />
                </div>

                <p className="mt-2 text-xs text-zinc-400">
                  Maximum 50 caractères.
                </p>
              </div>

              <button
                type="submit"
                disabled={
                  sauvegardeProfil
                }
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {sauvegardeProfil && (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                )}

                Enregistrer les modifications
              </button>
            </form>
          </Card>

          {/* Email */}

          <Card className="p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-zinc-100 p-2.5 text-zinc-700">
                <Mail size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base font-semibold text-zinc-950">
                    Adresse email
                  </h2>

                  <Badge
                    variant={
                      profil.emailVerified
                        ? "success"
                        : "warning"
                    }
                  >
                    {profil.emailVerified
                      ? "Vérifiée"
                      : "Non vérifiée"}
                  </Badge>
                </div>

                <div className="mt-3 flex items-center gap-2 text-sm text-zinc-600">
                  <AtSign
                    size={16}
                    className="shrink-0 text-zinc-400"
                  />

                  <span className="break-all">
                    {profil.email}
                  </span>
                </div>

                <p className="mt-3 text-xs leading-5 text-zinc-400">
                  L'adresse email ne peut pas être modifiée
                  depuis cet écran.
                </p>
              </div>
            </div>
          </Card>

          {/* Sécurité */}

          <Card className="p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                <ShieldCheck size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-base font-semibold text-zinc-950">
                  Sécurité du compte
                </h2>

                <p className="mt-1 text-sm leading-6 text-zinc-500">
                  Configurez une phrase secrète qui pourra être
                  utilisée pour récupérer votre compte si vous
                  oubliez votre mot de passe.
                </p>
              </div>
            </div>

            {profil.recoveryHint && (
              <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                  Votre indice actuel
                </p>

                <p className="mt-2 text-sm font-medium leading-6 text-blue-950">
                  {profil.recoveryHint}
                </p>

                <p className="mt-2 text-xs leading-5 text-blue-700">
                  Votre phrase secrète n’est jamais affichée ni
                  stockée en clair.
                </p>
              </div>
            )}

            {messageSecurite && (
              <div className="mt-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0 text-green-600"
                />

                <p className="text-sm leading-5 text-green-700">
                  {messageSecurite}
                </p>
              </div>
            )}

            <form
              onSubmit={enregistrerSecurite}
              className="mt-6 space-y-5"
            >
              {/* Phrase */}

              <div>
                <label
                  htmlFor="recoveryAnswer"
                  className="text-sm font-medium text-zinc-800"
                >
                  Phrase secrète
                </label>

                <div className="relative mt-2">
                  <KeyRound
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                  />

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
                    disabled={
                      sauvegardeSecurite
                    }
                    placeholder="Votre phrase secrète"
                    className="h-11 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-12 text-sm text-zinc-900 outline-none focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setAfficherPhrase(
                        (value) => !value
                      )
                    }
                    disabled={
                      sauvegardeSecurite
                    }
                    aria-label={
                      afficherPhrase
                        ? "Masquer la phrase secrète"
                        : "Afficher la phrase secrète"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
                  >
                    {afficherPhrase ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>

                <p className="mt-2 text-xs leading-5 text-zinc-400">
                  Minimum 8 caractères. Choisissez une phrase
                  personnelle difficile à deviner.
                </p>
              </div>

              {/* Confirmation */}

              <div>
                <label
                  htmlFor="confirmationPhrase"
                  className="text-sm font-medium text-zinc-800"
                >
                  Confirmer la phrase secrète
                </label>

                <div className="relative mt-2">
                  <input
                    id="confirmationPhrase"
                    type={
                      afficherConfirmationPhrase
                        ? "text"
                        : "password"
                    }
                    autoComplete="off"
                    value={
                      confirmationPhrase
                    }
                    onChange={(event) =>
                      setConfirmationPhrase(
                        event.target.value
                      )
                    }
                    disabled={
                      sauvegardeSecurite
                    }
                    placeholder="Confirmez votre phrase"
                    className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 pr-12 text-sm text-zinc-900 outline-none focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setAfficherConfirmationPhrase(
                        (value) => !value
                      )
                    }
                    disabled={
                      sauvegardeSecurite
                    }
                    aria-label={
                      afficherConfirmationPhrase
                        ? "Masquer la confirmation"
                        : "Afficher la confirmation"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
                  >
                    {afficherConfirmationPhrase ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>

              {/* Indice */}

              <div>
                <label
                  htmlFor="recoveryHint"
                  className="text-sm font-medium text-zinc-800"
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
                  disabled={
                    sauvegardeSecurite
                  }
                  placeholder="Ex. Mon premier ordinateur"
                  className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 outline-none focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5"
                />

                <p className="mt-2 text-xs leading-5 text-zinc-400">
                  Cet indice sera visible lors de la récupération
                  du compte. Il ne doit pas révéler directement
                  votre phrase.
                </p>
              </div>

              {/* Mot de passe actuel */}

              {profil.recoveryHint && (
                <div>
                  <label
                    htmlFor="motDePasseActuel"
                    className="text-sm font-medium text-zinc-800"
                  >
                    Mot de passe actuel
                  </label>

                  <div className="relative mt-2">
                    <input
                      id="motDePasseActuel"
                      type={
                        afficherMotDePasseActuel
                          ? "text"
                          : "password"
                      }
                      autoComplete="current-password"
                      value={
                        motDePasseActuel
                      }
                      onChange={(event) =>
                        setMotDePasseActuel(
                          event.target.value
                        )
                      }
                      disabled={
                        sauvegardeSecurite
                      }
                      placeholder="Requis pour modifier la phrase existante"
                      className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 pr-12 text-sm text-zinc-900 outline-none focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setAfficherMotDePasseActuel(
                          (value) => !value
                        )
                      }
                      disabled={
                        sauvegardeSecurite
                      }
                      aria-label={
                        afficherMotDePasseActuel
                          ? "Masquer le mot de passe actuel"
                          : "Afficher le mot de passe actuel"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
                    >
                      {afficherMotDePasseActuel ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>

                  <p className="mt-2 text-xs leading-5 text-zinc-400">
                    Nécessaire uniquement lorsque vous modifiez
                    une phrase secrète déjà configurée.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={
                  sauvegardeSecurite
                }
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {sauvegardeSecurite && (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                )}

                Enregistrer la sécurité
              </button>
            </form>
          </Card>
        </>
      )}
    </div>
  );
}
