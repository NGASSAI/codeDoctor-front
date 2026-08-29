
import { useEffect, useState } from "react";
import {
  Bell,
  Code2,
  Menu,
} from "lucide-react";
import { Link } from "react-router-dom";

import { compterNotificationsNonLues } from "../../services/notification.service";
import {
  ecouterNotification,
} from "../../services/socket.service";

interface NavbarProps {
  onMenuClick?: () => void;
  admin?: boolean;
}

export default function Navbar({
  onMenuClick,
  admin = false,
}: NavbarProps) {
  const [notificationsNonLues, setNotificationsNonLues] =
    useState(0);

  useEffect(() => {
    if (admin) {
      return;
    }

    let actif = true;

    async function chargerCompteur() {
      try {
        const nombre =
          await compterNotificationsNonLues();

        if (actif) {
          setNotificationsNonLues(nombre);
        }
      } catch (error) {
        console.error(
          "Erreur compteur notifications :",
          error
        );
      }
    }

    void chargerCompteur();

    const arreterEcoute =
      ecouterNotification(() => {
        setNotificationsNonLues(
          (ancien) => ancien + 1
        );
      });

    return () => {
      actif = false;
      arreterEcoute();
    };
  }, [admin]);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/95 backdrop-blur-xl">
      <div className="flex h-68px items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-xl p-2 text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950 lg:hidden"
            aria-label="Ouvrir le menu"
          >
            <Menu size={21} />
          </button>

          <Link
            to={admin ? "/admin" : "/dashboard"}
            className="flex items-center gap-2.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-950 text-white shadow-sm">
              <Code2
                size={18}
                strokeWidth={2.2}
              />
            </div>

            <div>
              <p className="text-[17px] font-bold tracking-tight text-zinc-950">
                CodeDoctor
              </p>

              <p className="hidden text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-400 sm:block">
                {admin
                  ? "Administration"
                  : "Espace utilisateur"}
              </p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

            <span className="text-xs font-medium text-zinc-600">
              Système opérationnel
            </span>
          </div>

          {!admin && (
            <Link
              to="/notifications"
              aria-label={
                notificationsNonLues > 0
                  ? `Notifications, ${notificationsNonLues} non lue${
                      notificationsNonLues > 1
                        ? "s"
                        : ""
                    }`
                  : "Notifications"
              }
              className="relative flex h-9 w-9 items-center justify-center rounded-xl text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950"
            >
              <Bell size={19} />

              {notificationsNonLues > 0 && (
                <span className="absolute -right-1 -top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-zinc-950 px-1 text-[9px] font-bold leading-none text-white ring-2 ring-white">
                  {notificationsNonLues > 99
                    ? "99+"
                    : notificationsNonLues}
                </span>
              )}
            </Link>
          )}

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white">
            {admin ? "A" : "U"}
          </div>
        </div>
      </div>
    </header>
  );
}
