
import {
  ArrowRight,
  BookOpen,
  Code2,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "../../components/seo/SEO";
const fonctionnalites = [
  {
    icon: Sparkles,
    titre: "Analyse de code par IA",
    description:
      "Identifiez plus rapidement les erreurs, comprenez leurs causes et obtenez des pistes de résolution adaptées à votre code.",
  },
  {
    icon: BookOpen,
    titre: "Expériences techniques",
    description:
      "Découvrez des problèmes réellement rencontrés par des développeurs et les solutions utilisées pour les résoudre.",
  },
  {
    icon: MessageSquare,
    titre: "Échanges techniques",
    description:
      "Partagez vos connaissances, discutez autour des problèmes rencontrés et progressez grâce à la communauté.",
  },
  {
    icon: ShieldCheck,
    titre: "Espace sécurisé",
    description:
      "Votre compte et vos données sont protégés grâce à une architecture pensée pour une utilisation fiable et sécurisée.",
  },
];

const etapes = [
  {
    numero: "01",
    titre: "Rencontrez un problème",
    description:
      "Vous bloquez sur une erreur, un comportement inattendu ou un problème dans votre code.",
  },
  {
    numero: "02",
    titre: "Comprenez la cause",
    description:
      "Utilisez l'analyse et les expériences de la communauté pour comprendre précisément ce qui se passe.",
  },
  {
    numero: "03",
    titre: "Trouvez la solution",
    description:
      "Appliquez une solution adaptée, puis partagez votre expérience pour aider les autres développeurs.",
  },
];

export default function AccueilPage() {
  return (
    
    <div className="min-h-screen bg-white text-zinc-950">
      <SEO
  title="CodeDoctor — Plateforme technique pour développeurs"
  description="CodeDoctor aide les développeurs à comprendre leurs erreurs, analyser leur code, apprendre grâce à des exercices et partager leurs expériences techniques."
  canonical="https://code-doctor-front.vercel.app/"
/>
      {/* =========================
          HERO
      ========================== */}
      <section className="relative overflow-hidden border-b border-zinc-200">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-180px h-500px w-500px -translate-x-1/2 rounded-full bg-zinc-100 blur-3xl" />
          <div className="absolute bottom-200px left-100px h-400px w-400px rounded-full bg-zinc-50 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-5 pb-20 pt-8 sm:px-8 sm:pb-28 lg:px-8">
          {/* Navigation */}
          <header className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-950 text-white shadow-sm">
                <Code2
                  size={20}
                  strokeWidth={2.2}
                />
              </div>

              <div>
                <p className="text-lg font-bold tracking-tight">
                  CodeDoctor
                </p>

                <p className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-400 sm:block">
                  Communauté développeurs
                </p>
              </div>
            </Link>

            <Link
              to="/connexion"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-950"
            >
              Se connecter
            </Link>
          </header>

          {/* Hero content */}
          <div className="mx-auto mt-20 max-w-4xl text-center sm:mt-24">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3.5 py-2 text-xs font-medium text-zinc-600 shadow-sm">
              <Sparkles size={14} />
              La plateforme des développeurs
            </div>

            <h1 className="mt-7 text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl lg:text-7xl">
              Résolvez vos problèmes.
              <br />
              <span className="text-zinc-400">
                Apprenez. Partagez.
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-zinc-500 sm:text-lg sm:leading-8">
              CodeDoctor vous aide à comprendre vos erreurs,
              analyser votre code et apprendre grâce aux
              expériences techniques partagées par la
              communauté des développeurs.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/connexion"
                className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 sm:w-auto"
              >
                Commencer maintenant
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>

              <Link
                to="/experiences"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-6 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-950 sm:w-auto"
              >
                <BookOpen size={17} />
                Explorer les expériences
              </Link>
            </div>
          </div>

          {/* Hero stats */}
          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-1 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm sm:grid-cols-3">
            <div className="border-b border-zinc-200 px-6 py-5 text-center sm:border-b-0 sm:border-r">
              <p className="text-2xl font-bold tracking-tight">
                IA
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Analyse intelligente
              </p>
            </div>

            <div className="border-b border-zinc-200 px-6 py-5 text-center sm:border-b-0 sm:border-r">
              <p className="text-2xl font-bold tracking-tight">
                24/7
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Accès à la plateforme
              </p>
            </div>

            <div className="px-6 py-5 text-center">
              <p className="text-2xl font-bold tracking-tight">
                Communauté
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Partage de connaissances
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          FONCTIONNALITÉS
      ========================== */}
      <section className="border-b border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
              Fonctionnalités
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Tout ce qu'il faut pour progresser.
            </h2>

            <p className="mt-4 text-sm leading-6 text-zinc-500 sm:text-base">
              Une plateforme conçue pour transformer les
              problèmes de développement en opportunités
              d'apprentissage.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {fonctionnalites.map((fonctionnalite) => {
              const Icon = fonctionnalite.icon;

              return (
                <article
                  key={fonctionnalite.titre}
                  className="rounded-2xl border border-zinc-200 bg-white p-6 transition duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-900/5"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-950 text-white">
                    <Icon size={20} />
                  </div>

                  <h3 className="mt-5 text-base font-semibold">
                    {fonctionnalite.titre}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-zinc-500">
                    {fonctionnalite.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================
          COMMENT ÇA MARCHE
      ========================== */}
      <section className="border-b border-zinc-200">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
              Comment ça marche
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Du problème à la solution.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-zinc-500 sm:text-base">
              CodeDoctor vous accompagne à chaque étape
              lorsque vous rencontrez un problème technique.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {etapes.map((etape) => (
              <div
                key={etape.numero}
                className="relative"
              >
                <span className="text-5xl font-bold tracking-tight text-zinc-100">
                  {etape.numero}
                </span>

                <h3 className="mt-2 text-lg font-semibold">
                  {etape.titre}
                </h3>

                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  {etape.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================
          COMMUNAUTÉ
      ========================== */}
      <section className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-zinc-950">
                <Users size={22} />
              </div>

              <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
                Votre problème peut aider
                quelqu'un d'autre.
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">
                Chaque erreur rencontrée est une occasion
                d'apprendre. Partagez vos problèmes, vos
                diagnostics et vos solutions afin d'enrichir
                la base de connaissances CodeDoctor.
              </p>

              <Link
                to="/experiences"
                className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
              >
                Découvrir la communauté
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 sm:p-8">
              <div className="flex items-center gap-3 border-b border-zinc-800 pb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-zinc-950">
                  <Code2 size={18} />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    CodeDoctor
                  </p>

                  <p className="text-xs text-zinc-500">
                    Base de connaissances technique
                  </p>
                </div>
              </div>

              <div className="space-y-5 pt-6">
                <div>
                  <p className="text-xs text-zinc-500">
                    PROBLÈME
                  </p>

                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    Pourquoi ma requête API retourne-t-elle
                    une erreur inattendue ?
                  </p>
                </div>

                <div>
                  <p className="text-xs text-zinc-500">
                    DIAGNOSTIC
                  </p>

                  <p className="mt-2 rounded-xl bg-zinc-950 p-4 font-mono text-xs leading-5 text-zinc-400">
                    Vérification de la requête, des paramètres
                    et de la réponse du serveur...
                  </p>
                </div>

                <div>
                  <p className="text-xs text-zinc-500">
                    SOLUTION
                  </p>

                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    Comprendre la cause permet de corriger
                    durablement le problème.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          CTA
      ========================== */}
      <section>
        <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8 sm:py-24">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100">
            <Sparkles size={21} />
          </div>

          <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
            Prêt à devenir meilleur développeur ?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-zinc-500 sm:text-base">
            Rejoignez CodeDoctor et transformez chaque
            problème technique en nouvelle connaissance.
          </p>

          <Link
            to="/connexion"
            className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Commencer avec CodeDoctor
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </section>

      {/* =========================
          FOOTER
      ========================== */}
      <footer className="border-t border-zinc-200 bg-zinc-50">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-white">
              <Code2 size={16} />
            </div>

            <span className="text-sm font-semibold">
              CodeDoctor
            </span>
          </div>

          <p className="text-xs text-zinc-400">
            © {new Date().getFullYear()} CodeDoctor ·
            Plateforme technique pour développeurs
          </p>

          <Link
            to="/connexion"
            className="text-xs font-medium text-zinc-600 transition hover:text-zinc-950"
          >
            Se connecter
          </Link>
        </div>
      </footer>
    </div>
  );
}

