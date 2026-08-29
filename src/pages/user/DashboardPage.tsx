
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  Code2,
  MessageSquare,
  Settings,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { useAuthStore } from "../../stores/auth.store";

export default function DashboardPage() {
  const utilisateur = useAuthStore(
    (state) => state.utilisateur
  );

  const nomUtilisateur =
    utilisateur?.displayName?.trim() ||
    utilisateur?.email?.split("@")[0] ||
    "Développeur";

  const initiale =
    nomUtilisateur.charAt(0).toUpperCase();

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">

      {/* =========================
          EN-TÊTE
      ========================== */}

      <section>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600">
              <Sparkles size={14} />
              Espace personnel
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
              Hello, {nomUtilisateur} 👋
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500 sm:text-base">
              Bienvenue dans votre espace CodeDoctor.
              Retrouvez vos activités, partagez vos
              expériences et développez vos connaissances
              techniques.
            </p>
          </div>

          <Link
            to="/experiences"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            <BookOpen size={17} />
            Explorer les expériences
          </Link>

        </div>
      </section>

      {/* =========================
          PROFIL
      ========================== */}

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-6 p-6 sm:p-7 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-zinc-950 text-lg font-semibold text-white">
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

              <p className="mt-1 truncate text-sm text-zinc-500">
                {utilisateur?.email}
              </p>
            </div>

          </div>

          <Link
            to="/parametres"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-zinc-950"
          >
            <Settings size={16} />
            Paramètres
            <ChevronRight size={15} />
          </Link>

        </div>
      </Card>

      {/* =========================
          STATISTIQUES
      ========================== */}

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold tracking-tight text-zinc-950">
            Votre activité
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Un aperçu de votre activité sur CodeDoctor.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700">
                <BookOpen size={19} />
              </div>

              <span className="text-xs font-medium text-zinc-400">
                Activité
              </span>
            </div>

            <p className="mt-6 text-3xl font-semibold tracking-tight text-zinc-950">
              0
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              Expériences partagées
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700">
                <MessageSquare size={19} />
              </div>

              <span className="text-xs font-medium text-zinc-400">
                Communauté
              </span>
            </div>

            <p className="mt-6 text-3xl font-semibold tracking-tight text-zinc-950">
              0
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              Discussions participées
            </p>
          </Card>

          <Card className="p-6 sm:col-span-2 lg:col-span-1">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700">
                <Code2 size={19} />
              </div>

              <span className="text-xs font-medium text-zinc-400">
                Profil
              </span>
            </div>

            <p className="mt-6 text-3xl font-semibold tracking-tight text-zinc-950">
              {utilisateur?.role === "ADMIN"
                ? "Admin"
                : "Membre"}
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              Type de compte
            </p>
          </Card>

        </div>
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
            Accédez rapidement aux principales fonctionnalités.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">

          {/* Expériences */}

          <Link
            to="/experiences"
            className="group"
          >
            <Card className="h-full p-6 transition duration-200 group-hover:-translate-y-0.5 group-hover:border-zinc-300 group-hover:shadow-md">
              <div className="flex items-center justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-950 text-white">
                  <BookOpen size={19} />
                </div>

                <ArrowRight
                  size={17}
                  className="text-zinc-400 transition-transform group-hover:translate-x-1 group-hover:text-zinc-950"
                />

              </div>

              <h3 className="mt-6 text-base font-semibold text-zinc-950">
                Expériences techniques
              </h3>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Découvrez les problèmes rencontrés par
                d'autres développeurs et leurs solutions.
              </p>
            </Card>
          </Link>

          {/* Discussions */}

          <Link
            to="/discussions"
            className="group"
          >
            <Card className="h-full p-6 transition duration-200 group-hover:-translate-y-0.5 group-hover:border-zinc-300 group-hover:shadow-md">
              <div className="flex items-center justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700">
                  <MessageSquare size={19} />
                </div>

                <ArrowRight
                  size={17}
                  className="text-zinc-400 transition-transform group-hover:translate-x-1 group-hover:text-zinc-950"
                />

              </div>

              <h3 className="mt-6 text-base font-semibold text-zinc-950">
                Discussions
              </h3>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Échangez avec la communauté autour des
                problématiques de développement.
              </p>
            </Card>
          </Link>

          {/* Paramètres */}

          <Link
            to="/parametres"
            className="group"
          >
            <Card className="h-full p-6 transition duration-200 group-hover:-translate-y-0.5 group-hover:border-zinc-300 group-hover:shadow-md">
              <div className="flex items-center justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700">
                  <Settings size={19} />
                </div>

                <ArrowRight
                  size={17}
                  className="text-zinc-400 transition-transform group-hover:translate-x-1 group-hover:text-zinc-950"
                />

              </div>

              <h3 className="mt-6 text-base font-semibold text-zinc-950">
                Paramètres
              </h3>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Gérez votre profil et les paramètres de
                votre compte CodeDoctor.
              </p>
            </Card>
          </Link>

        </div>
      </section>

      {/* =========================
          MESSAGE D'ACCUEIL
      ========================== */}

      <Card className="border-zinc-900 bg-zinc-950 text-white">
        <div className="flex flex-col gap-5 p-6 sm:p-7 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <p className="text-sm font-medium text-zinc-400">
              Commencez à contribuer
            </p>

            <h2 className="mt-2 text-xl font-semibold tracking-tight">
              Une erreur vous a déjà fait perdre du temps ?
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
              Partagez votre expérience avec la communauté.
              Votre solution pourrait aider un autre
              développeur confronté au même problème.
            </p>
          </div>

          <Link
            to="/experiences"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100"
          >
            <Sparkles size={16} />
            Découvrir
            <ArrowRight size={16} />
          </Link>

        </div>
      </Card>

    </div>
  );
}

