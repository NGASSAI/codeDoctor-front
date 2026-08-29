
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
import { motion } from "framer-motion";
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-slate-50 text-zinc-950">
      <SEO
        title="CodeDoctor — Plateforme technique pour développeurs"
        description="CodeDoctor aide les développeurs à comprendre leurs erreurs, analyser leur code, apprendre grâce à des exercices et partager leurs expériences techniques."
        canonical="https://code-doctor-front.vercel.app/"
      />
      {/* =========================
          HERO
      ========================== */}
      <section className="relative overflow-hidden border-b border-blue-200/50">
        <div className="absolute inset-0 -z-10">
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
            className="absolute left-1/2 top-180px h-500px w-500px -translate-x-1/2 rounded-full bg-blue-400/20 blur-3xl"
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
            className="absolute bottom-200px left-100px h-400px w-400px rounded-full bg-cyan-400/20 blur-3xl"
          />
        </div>

        <div className="mx-auto max-w-7xl px-5 pb-20 pt-8 sm:px-8 sm:pb-28 lg:px-8">
          {/* Navigation */}
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between"
          >
            <Link
              to="/"
              className="flex items-center gap-3"
            >
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30"
              >
                <Code2
                  size={20}
                  strokeWidth={2.2}
                />
              </motion.div>

              <div>
                <p className="text-lg font-bold tracking-tight text-zinc-950">
                  CodeDoctor
                </p>

                <p className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-blue-600 sm:block">
                  Communauté développeurs
                </p>
              </div>
            </Link>

            <Link
              to="/connexion"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-blue-200 bg-white/80 backdrop-blur-sm px-4 text-sm font-medium text-blue-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800"
            >
              Se connecter
            </Link>
          </motion.header>

          {/* Hero content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto mt-20 max-w-4xl text-center sm:mt-24"
          >
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-2 text-xs font-medium text-blue-700 shadow-sm">
              <Sparkles size={14} />
              La plateforme des développeurs
            </div>

            <h1 className="mt-7 text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl lg:text-7xl">
              Résolvez vos problèmes.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                Apprenez. Partagez.
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg sm:leading-8">
              CodeDoctor vous aide à comprendre vos erreurs,
              analyser votre code et apprendre grâce aux
              expériences techniques partagées par la
              communauté des développeurs.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/connexion"
                  className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:shadow-blue-500/40 sm:w-auto"
                >
                  Commencer maintenant
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/experiences"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white/80 backdrop-blur-sm px-6 text-sm font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800 sm:w-auto"
                >
                  <BookOpen size={17} />
                  Explorer les expériences
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Hero stats */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mx-auto mt-16 grid max-w-3xl grid-cols-1 overflow-hidden rounded-2xl border border-blue-200 bg-white/80 backdrop-blur-sm shadow-lg sm:grid-cols-3"
          >
            <div className="border-b border-blue-200 px-6 py-5 text-center sm:border-b-0 sm:border-r">
              <p className="text-2xl font-bold tracking-tight text-zinc-950">
                IA
              </p>
              <p className="mt-1 text-xs text-zinc-600">
                Analyse intelligente
              </p>
            </div>

            <div className="border-b border-blue-200 px-6 py-5 text-center sm:border-b-0 sm:border-r">
              <p className="text-2xl font-bold tracking-tight text-zinc-950">
                24/7
              </p>
              <p className="mt-1 text-xs text-zinc-600">
                Accès à la plateforme
              </p>
            </div>

            <div className="px-6 py-5 text-center">
              <p className="text-2xl font-bold tracking-tight text-zinc-950">
                Communauté
              </p>
              <p className="mt-1 text-xs text-zinc-600">
                Partage de connaissances
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =========================
          FONCTIONNALITÉS
      ========================== */}
      <section className="border-b border-blue-200/50 bg-white/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Fonctionnalités
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
              Tout ce qu'il faut pour progresser.
            </h2>

            <p className="mt-4 text-sm leading-6 text-zinc-600 sm:text-base">
              Une plateforme conçue pour transformer les
              problèmes de développement en opportunités
              d'apprentissage.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {fonctionnalites.map((fonctionnalite, index) => {
              const Icon = fonctionnalite.icon;

              return (
                <motion.article
                  key={fonctionnalite.titre}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="rounded-2xl border border-blue-200 bg-white/80 backdrop-blur-sm p-6 transition duration-300 hover:shadow-xl hover:shadow-blue-500/10"
                >
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                    index === 0 ? 'bg-gradient-to-br from-purple-500 to-violet-600' :
                    index === 1 ? 'bg-gradient-to-br from-blue-500 to-cyan-600' :
                    index === 2 ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
                    'bg-gradient-to-br from-orange-500 to-amber-600'
                  } text-white shadow-md`}>
                    <Icon size={20} />
                  </div>

                  <h3 className="mt-5 text-base font-semibold text-zinc-950">
                    {fonctionnalite.titre}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-zinc-600">
                    {fonctionnalite.description}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================
          COMMENT ÇA MARCHE
      ========================== */}
      <section className="border-b border-blue-200/50">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Comment ça marche
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
              Du problème à la solution.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-zinc-600 sm:text-base">
              CodeDoctor vous accompagne à chaque étape
              lorsque vous rencontrez un problème technique.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {etapes.map((etape, index) => (
              <motion.div
                key={etape.numero}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                <span className="text-5xl font-bold tracking-tight text-blue-200">
                  {etape.numero}
                </span>

                <h3 className="mt-2 text-lg font-semibold text-zinc-950">
                  {etape.titre}
                </h3>

                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  {etape.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================
          COMMUNAUTÉ
      ========================== */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-900 text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid items-center gap-12 lg:grid-cols-2"
          >
            <div>
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-blue-900 shadow-lg"
              >
                <Users size={22} />
              </motion.div>

              <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
                Votre problème peut aider
                quelqu'un d'autre.
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-blue-200 sm:text-base">
                Chaque erreur rencontrée est une occasion
                d'apprendre. Partagez vos problèmes, vos
                diagnostics et vos solutions afin d'enrichir
                la base de connaissances CodeDoctor.
              </p>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/experiences"
                  className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-400 px-5 py-3 text-sm font-semibold text-blue-900 transition hover:from-cyan-300 hover:to-blue-300 shadow-lg shadow-cyan-500/30"
                >
                  Découvrir la communauté
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-2xl border border-blue-700/50 bg-blue-950/50 backdrop-blur-sm p-6 sm:p-8 shadow-2xl"
            >
              <div className="flex items-center gap-3 border-b border-blue-800 pb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 text-blue-900">
                  <Code2 size={18} />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    CodeDoctor
                  </p>

                  <p className="text-xs text-blue-400">
                    Base de connaissances technique
                  </p>
                </div>
              </div>

              <div className="space-y-5 pt-6">
                <div>
                  <p className="text-xs text-blue-400">
                    PROBLÈME
                  </p>

                  <p className="mt-2 text-sm leading-6 text-blue-200">
                    Pourquoi ma requête API retourne-t-elle
                    une erreur inattendue ?
                  </p>
                </div>

                <div>
                  <p className="text-xs text-blue-400">
                    DIAGNOSTIC
                  </p>

                  <p className="mt-2 rounded-xl bg-blue-900/50 p-4 font-mono text-xs leading-5 text-blue-300 border border-blue-800">
                    Vérification de la requête, des paramètres
                    et de la réponse du serveur...
                  </p>
                </div>

                <div>
                  <p className="text-xs text-blue-400">
                    SOLUTION
                  </p>

                  <p className="mt-2 text-sm leading-6 text-blue-200">
                    Comprendre la cause permet de corriger
                    durablement le problème.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* =========================
          CTA
      ========================== */}
      <section>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8 sm:py-24"
        >
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 180 }}
            transition={{ duration: 0.6 }}
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100"
          >
            <Sparkles size={21} className="text-blue-600" />
          </motion.div>

          <h2 className="mt-6 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
            Prêt à devenir meilleur développeur ?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-zinc-600 sm:text-base">
            Rejoignez CodeDoctor et transformez chaque
            problème technique en nouvelle connaissance.
          </p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/connexion"
              className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-blue-500/30"
            >
              Commencer avec CodeDoctor
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* =========================
          FOOTER
      ========================== */}
      <footer className="border-t border-blue-200/50 bg-white/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-md">
              <Code2 size={16} />
            </div>

            <span className="text-sm font-semibold text-zinc-950">
              CodeDoctor
            </span>
          </div>

          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} dds CodeDoctor ·
            Plateforme technique pour développeurs
          </p>

          <Link
            to="/connexion"
            className="text-xs font-medium text-blue-600 transition hover:text-blue-700"
          >
            Se connecter
          </Link>
        </div>
      </footer>
    </div>
  );
}

