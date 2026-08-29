
import { useEffect, useState } from "react";
import {
  Bell,
  Code2,
  Menu,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-40 border-b border-blue-200/80 bg-white/95 backdrop-blur-xl"
    >
      <div className="flex h-68px items-center justify-between px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-3"
        >
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-xl p-2 text-zinc-600 transition hover:bg-blue-50 hover:text-blue-600 lg:hidden"
            aria-label="Ouvrir le menu"
          >
            <Menu size={21} />
          </button>

          <Link
            to={admin ? "/admin" : "/dashboard"}
            className="flex items-center gap-2.5"
          >
            <motion.div 
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/30"
            >
              <Code2
                size={18}
                strokeWidth={2.2}
              />
            </motion.div>

            <div>
              <p className="text-[17px] font-bold tracking-tight text-zinc-950">
                CodeDoctor
              </p>

              <p className="hidden text-[10px] font-medium uppercase tracking-[0.16em] text-blue-500 sm:block">
                {admin
                  ? "Administration"
                  : "Espace utilisateur"}
              </p>
            </div>
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-2"
        >
          <div className="hidden items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 sm:flex">
            <motion.span 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-1.5 w-1.5 rounded-full bg-emerald-500" 
            />

            <span className="text-xs font-medium text-zinc-600">
              Système opérationnel
            </span>
          </div>

          {!admin && (
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
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
                className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition hover:bg-blue-100 hover:text-blue-700"
              >
                <motion.div
                  animate={notificationsNonLues > 0 ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <Bell size={20} strokeWidth={2} />
                </motion.div>

                {notificationsNonLues > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 10 }}
                    className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[10px] font-bold leading-none text-white ring-2 ring-white shadow-sm"
                  >
                    {notificationsNonLues > 99
                      ? "99+"
                      : notificationsNonLues}
                  </motion.span>
                )}
              </Link>
            </motion.div>
          )}

          <motion.div
            whileHover={{ scale: 1.1 }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 text-xs font-semibold text-white shadow-md shadow-blue-500/30"
          >
            {admin ? "A" : "U"}
          </motion.div>
        </motion.div>
      </div>
    </motion.header>
  );
}
