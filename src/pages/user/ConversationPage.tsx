
import {
  AlertCircle,
  ArrowLeft,
  Loader2,
  MessageSquare,
  Send,
} from "lucide-react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import Card from "../../components/ui/Card";

import {
  ajouterMessage,
  obtenirConversation,
} from "../../services/historique.service";

import type {
  ConversationDetail,
  RoleMessage,
} from "../../types/historique";

import { useAuthStore } from "../../stores/auth.store";

function formaterDate(date: string) {
  const valeur = new Date(date);

  if (Number.isNaN(valeur.getTime())) {
    return "Date inconnue";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(valeur);
}

export default function ConversationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const utilisateur = useAuthStore(
    (state) => state.utilisateur
  );

  const [conversation, setConversation] =
    useState<ConversationDetail | null>(null);

  const [message, setMessage] = useState("");

  const [chargement, setChargement] =
    useState(true);

  const [envoi, setEnvoi] = useState(false);

  const [erreur, setErreur] = useState("");

  useEffect(() => {
    if (!id) {
      return;
    }

    const conversationId = id;
    let actif = true;

    async function charger() {
      try {
        setChargement(true);
        setErreur("");

        const resultat =
          await obtenirConversation(
            conversationId
          );

        if (!actif) {
          return;
        }

        setConversation(resultat);
      } catch (error) {
        console.error(
          "Erreur chargement conversation :",
          error
        );

        if (actif) {
          setErreur(
            "Impossible de récupérer cette conversation."
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

  async function envoyerMessage(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!id || !message.trim()) {
      return;
    }

    const contenu = message.trim();

    try {
      setEnvoi(true);
      setErreur("");

      const resultat = await ajouterMessage(
        id,
        "USER",
        contenu
      );

      setConversation((ancienne) =>
        ancienne
          ? {
              ...ancienne,
              messages: [
                ...ancienne.messages,
                resultat.message,
              ],
            }
          : ancienne
      );

      setMessage("");
    } catch (error) {
      console.error(
        "Erreur envoi message :",
        error
      );

      setErreur(
        "Impossible d'envoyer votre message."
      );
    } finally {
      setEnvoi(false);
    }
  }

  if (chargement) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <Card className="p-12">
          <div className="flex flex-col items-center text-center">
            <Loader2
              size={30}
              className="animate-spin text-zinc-400"
            />

            <p className="mt-4 text-sm font-medium text-zinc-700">
              Chargement de la conversation...
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (!id || !conversation) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <Card className="p-10 text-center">
          <AlertCircle
            size={36}
            className="mx-auto text-red-400"
          />

          <h1 className="mt-4 text-lg font-semibold text-zinc-900">
            Conversation introuvable
          </h1>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            {erreur ||
              "Cette conversation n'existe pas ou n'est plus disponible."}
          </p>

          <Link
            to="/historique"
            className="
              mt-5 inline-flex items-center gap-2
              rounded-xl bg-zinc-950
              px-4 py-2.5
              text-sm font-medium text-white
              transition hover:bg-zinc-800
            "
          >
            <ArrowLeft size={16} />
            Retour à l'historique
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <button
        type="button"
        onClick={() => navigate("/historique")}
        className="
          inline-flex items-center gap-2 self-start
          text-sm font-medium
          text-zinc-500
          transition hover:text-zinc-950
        "
      >
        <ArrowLeft size={17} />
        Retour à l'historique
      </button>

      {erreur && (
        <Card className="border-red-200 bg-red-50 p-5">
          <div className="flex items-start gap-3">
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0 text-red-600"
            />

            <p className="text-sm leading-6 text-red-700">
              {erreur}
            </p>
          </div>
        </Card>
      )}

      <Card className="overflow-hidden">
        <div className="border-b border-zinc-100 px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-950 text-white">
              <MessageSquare size={18} />
            </div>

            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wide text-zinc-400">
                Conversation
              </p>

              <h1 className="mt-1 truncate text-lg font-semibold text-zinc-950">
                {conversation.title}
              </h1>

              <p className="mt-1 text-xs text-zinc-400">
                Créée le{" "}
                {formaterDate(
                  conversation.createdAt
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="max-h-[65vh] space-y-4 overflow-y-auto bg-zinc-50 p-5 sm:p-6">
          {conversation.messages.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-200 bg-white p-8 text-center">
              <MessageSquare
                size={30}
                className="mx-auto text-zinc-300"
              />

              <p className="mt-3 text-sm font-medium text-zinc-700">
                Aucun message
              </p>

              <p className="mt-1 text-xs text-zinc-400">
                Commencez la conversation.
              </p>
            </div>
          ) : (
            conversation.messages.map(
              (item) => {
                const estUtilisateur =
                  item.role ===
                  ("USER" as RoleMessage);

                return (
                  <div
                    key={item.id}
                    className={
                      estUtilisateur
                        ? "flex justify-end"
                        : "flex justify-start"
                    }
                  >
                    <div
                      className={
                        estUtilisateur
                          ? "max-w-[85%] rounded-2xl rounded-br-md bg-zinc-950 px-4 py-3 text-white sm:max-w-[75%]"
                          : "max-w-[85%] rounded-2xl rounded-bl-md border border-zinc-200 bg-white px-4 py-3 text-zinc-800 sm:max-w-[75%]"
                      }
                    >
                      <div className="mb-1 flex items-center justify-between gap-4">
                        <span
                          className={
                            estUtilisateur
                              ? "text-[11px] font-semibold text-zinc-300"
                              : "text-[11px] font-semibold text-zinc-500"
                          }
                        >
                          {estUtilisateur
                            ? utilisateur?.displayName ||
                              "Vous"
                            : "CodeDoctor"}
                        </span>

                        <span
                          className={
                            estUtilisateur
                              ? "text-[10px] text-zinc-500"
                              : "text-[10px] text-zinc-400"
                          }
                        >
                          {formaterDate(
                            item.createdAt
                          )}
                        </span>
                      </div>

                      <p className="whitespace-pre-wrap text-sm leading-6">
                        {item.content}
                      </p>
                    </div>
                  </div>
                );
              }
            )
          )}
        </div>

        <form
          onSubmit={envoyerMessage}
          className="border-t border-zinc-100 bg-white p-5 sm:p-6"
        >
          <label
            htmlFor="message"
            className="text-sm font-medium text-zinc-800"
          >
            Votre message
          </label>

          <textarea
            id="message"
            value={message}
            onChange={(event) =>
              setMessage(event.target.value)
            }
            rows={4}
            disabled={envoi}
            placeholder="Écrivez votre message..."
            className="
              mt-2 w-full resize-y
              rounded-xl
              border border-zinc-200
              bg-white p-4
              text-sm leading-6
              text-zinc-900
              outline-none
              transition
              placeholder:text-zinc-400
              focus:border-zinc-950
              focus:ring-4
              focus:ring-zinc-950/5
              disabled:bg-zinc-50
            "
          />

          <button
            type="submit"
            disabled={
              envoi || !message.trim()
            }
            className="
              mt-3 inline-flex items-center
              justify-center gap-2
              rounded-xl bg-zinc-950
              px-5 py-2.5
              text-sm font-semibold
              text-white
              transition hover:bg-zinc-800
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {envoi ? (
              <Loader2
                size={16}
                className="animate-spin"
              />
            ) : (
              <Send size={16} />
            )}

            Envoyer
          </button>
        </form>
      </Card>
    </div>
  );
}
