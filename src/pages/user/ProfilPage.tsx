
import {
  useEffect,
  useState,
  type FormEvent,
} from "react";
import {
  AtSign,
  CheckCircle2,
  Loader2,
  Mail,
  UserRound,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

import {
  modifierMonProfil,
  obtenirMonProfil,
} from "../../services/utilisateur.service";

import { useAuthStore } from "../../stores/auth.store";

import type { UtilisateurProfil } from "../../types/utilisateur";

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

  const [chargement, setChargement] =
    useState(true);

  const [sauvegarde, setSauvegarde] =
    useState(false);

  const [erreur, setErreur] = useState("");

  const [message, setMessage] = useState("");

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

  async function enregistrer(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (displayName.trim().length > 50) {
      setErreur(
        "Le nom affiché ne peut pas dépasser 50 caractères."
      );
      return;
    }

    try {
      setSauvegarde(true);
      setErreur("");
      setMessage("");

      const resultat =
        await modifierMonProfil({
          displayName:
            displayName.trim() || null,
        });

      setProfil(resultat);

      mettreAJourUtilisateur({
        id: resultat.id,
        email: resultat.email,
        displayName: resultat.displayName,
        role:
          useAuthStore.getState().utilisateur
            ?.role,
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
      setSauvegarde(false);
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

          <Card className="p-6 sm:p-8">
            <form onSubmit={enregistrer}>
              <div>
                <h2 className="text-base font-semibold text-zinc-950">
                  Informations personnelles
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Vous pouvez modifier votre nom
                  affiché.
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
                    disabled={sauvegarde}
                    placeholder="Votre nom affiché"
                    className="
                      h-11 w-full
                      rounded-xl
                      border border-zinc-200
                      bg-white
                      pl-10 pr-4
                      text-sm text-zinc-900
                      outline-none
                      focus:border-zinc-900
                      focus:ring-4
                      focus:ring-zinc-900/5
                    "
                  />
                </div>

                <p className="mt-2 text-xs text-zinc-400">
                  Maximum 50 caractères.
                </p>
              </div>

              <button
                type="submit"
                disabled={sauvegarde}
                className="
                  mt-6 inline-flex
                  items-center gap-2
                  rounded-xl bg-zinc-950
                  px-5 py-3
                  text-sm font-semibold
                  text-white
                  transition
                  hover:bg-zinc-800
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {sauvegarde && (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                )}

                Enregistrer les modifications
              </button>
            </form>
          </Card>

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
                  L'adresse email ne peut pas être
                  modifiée depuis cet écran.
                </p>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
