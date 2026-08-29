import {
AlertCircle,
ArrowRight,
BookOpen,
ChevronLeft,
ChevronRight,
Code2,
MessageSquare,
Search,
Sparkles,
ThumbsUp,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import {
obtenirExperiences,
} from "../../services/experience.service";

import type {
CategorieExperience,
Experience,
} from "../../types/experience";

const CATEGORIES: {
valeur: CategorieExperience;
label: string;
}[] = [
{
valeur: "JAVASCRIPT",
label: "JavaScript",
},
{
valeur: "TYPESCRIPT",
label: "TypeScript",
},
{
valeur: "REACT",
label: "React",
},
{
valeur: "HTTP",
label: "HTTP",
},
{
valeur: "API",
label: "API",
},
{
valeur: "HTML_CSS",
label: "HTML / CSS",
},
];

const LIMITE = 9;

function nomCategorie(
categorie: CategorieExperience
) {
return (
  
CATEGORIES.find(
(item) => item.valeur === categorie
)?.label ?? categorie
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

function ExperienceCard({
experience,
}: {
experience: Experience;
}) {
return ( <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-900/5"> <div className="flex flex-1 flex-col p-5 sm:p-6"> <div className="flex items-start justify-between gap-4"> <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-600">
{nomCategorie(experience.categorie)} </span>

      <span className="text-xs text-zinc-400">
        {formaterDate(experience.createdAt)}
      </span>
    </div>

    <div className="mt-5">
      <h2 className="line-clamp-2 text-lg font-semibold tracking-tight text-zinc-950">
        {experience.titre}
      </h2>

      <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-500">
        {experience.probleme}
      </p>
    </div>

    <div className="mt-5 rounded-xl bg-zinc-950 p-4">
      <div className="mb-2 flex items-center gap-2 text-xs text-zinc-500">
        <Code2 size={14} />
        <span>Diagnostic</span>
      </div>

      <p className="line-clamp-3 font-mono text-xs leading-5 text-zinc-300">
        {experience.cause}
      </p>
    </div>

    {experience.technologie && (
      <div className="mt-5 flex flex-wrap gap-2">
        {experience.technologie
          .split(",")
          .map((technologie) =>
            technologie.trim()
          )
          .filter(Boolean)
          .slice(0, 4)
          .map((technologie) => (
            <span
              key={technologie}
              className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600"
            >
              {technologie}
            </span>
          ))}
      </div>
    )}

    <div className="mt-auto pt-6">
      <div className="flex items-center justify-between border-t border-zinc-100 pt-4">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-zinc-700">
            {experience.user.displayName ??
              "Développeur CodeDoctor"}
          </p>

          <p className="mt-0.5 text-xs text-zinc-400">
            Expérience technique
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-zinc-400">
          <span className="flex items-center gap-1">
            <MessageSquare size={14} />
            {experience._count.comments}
          </span>

          <span className="flex items-center gap-1">
            <ThumbsUp size={14} />
            {experience._count.reactions}
          </span>
        </div>
      </div>

      <Link
        to={`/experiences/${experience.id}`}
        className="mt-4 flex items-center justify-between rounded-xl border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-800 transition hover:border-zinc-950 hover:bg-zinc-950 hover:text-white"
      >
        <span>Voir le diagnostic</span>

        <ArrowRight
          size={16}
          className="transition-transform group-hover:translate-x-0.5"
        />
      </Link>
    </div>
  </div>
</article>


);
}

export default function ExperiencesPage() {
const [experiences, setExperiences] =
useState<Experience[]>([]);

const [recherche, setRecherche] =
useState("");

const [categorie, setCategorie] =
useState<CategorieExperience | "">("");

const [page, setPage] = useState(1);

const [total, setTotal] = useState(0);
const [pages, setPages] = useState(1);

const [chargement, setChargement] =
useState(true);

const [erreur, setErreur] =
useState("");

const [rechercheActive, setRechercheActive] =
useState("");

const categorieActive = categorie || undefined;

useEffect(() => {
let annule = false;


async function charger() {
  try {
    setChargement(true);
    setErreur("");

    const resultat =
      await obtenirExperiences({
        recherche:
          rechercheActive || undefined,
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

    console.error(
      "Erreur récupération expériences :",
      error
    );

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


  const resultat =
    await obtenirExperiences({
      recherche:
        rechercheActive || undefined,
      categorie: categorieActive,
      page,
      limite: LIMITE,
    });

  setExperiences(resultat.experiences);
  setTotal(resultat.pagination.total);
  setPages(resultat.pagination.pages);
} catch (error: unknown) {
  console.error(
    "Erreur récupération expériences :",
    error
  );

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

function changerCategorie(
nouvelleCategorie: CategorieExperience | ""
) {
setCategorie(nouvelleCategorie);
setPage(1);
}

function pagePrecedente() {
setPage((ancienne) =>
Math.max(1, ancienne - 1)
);
}

function pageSuivante() {
setPage((ancienne) =>
Math.min(pages, ancienne + 1)
);
}

const resultatLabel = useMemo(() => {
if (total === 0) {
return "Aucune expérience";
}


if (total === 1) {
  return "1 expérience";
}

return `${total} expériences`;


}, [total]);

return ( <div className="mx-auto w-full max-w-7xl">
{/* En-tête */} <section className="border-b border-zinc-200 pb-8"> <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"> <div className="max-w-2xl"> <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600"> <BookOpen size={14} />
Base de connaissances technique </div>


        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          Expériences de développeurs
        </h1>

        <p className="mt-4 text-sm leading-6 text-zinc-500 sm:text-base">
          Découvrez des problèmes techniques
          réels, comprenez leurs causes et
          consultez les solutions proposées par
          la communauté CodeDoctor.
        </p>
      </div>

      <Link
        to="/dashboard"
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800"
      >
        <Sparkles size={16} />
        Partager une expérience
      </Link>
    </div>
  </section>

  {/* Recherche */}
  <section className="py-6">
    <div className="flex flex-col gap-3 lg:flex-row">
      <div className="relative flex-1">
        <Search
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
        />

        <input
          type="search"
          value={recherche}
          onChange={(event) =>
            setRecherche(event.target.value)
          }
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              lancerRecherche();
            }
          }}
          placeholder="Rechercher un problème, une technologie, une solution..."
          className="h-12 w-full rounded-xl border border-zinc-200 bg-white pl-11 pr-4 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-4 focus:ring-zinc-950/5"
        />
      </div>

      <button
        type="button"
        onClick={lancerRecherche}
        className="h-12 rounded-xl bg-zinc-950 px-6 text-sm font-semibold text-white transition hover:bg-zinc-800"
      >
        Rechercher
      </button>
    </div>

    {/* Catégories */}
    <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
      <button
        type="button"
        onClick={() =>
          changerCategorie("")
        }
        className={`whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-medium transition ${
          categorie === ""
            ? "bg-zinc-950 text-white"
            : "border border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-950"
        }`}
      >
        Toutes
      </button>

      {CATEGORIES.map((item) => (
        <button
          key={item.valeur}
          type="button"
          onClick={() =>
            changerCategorie(item.valeur)
          }
          className={`whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-medium transition ${
            categorie === item.valeur
              ? "bg-zinc-950 text-white"
              : "border border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-950"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  </section>

  {/* Résultats */}
  <section>
    <div className="mb-5 flex items-center justify-between">
      <p className="text-sm font-medium text-zinc-500">
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
          className="text-xs font-medium text-zinc-500 hover:text-zinc-950"
        >
          Réinitialiser la recherche
        </button>
      )}
    </div>

    {erreur && (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
        <div className="flex items-start gap-3">
          <AlertCircle
            size={20}
            className="mt-0.5 shrink-0 text-red-600"
          />

          <div>
            <p className="text-sm font-semibold text-red-800">
              Impossible de charger les expériences
            </p>

            <p className="mt-1 text-sm leading-6 text-red-700">
              {erreur}
            </p>

            <button
              type="button"
              onClick={() =>
                void rechargerExperiences()
              }
              className="mt-3 text-sm font-semibold text-red-800 underline underline-offset-4"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    )}

    {chargement && (
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map(
          (_, index) => (
            <div
              key={index}
              className="h-390px animate-pulse rounded-2xl border border-zinc-200 bg-white p-6"
            >
              <div className="h-6 w-24 rounded bg-zinc-100" />
              <div className="mt-6 h-6 w-4/5 rounded bg-zinc-100" />
              <div className="mt-3 h-4 w-full rounded bg-zinc-100" />
              <div className="mt-2 h-4 w-5/6 rounded bg-zinc-100" />
              <div className="mt-6 h-28 rounded-xl bg-zinc-100" />
            </div>
          )
        )}
      </div>
    )}

    {!chargement &&
      !erreur &&
      experiences.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {experiences.map((experience) => (
            <ExperienceCard
              key={experience.id}
              experience={experience}
            />
          ))}
        </div>
      )}

    {!chargement &&
      !erreur &&
      experiences.length === 0 && (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500">
            <Search size={21} />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-zinc-950">
            Aucun résultat
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
            Aucune expérience ne correspond
            actuellement à vos critères de
            recherche.
          </p>

          <button
            type="button"
            onClick={() => {
              setRecherche("");
              setRechercheActive("");
              setCategorie("");
              setPage(1);
            }}
            className="mt-5 rounded-xl bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Afficher toutes les expériences
          </button>
        </div>
      )}
  </section>

  {/* Pagination */}
  {!chargement &&
    !erreur &&
    experiences.length > 0 &&
    pages > 1 && (
      <nav
        className="mt-8 flex items-center justify-between border-t border-zinc-200 pt-6"
        aria-label="Pagination"
      >
        <button
          type="button"
          onClick={pagePrecedente}
          disabled={page <= 1}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3.5 text-sm font-medium text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={16} />

          <span className="hidden sm:inline">
            Précédent
          </span>
        </button>

        <span className="text-sm text-zinc-500">
          Page{" "}
          <strong className="font-semibold text-zinc-950">
            {page}
          </strong>{" "}
          sur{" "}
          <strong className="font-semibold text-zinc-950">
            {pages}
          </strong>
        </span>

        <button
          type="button"
          onClick={pageSuivante}
          disabled={page >= pages}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3.5 text-sm font-medium text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="hidden sm:inline">
            Suivant
          </span>

          <ChevronRight size={16} />
        </button>
      </nav>
    )}
</div>


);
}
