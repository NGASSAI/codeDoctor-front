import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Code2,
  Home,
  MessageSquare,
  Search,
  Sparkles,
  ThumbsUp,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { obtenirExperiences } from "../../services/experience.service";

import type {
  CategorieExperience,
  Experience,
} from "../../types/experience";

const CATEGORIES: {
  valeur: CategorieExperience;
  label: string;
}[] = [
  { valeur: "JAVASCRIPT", label: "JavaScript" },
  { valeur: "TYPESCRIPT", label: "TypeScript" },
  { valeur: "REACT", label: "React" },
  { valeur: "HTTP", label: "HTTP" },
  { valeur: "API", label: "API" },
  { valeur: "HTML_CSS", label: "HTML / CSS" },
];

const LIMITE = 9;

function nomCategorie(categorie: CategorieExperience) {
  return (
    CATEGORIES.find((item) => item.valeur === categorie)?.label ?? categorie
  );
}

function formaterDate(date: string) {
  const valeur = new Date(date);

  if (Number.isNaN(valeur.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(valeur);
}

function extraireErreur(error: unknown) {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.erreur ??
      error.response?.data?.message ??
      "Impossible de récupérer les expériences."
    );
  }

  return "Une erreur inattendue est survenue.";
}

function ExperienceCard({ experience }: { experience: Experience }) {
  const initialUser = (
    experience.user.displayName ?? "D"
  ).charAt(0).toUpperCase();

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10">
      <div className="flex flex-1 flex-col p-6">
        {/* En-tête de la carte */}
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center rounded-lg border border-blue-100 bg-blue-50/80 px-3 py-1 text-xs font-semibold text-blue-700">
            {nomCategorie(experience.categorie)}
          </span>

          <span className="text-xs font-medium text-slate-400">
            {formaterDate(experience.createdAt)}
          </span>
        </div>

        {/* Titre & Problème */}
        <div className="mt-4 flex-1">
          <h2 className="line-clamp-2 text-lg font-bold tracking-tight text-slate-900 transition-colors group-hover:text-blue-600">
            {experience.titre}
          </h2>

          <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-slate-600">
            {experience.probleme}
          </p>
        </div>

        {/* Bloc Diagnostic */}
        <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50/80 p-4 transition-colors group-hover:border-blue-100 group-hover:bg-blue-50/30">
          <div className="mb-1.5 flex items-center gap-2 text-xs font-bold text-blue-600">
            <Code2 size={14} />
            <span>Diagnostic / Cause</span>
          </div>

          <p className="line-clamp-2 font-mono text-xs leading-relaxed text-slate-600">
            {experience.cause}
          </p>
        </div>

        {/* Technologies utilisées */}
        {experience.technologie && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {experience.technologie
              .split(",")
              .map((technologie) => technologie.trim())
              .filter(Boolean)
              .slice(0, 4)
              .map((technologie) => (
                <span
                  key={technologie}
                  className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"
                >
                  #{technologie}
                </span>
              ))}
          </div>
        )}

        {/* Pied de la carte */}
        <div className="mt-6 border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-sm shadow-blue-500/20">
                {initialUser}
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-slate-800">
                  {experience.user.displayName ?? "Développeur CodeDoctor"}
                </p>
                <p className="text-[10px] text-slate-400">
                  Développeur
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-medium text-slate-400">
              <span className="flex items-center gap-1 transition-colors group-hover:text-slate-600">
                <MessageSquare size={14} className="text-blue-500/80" />
                {experience._count.comments}
              </span>

              <span className="flex items-center gap-1 transition-colors group-hover:text-slate-600">
                <ThumbsUp size={14} className="text-blue-500/80" />
                {experience._count.reactions}
              </span>
            </div>
          </div>

          <Link
            to={`/experiences/${experience.id}`}
            className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition-all hover:border-blue-600 hover:bg-blue-600 hover:text-white hover:shadow-md hover:shadow-blue-500/20"
          >
            <span>Voir le diagnostic complet</span>
            <ArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [recherche, setRecherche] = useState("");
  const [categorie, setCategorie] = useState<CategorieExperience | "">("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const [rechercheActive, setRechercheActive] = useState("");

  const categorieActive = categorie || undefined;

  useEffect(() => {
    let annule = false;

    async function charger() {
      try {
        setChargement(true);
        setErreur("");

        const resultat = await obtenirExperiences({
          recherche: rechercheActive || undefined,
          categorie: categorieActive,
          page,
          limite: LIMITE,
        });

        if (annule) {
          return;
        }

        setExperiences(resultat.experiences);
        setTotal(resultat.pagination.total);
        setPages(resultat.pagination.pages);
      } catch (error: unknown) {
        if (annule) {
          return;
        }

        console.error("Erreur récupération expériences :", error);
        setErreur(extraireErreur(error));
        setExperiences([]);
      } finally {
        if (!annule) {
          setChargement(false);
        }
      }
    }

    void charger();

    return () => {
      annule = true;
    };
  }, [page, rechercheActive, categorieActive]);

  async function rechargerExperiences() {
    try {
      setChargement(true);
      setErreur("");

      const resultat = await obtenirExperiences({
        recherche: rechercheActive || undefined,
        categorie: categorieActive,
        page,
        limite: LIMITE,
      });

      setExperiences(resultat.experiences);
      setTotal(resultat.pagination.total);
      setPages(resultat.pagination.pages);
    } catch (error: unknown) {
      console.error("Erreur récupération expériences :", error);
      setErreur(extraireErreur(error));
      setExperiences([]);
    } finally {
      setChargement(false);
    }
  }

  function lancerRecherche() {
    setPage(1);
    setRechercheActive(recherche.trim());
  }

  function changerCategorie(nouvelleCategorie: CategorieExperience | "") {
    setCategorie(nouvelleCategorie);
    setPage(1);
  }

  function pagePrecedente() {
    setPage((ancienne) => Math.max(1, ancienne - 1));
  }

  function pageSuivante() {
    setPage((ancienne) => Math.min(pages, ancienne + 1));
  }

  const resultatLabel = useMemo(() => {
    if (total === 0) {
      return "Aucune expérience trouvée";
    }

    if (total === 1) {
      return "1 expérience trouvée";
    }

    return `${total} expériences trouvées`;
  }, [total]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* BOUTON RETOUR À L'ACCUEIL & RETOUR RAPIDE */}
      <div className="mb-6">
        <Link
          to="/"
          className="group inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 shadow-sm border border-slate-200/80 transition-all hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200"
        >
          <Home size={16} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
          <span>Retour à l'accueil</span>
        </Link>
      </div>

      {/* EN-TÊTE PRINCIPAL */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 sm:p-10 text-white shadow-xl shadow-slate-900/10 border border-slate-800">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-300 backdrop-blur-md">
              <BookOpen size={14} className="text-blue-400" />
              <span>Base de connaissances technique</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
              Expériences de développeurs
            </h1>

            <p className="text-sm leading-relaxed text-slate-300 sm:text-base max-w-xl">
              Découvrez des problèmes techniques réels, comprenez leurs causes et consultez les solutions proposées par la communauté CodeDoctor.
            </p>
          </div>

          <Link
            to="/experiences/nouvelle"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-500 hover:shadow-blue-500/40 hover:-translate-y-0.5 shrink-0"
          >
            <Sparkles size={18} />
            <span>Partager une expérience</span>
          </Link>
        </div>
      </section>

      {/* BARRE DE RECHERCHE ET FILTRES */}
      <section className="py-8">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={recherche}
              onChange={(event) => setRecherche(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  lancerRecherche();
                }
              }}
              placeholder="Rechercher un problème, une technologie, une erreur..."
              className="h-12 w-full rounded-2xl border border-slate-200/80 bg-white pl-11 pr-10 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 shadow-sm"
            />

            {recherche && (
              <button
                type="button"
                onClick={() => {
                  setRecherche("");
                  setRechercheActive("");
                }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={lancerRecherche}
            className="h-12 rounded-2xl bg-slate-900 px-7 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-600 hover:shadow-blue-600/20 active:scale-95 shrink-0"
          >
            Rechercher
          </button>
        </div>

        {/* LISTE DES CATÉGORIES */}
        <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => changerCategorie("")}
            className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
              categorie === ""
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "border border-slate-200/80 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300"
            }`}
          >
            Toutes les catégories
          </button>

          {CATEGORIES.map((item) => (
            <button
              key={item.valeur}
              type="button"
              onClick={() => changerCategorie(item.valeur)}
              className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                categorie === item.valeur
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "border border-slate-200/80 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      {/* RÉSULTATS & STATUT */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm font-medium text-slate-500">
            {resultatLabel}
          </p>

          {rechercheActive && (
            <button
              type="button"
              onClick={() => {
                setRecherche("");
                setRechercheActive("");
                setPage(1);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              <X size={14} />
              Réinitialiser les filtres
            </button>
          )}
        </div>

        {/* AFFICHAGE DES ERREURS */}
        {erreur && (
          <div className="rounded-2xl border border-red-200 bg-red-50/90 p-5 shadow-sm">
            <div className="flex items-start gap-3.5">
              <AlertCircle
                size={22}
                className="mt-0.5 shrink-0 text-red-600"
              />

              <div>
                <h3 className="text-sm font-bold text-red-800">
                  Impossible de charger les expériences
                </h3>

                <p className="mt-1 text-sm leading-relaxed text-red-700">
                  {erreur}
                </p>

                <button
                  type="button"
                  onClick={() => void rechargerExperiences()}
                  className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-red-700"
                >
                  Réessayer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SKELETON LOADERS */}
        {chargement && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="flex h-360px animate-pulse flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm"
              >
                <div>
                  <div className="flex justify-between">
                    <div className="h-5 w-24 rounded-lg bg-slate-100" />
                    <div className="h-4 w-16 rounded bg-slate-100" />
                  </div>
                  <div className="mt-5 h-6 w-3/4 rounded-lg bg-slate-100" />
                  <div className="mt-3 h-4 w-full rounded bg-slate-100" />
                  <div className="mt-2 h-4 w-5/6 rounded bg-slate-100" />
                  <div className="mt-6 h-20 rounded-xl bg-slate-100" />
                </div>
                <div className="h-10 w-full rounded-xl bg-slate-100" />
              </div>
            ))}
          </div>
        )}

        {/* GRILLE D'EXPÉRIENCES */}
        {!chargement && !erreur && experiences.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {experiences.map((experience) => (
              <ExperienceCard key={experience.id} experience={experience} />
            ))}
          </div>
        )}

        {/* ÉTAT VIDE */}
        {!chargement && !erreur && experiences.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-8 ring-blue-50/50">
              <Search size={24} />
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-900">
              Aucun résultat trouvé
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
              Aucune expérience ne correspond actuellement à vos critères de recherche.
            </p>

            <button
              type="button"
              onClick={() => {
                setRecherche("");
                setRechercheActive("");
                setCategorie("");
                setPage(1);
              }}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700"
            >
              Afficher toutes les expériences
            </button>
          </div>
        )}
      </section>

      {/* PAGINATION */}
      {!chargement && !erreur && experiences.length > 0 && pages > 1 && (
        <nav
          className="mt-10 flex items-center justify-between border-t border-slate-200/80 pt-6"
          aria-label="Pagination"
        >
          <button
            type="button"
            onClick={pagePrecedente}
            disabled={page <= 1}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">Précédent</span>
          </button>

          <span className="text-sm font-medium text-slate-500">
            Page <strong className="font-bold text-slate-900">{page}</strong> sur{" "}
            <strong className="font-bold text-slate-900">{pages}</strong>
          </span>

          <button
            type="button"
            onClick={pageSuivante}
            disabled={page >= pages}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="hidden sm:inline">Suivant</span>
            <ChevronRight size={16} />
          </button>
        </nav>
      )}
    </div>
  );
}