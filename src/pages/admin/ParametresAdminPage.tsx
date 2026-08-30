import {
  Bell,
  ChevronRight,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
  Users,
  Activity,
} from "lucide-react";
import { Link } from "react-router-dom";

import Card from "../../components/ui/Card";

export default function ParametresAdminPage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      <section>
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
          <ShieldCheck size={14} />
          Administration
        </div>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-blue-950">
          Paramètres administrateur
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-700">
          Gérez votre profil administrateur, vos notifications et les
          éléments liés à la sécurité de votre compte.
        </p>
      </section>

      <div className="space-y-4">
        <Link
          to="/admin/profil"
          className="group block"
        >
          <Card className="border-blue-100 p-5 transition group-hover:-translate-y-0.5 group-hover:border-blue-200 group-hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/30">
                <UserRound size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-bold text-blue-950">
                  Profil administrateur
                </h2>

                <p className="mt-1 text-sm text-blue-700">
                  Modifier votre nom affiché et consulter
                  les informations de votre compte administrateur.
                </p>
              </div>

              <ChevronRight
                size={18}
                className="shrink-0 text-blue-400 transition group-hover:translate-x-0.5 group-hover:text-blue-600"
              />
            </div>
          </Card>
        </Link>

        <Link
          to="/admin/notifications"
          className="group block"
        >
          <Card className="border-blue-100 p-5 transition group-hover:-translate-y-0.5 group-hover:border-blue-200 group-hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Bell size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-bold text-blue-950">
                  Notifications
                </h2>

                <p className="mt-1 text-sm text-blue-700">
                  Consultez et gérez vos notifications administratives.
                </p>
              </div>

              <ChevronRight
                size={18}
                className="shrink-0 text-blue-400 transition group-hover:translate-x-0.5 group-hover:text-blue-600"
              />
            </div>
          </Card>
        </Link>

        <Link
          to="/admin/utilisateurs"
          className="group block"
        >
          <Card className="border-blue-100 p-5 transition group-hover:-translate-y-0.5 group-hover:border-blue-200 group-hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Users size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-bold text-blue-950">
                  Gestion des utilisateurs
                </h2>

                <p className="mt-1 text-sm text-blue-700">
                  Consultez et gérez les comptes utilisateurs de CodeDoctor.
                </p>
              </div>

              <ChevronRight
                size={18}
                className="shrink-0 text-blue-400 transition group-hover:translate-x-0.5 group-hover:text-blue-600"
              />
            </div>
          </Card>
        </Link>

        <Link
          to="/admin/dashboard"
          className="group block"
        >
          <Card className="border-blue-100 p-5 transition group-hover:-translate-y-0.5 group-hover:border-blue-200 group-hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Activity size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-bold text-blue-950">
                  Tableau de bord
                </h2>

                <p className="mt-1 text-sm text-blue-700">
                  Consultez les statistiques et l'activité globale de CodeDoctor.
                </p>
              </div>

              <ChevronRight
                size={18}
                className="shrink-0 text-blue-400 transition group-hover:translate-x-0.5 group-hover:text-blue-600"
              />
            </div>
          </Card>
        </Link>

        <Card className="border-blue-100 p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <LockKeyhole size={18} />
            </div>

            <div>
              <h2 className="text-sm font-bold text-blue-950">
                Sécurité
              </h2>

              <p className="mt-1 text-sm text-blue-700">
                La gestion du mot de passe utilise le
                système sécurisé de réinitialisation
                CodeDoctor.
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-blue-100 p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Mail size={18} />
            </div>

            <div>
              <h2 className="text-sm font-bold text-blue-950">
                Assistance
              </h2>

              <p className="mt-1 text-sm text-blue-700">
                Pour un problème de compte ou de paiement,
                utilisez les boutons de contact prévus
                dans l'application.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
