
import { useEffect, useState } from "react";
import {
  Link,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Code2,
  Loader2,
} from "lucide-react";
import axios from "axios";

import { api } from "../../lib/api";

interface VerificationResponse {
  message: string;
  utilisateur?: {
    id: string;
    email: string;
    displayName: string | null;
    emailVerified: boolean;
  };
}

interface ErreurApi {
  erreur?: string;
  message?: string;
}

export default function VerificationEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [chargement, setChargement] = useState(
    Boolean(token)
  );

  const [succes, setSucces] = useState(false);

  const [message, setMessage] = useState(
    token
      ? ""
      : "Le lien de vérification est invalide ou incomplet."
  );

  useEffect(() => {
    if (!token) {
      return;
    }

    const verificationToken = token;
    let actif = true;

    async function verifier() {
      try {
        const response =
          await api.get<VerificationResponse>(
            `/auth/verifier-email?token=${encodeURIComponent(
              verificationToken
            )}`
          );

        if (!actif) {
          return;
        }

        setSucces(true);

        setMessage(
          response.data.message ||
            "Votre adresse email a été vérifiée avec succès."
        );
      } catch (error: unknown) {
        console.error(
          "Erreur vérification email :",
          error
        );

        if (!actif) {
          return;
        }

        if (
          axios.isAxiosError<ErreurApi>(error)
        ) {
          setMessage(
            error.response?.data?.erreur ??
              error.response?.data?.message ??
              "Impossible de vérifier votre adresse email."
          );
        } else {
          setMessage(
            "Impossible de vérifier votre adresse email."
          );
        }

        setSucces(false);
      } finally {
        if (actif) {
          setChargement(false);
        }
      }
    }

    void verifier();

    return () => {
      actif = false;
    };
  }, [token]);

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

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-center shadow-sm sm:p-8">
            {chargement ? (
              <>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                  <Loader2
                    size={24}
                    className="animate-spin text-blue-600"
                  />
                </div>

                <h1 className="mt-5 text-2xl font-semibold text-zinc-950">
                  Vérification en cours
                </h1>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Nous vérifions votre adresse email...
                </p>
              </>
            ) : succes ? (
              <>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
                  <CheckCircle2
                    size={26}
                    className="text-green-600"
                  />
                </div>

                <h1 className="mt-5 text-2xl font-semibold text-zinc-950">
                  Adresse vérifiée
                </h1>

                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  {message}
                </p>

                <Link
                  to="/connexion"
                  className="mt-6 inline-flex items-center justify-center rounded-xl bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
                >
                  Se connecter
                </Link>
              </>
            ) : (
              <>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
                  <AlertCircle
                    size={26}
                    className="text-red-600"
                  />
                </div>

                <h1 className="mt-5 text-2xl font-semibold text-zinc-950">
                  Vérification impossible
                </h1>

                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  {message}
                </p>

                <Link
                  to="/connexion"
                  className="mt-6 inline-flex items-center justify-center rounded-xl bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
                >
                  Retour à la connexion
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
