import { useEffect, useState } from "react";
import {
  Activity,
  BookOpen,
  Clock3,
  FileText,
  MessageSquare,
  ShieldAlert,
  ThumbsUp,
  Users,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { obtenirDashboardAdmin } from "../../services/admin.service";
import type { StatistiquesAdmin } from "../../types/admin";

export default function AdminDashboardPage() {
  const [statistiques, setStatistiques] =
    useState<StatistiquesAdmin | null>(null);

  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    async function chargerDashboard() {
      try {
        const data = await obtenirDashboardAdmin();

        setStatistiques(data.statistiques);
      } catch (error) {
        console.error(error);
        setErreur(
          "Impossible de récupérer les statistiques."
        );
      } finally {
        setChargement(false);
      }
    }

    chargerDashboard();
  }, []);

  if (chargement) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-zinc-500">
          <Activity className="animate-pulse" size={20} />
          Chargement du tableau de bord...
        </div>
      </div>
    );
  }

  if (erreur || !statistiques) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <ShieldAlert className="mx-auto mb-3 text-red-500" size={32} />

          <h2 className="font-semibold text-zinc-900">
            Une erreur est survenue
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            {erreur}
          </p>
        </div>
      </Card>
    );
  }

  const cartes = [
    {
      titre: "Utilisateurs",
      valeur: statistiques.utilisateurs,
      description: "Utilisateurs inscrits",
      icon: Users,
    },
    {
      titre: "Expériences",
      valeur: statistiques.experiences.total,
      description: `${statistiques.experiences.publiees} publiées`,
      icon: BookOpen,
    },
    {
      titre: "Commentaires",
      valeur: statistiques.commentaires,
      description: "Discussions communautaires",
      icon: MessageSquare,
    },
    {
      titre: "Réactions",
      valeur: statistiques.reactions,
      description: "Interactions",
      icon: ThumbsUp,
    },
    {
      titre: "Signalements",
      valeur: statistiques.signalements.total,
      description: `${statistiques.signalements.enAttente} en attente`,
      icon: ShieldAlert,
    },
    {
      titre: "Notifications",
      valeur: statistiques.notifications,
      description: "Notifications générées",
      icon: Activity,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8">

      {/* En-tête */}
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            Vue d'ensemble
          </h1>

          <Badge variant="success">
            Administration
          </Badge>
        </div>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
          Surveillez l'activité de CodeDoctor,
          la communauté et les contenus publiés.
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cartes.map((carte) => {
          const Icon = carte.icon;

          return (
            <Card
              key={carte.titre}
              className="group p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-500">
                    {carte.titre}
                  </p>

                  <p className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900">
                    {carte.valeur}
                  </p>

                  <p className="mt-1 text-xs text-zinc-400">
                    {carte.description}
                  </p>
                </div>

                <div className="rounded-xl bg-zinc-100 p-2.5 text-zinc-600 transition group-hover:bg-zinc-900 group-hover:text-white">
                  <Icon size={20} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Activité */}
      <div className="grid gap-6 lg:grid-cols-2">

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-zinc-900">
                Expériences
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                État actuel des contenus
              </p>
            </div>

            <FileText size={20} className="text-zinc-400" />
          </div>

          <div className="mt-6 space-y-4">

            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600">
                Publiées
              </span>

              <span className="font-semibold text-zinc-900">
                {statistiques.experiences.publiees}
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
              <div
                className="h-full rounded-full bg-zinc-900 transition-all"
                style={{
                  width:
                    statistiques.experiences.total > 0
                      ? `${(statistiques.experiences.publiees /
                          statistiques.experiences.total) *
                          100}%`
                      : "0%",
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600">
                Masquées
              </span>

              <span className="font-semibold text-zinc-900">
                {statistiques.experiences.cachees}
              </span>
            </div>

          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-zinc-900">
                Signalements
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Modération de la communauté
              </p>
            </div>

            <Clock3 size={20} className="text-zinc-400" />
          </div>

          <div className="mt-6 flex items-end justify-between">

            <div>
              <p className="text-4xl font-semibold tracking-tight text-zinc-900">
                {statistiques.signalements.enAttente}
              </p>

              <p className="mt-1 text-sm text-zinc-500">
                signalement(s) en attente
              </p>
            </div>

            {statistiques.signalements.enAttente === 0 ? (
              <Badge variant="success">
                Tout est traité
              </Badge>
            ) : (
              <Badge variant="warning">
                À examiner
              </Badge>
            )}

          </div>
        </Card>

      </div>
    </div>
  );
}