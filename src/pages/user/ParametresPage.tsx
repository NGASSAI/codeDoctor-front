
import {
  Bell,
  ChevronRight,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";

import Card from "../../components/ui/Card";

export default function ParametresPage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      <section>
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600">
          <ShieldCheck size={14} />
          Paramètres
        </div>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950">
          Paramètres du compte
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
          Gérez votre profil, vos notifications et les
          éléments liés à la sécurité de votre compte.
        </p>
      </section>

      <div className="space-y-4">
        <Link
          to="/profil"
          className="group block"
        >
          <Card className="p-5 transition group-hover:-translate-y-0.5 group-hover:border-zinc-300 group-hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-950 text-white">
                <UserRound size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-semibold text-zinc-950">
                  Profil
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Modifier votre nom affiché et consulter
                  les informations de votre compte.
                </p>
              </div>

              <ChevronRight
                size={18}
                className="shrink-0 text-zinc-400 transition group-hover:translate-x-0.5 group-hover:text-zinc-950"
              />
            </div>
          </Card>
        </Link>

        <Link
          to="/notifications"
          className="group block"
        >
          <Card className="p-5 transition group-hover:-translate-y-0.5 group-hover:border-zinc-300 group-hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700">
                <Bell size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-semibold text-zinc-950">
                  Notifications
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Consultez et gérez vos notifications
                  CodeDoctor.
                </p>
              </div>

              <ChevronRight
                size={18}
                className="shrink-0 text-zinc-400 transition group-hover:translate-x-0.5 group-hover:text-zinc-950"
              />
            </div>
          </Card>
        </Link>

        <Link
          to="/premium"
          className="group block"
        >
          <Card className="p-5 transition group-hover:-translate-y-0.5 group-hover:border-zinc-300 group-hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700">
                <ShieldCheck size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-semibold text-zinc-950">
                  Abonnement Premium
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Consultez votre abonnement et vos
                  demandes de paiement.
                </p>
              </div>

              <ChevronRight
                size={18}
                className="shrink-0 text-zinc-400 transition group-hover:translate-x-0.5 group-hover:text-zinc-950"
              />
            </div>
          </Card>
        </Link>

        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700">
              <LockKeyhole size={18} />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-zinc-950">
                Sécurité
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                La gestion du mot de passe utilise le
                système sécurisé de réinitialisation
                CodeDoctor.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700">
              <Mail size={18} />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-zinc-950">
                Assistance
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
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
