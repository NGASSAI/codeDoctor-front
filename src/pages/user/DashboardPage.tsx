
import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Code2,
  Loader2,
  MessageSquare,
  Settings,
  Sparkles,
  Target,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { useAuthStore } from "../../stores/auth.store";

import {
  obtenirMaProgression,
  obtenirMesTentatives,
} from "../../services/exercice.service";

import type {
  ProgressionExercice,
  TentativeExercice,
} from "../../types/exercice";

const CATEGORIES = [
  { code: "JAVASCRIPT", label: "JavaScript" },
  { code: "TYPESCRIPT", label: "TypeScript" },
  { code: "REACT", label: "React" },
  { code: "HTTP", label: "HTTP" },
  { code: "API", label: "API" },
  { code: "HTML_CSS", label: "HTML / CSS" },
] as const;

function getSalutation(): string {
  const heure = new Date().getHours();
  if (heure >= 5 && heure < 12) return "Bonjour";
  if (heure >= 12 && heure < 18) return "Bon après-midi";
  return "Bonsoir";
}

export default function DashboardPage() {
  const utilisateur = useAuthStore(
    (state) => state.utilisateur
  );

  const [progression, setProgression] = useState<
    ProgressionExercice[]
  >([]);

  const [tentatives, setTentatives] = useState<
    TentativeExercice[]
  >([]);

  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  const nomUtilisateur =
    utilisateur?.displayName?.trim() ||
    utilisateur?.email?.split("@")[0] ||
    "Développeur";

  const initiale =
    nomUtilisateur.charAt(0).toUpperCase();

  useEffect(() => {
    let actif = true;

    async function chargerDonnees() {
      try {
        setChargement(true);
        setErreur("");

        const [
          resultatProgression,
          resultatTentatives,
        ] = await Promise.all([
          obtenirMaProgression(),
          obtenirMesTentatives(),
        ]);

        if (!actif) {
          return;
        }

        setProgression(resultatProgression.progression);
        setTentatives(resultatTentatives.tentatives);
      } catch (error) {
        console.error(
          "Erreur lors du chargement du dashboard :",
          error
        );

        if (actif) {
          setErreur(
            "Impossible de récupérer vos statistiques."
          );
        }
      } finally {
        if (actif) {
          setChargement(false);
        }
      }
    }

    void chargerDonnees();

    return () => {
      actif = false;
    };
  }, []);

  const exercicesReussis = useMemo(() => {
    return progression.reduce(
      (total, element) =>
        total + element.compteur,
      0
    );
  }, [progression]);

  const totalTentatives = tentatives.length;

  const tauxReussite = useMemo(() => {
    if (totalTentatives === 0) {
      return 0;
    }

    const reussies = tentatives.filter(
      (tentative) => tentative.correct
    ).length;

    return Math.round(
      (reussies / totalTentatives) * 100
    );
  }, [tentatives, totalTentatives]);

  const progressionParCategorie = useMemo(() => {
    return CATEGORIES.map((categorie) => {
      const element = progression.find(
        (item) =>
          item.categorie === categorie.code
      );

      return {
        ...categorie,
        compteur: element?.compteur ?? 0,
      };
    });
  }, [progression]);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">
      {/* =========================
          EN-TÊTE
      ========================== */}

      <section>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
              <Sparkles size={14} />
              Espace personnel
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
              {getSalutation()}, {nomUtilisateur} 👋
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 sm:text-base">
              Bienvenue dans votre espace CodeDoctor.
              Suivez votre progression, entraînez-vous
              et améliorez vos compétences techniques.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              to="/exercices"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:shadow-blue-500/40"
            >
              <BookOpen size={17} />
              Faire un exercice
            </Link>
          </motion.div>
        </div>
      </section>

      {/* =========================
          PROFIL
      ========================== */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="overflow-hidden border-blue-200 bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col gap-6 p-6 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 text-lg font-semibold text-white shadow-lg shadow-blue-500/30">
                {initiale}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-base font-semibold text-zinc-950">
                    {nomUtilisateur}
                  </h2>

                  <Badge variant="success">
                    Compte actif
                  </Badge>
                </div>

                <p className="mt-1 truncate text-sm text-zinc-600">
                  {utilisateur?.email}
                </p>
              </div>
            </div>

            <Link
              to="/parametres"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-700"
            >
              <Settings size={16} />
              Paramètres
              <ArrowRight size={15} />
            </Link>
          </div>
        </Card>
      </motion.div>

      {/* =========================
          ERREUR
      ========================== */}

      {erreur && (
        <Card className="border-red-200 bg-red-50 p-5">
          <div className="flex items-start gap-3">
            <AlertCircle
              size={19}
              className="mt-0.5 shrink-0 text-red-600"
            />

            <div>
              <p className="text-sm font-medium text-red-700">
                {erreur}
              </p>

              <p className="mt-1 text-xs text-red-600">
                Vos autres fonctionnalités restent
                accessibles.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* =========================
          STATISTIQUES
      ========================== */}

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold tracking-tight text-zinc-950">
            Votre activité
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Vos résultats réels enregistrés par CodeDoctor.
          </p>
        </div>

        {chargement ? (
          <Card className="p-10">
            <div className="flex flex-col items-center justify-center text-center">
              <Loader2
                size={28}
                className="animate-spin text-zinc-400"
              />

              <p className="mt-3 text-sm font-medium text-zinc-700">
                Chargement de vos statistiques...
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="border-blue-200 bg-white/80 backdrop-blur-sm p-6 transition hover:shadow-lg hover:shadow-blue-500/10">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-md shadow-green-500/30">
                    <CheckCircle2 size={19} />
                  </div>

                  <span className="text-xs font-medium text-zinc-400">
                    Réussite
                  </span>
                </div>

                <p className="mt-6 text-3xl font-semibold tracking-tight text-zinc-950">
                  {exercicesReussis}
                </p>

                <p className="mt-1 text-sm text-zinc-600">
                  Exercices réussis
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-blue-200 bg-white/80 backdrop-blur-sm p-6 transition hover:shadow-lg hover:shadow-blue-500/10">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 text-white shadow-md shadow-blue-500/30">
                    <Target size={19} />
                  </div>

                  <span className="text-xs font-medium text-zinc-400">
                    Entraînement
                  </span>
                </div>

                <p className="mt-6 text-3xl font-semibold tracking-tight text-zinc-950">
                  {totalTentatives}
                </p>

                <p className="mt-1 text-sm text-zinc-600">
                  Tentatives effectuées
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="border-blue-200 bg-white/80 backdrop-blur-sm p-6 sm:col-span-2 lg:col-span-1 transition hover:shadow-lg hover:shadow-blue-500/10">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-violet-500 text-white shadow-md shadow-purple-500/30">
                    <Code2 size={19} />
                  </div>

                  <span className="text-xs font-medium text-zinc-400">
                    Taux de réussite
                  </span>
                </div>

                <p className="mt-6 text-3xl font-semibold tracking-tight text-zinc-950">
                  {tauxReussite}%
                </p>

                <p className="mt-1 text-sm text-zinc-600">
                  Sur vos tentatives
                </p>
              </Card>
            </motion.div>
          </div>
        )}
      </section>

      {/* =========================
          PROGRESSION
      ========================== */}

      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-zinc-950">
              Votre progression
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Nombre d'exercices réussis par technologie.
            </p>
          </div>

          <Link
            to="/exercices"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-950"
          >
            Voir les exercices
            <ArrowRight size={15} />
          </Link>
        </div>

        {chargement ? (
          <Card className="p-8">
            <div className="flex items-center justify-center">
              <Loader2
                size={24}
                className="animate-spin text-zinc-400"
              />
            </div>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {progressionParCategorie.map(
              (categorie, index) => (
                <motion.div
                  key={categorie.code}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + (index * 0.1) }}
                >
                  <Card className="border-blue-200 bg-white/80 backdrop-blur-sm p-5 transition hover:shadow-lg hover:shadow-blue-500/10">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-semibold text-zinc-900">
                          {categorie.label}
                        </h3>

                        <p className="mt-1 text-xs text-zinc-400">
                          Exercices réussis
                        </p>
                      </div>

                      <span className="text-2xl font-semibold text-zinc-950">
                        {categorie.compteur}
                      </span>
                    </div>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-blue-100">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: categorie.compteur > 0 ? "100%" : "0%" }}
                        transition={{ duration: 0.8, delay: 0.3 + (index * 0.1) }}
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-600"
                      />
                    </div>
                  </Card>
                </motion.div>
              )
            )}
          </div>
        )}
      </section>

      {/* =========================
          ACTIONS RAPIDES
      ========================== */}

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold tracking-tight text-zinc-950">
            Actions rapides
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Accédez rapidement aux principales
            fonctionnalités.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link
              to="/exercices"
              className="group"
            >
              <Card className="h-full border-blue-200 bg-white/80 backdrop-blur-sm p-6 transition duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-blue-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/30">
                    <BookOpen size={19} />
                  </div>

                  <ArrowRight
                    size={17}
                    className="text-blue-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-600"
                  />
                </div>

                <h3 className="mt-6 text-base font-semibold text-zinc-950">
                  Exercices
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Corrigez des bugs réalistes et développez
                  vos compétences de programmation.
                </p>
              </Card>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              to="/experiences"
              className="group"
            >
              <Card className="h-full border-blue-200 bg-white/80 backdrop-blur-sm p-6 transition duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-blue-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-md shadow-purple-500/30">
                    <MessageSquare size={19} />
                  </div>

                  <ArrowRight
                    size={17}
                    className="text-blue-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-600"
                  />
                </div>

                <h3 className="mt-6 text-base font-semibold text-zinc-950">
                  Expériences techniques
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Découvrez les problèmes rencontrés par
                  d'autres développeurs et leurs solutions.
                </p>
              </Card>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link
              to="/parametres"
              className="group"
            >
              <Card className="h-full border-blue-200 bg-white/80 backdrop-blur-sm p-6 transition duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-blue-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-slate-500 to-zinc-600 text-white shadow-md shadow-slate-500/30">
                    <Settings size={19} />
                  </div>

                  <ArrowRight
                    size={17}
                    className="text-blue-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-600"
                  />
                </div>

                <h3 className="mt-6 text-base font-semibold text-zinc-950">
                  Paramètres
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Gérez votre profil et les paramètres de
                  votre compte CodeDoctor.
                </p>
              </Card>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* =========================
          MESSAGE D'ACCUEIL
      ========================== */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="border-blue-600 bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-900 text-white shadow-xl shadow-blue-500/30">
          <div className="flex flex-col gap-5 p-6 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium text-cyan-300">
                Continuez votre progression
              </p>

              <h2 className="mt-2 text-xl font-semibold tracking-tight">
                Chaque bug corrigé est une compétence gagnée.
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-200">
                Entraînez-vous régulièrement, utilisez les
                indices uniquement lorsque nécessaire et
                analysez vos erreurs pour progresser.
              </p>
            </div>

            <Link
              to="/exercices"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-cyan-500/30"
            >
              <BookOpen size={16} />
              Continuer
              <ArrowRight size={16} />
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

