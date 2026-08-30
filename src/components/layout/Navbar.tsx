import { useEffect } from "react";
import {
  ArrowLeft,
  Bell,
  Code2,
  Menu,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { useNotificationStore } from "../../stores/notification.store";
import { useAuthStore } from "../../stores/auth.store";

interface NavbarProps {
  onMenuClick?: () => void;
  admin?: boolean;
  showBackButton?: boolean;
}

export default function Navbar({
  onMenuClick,
  admin = false,
  showBackButton = true,
}: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const utilisateur = useAuthStore((state) => state.utilisateur);

  const notificationsNonLues = useNotificationStore(
    (state) => state.nombreNonLues
  );
  const chargerCompteur = useNotificationStore(
    (state) => state.chargerCompteur
  );
  const initialiserEcoute = useNotificationStore(
    (state) => state.initialiserEcoute
  );

  useEffect(() => {
    void chargerCompteur();
    initialiserEcoute();
  }, [chargerCompteur, initialiserEcoute]);

  const estPageAccueil = admin
    ? location.pathname === "/admin" ||
      location.pathname === "/admin/dashboard"
    : location.pathname === "/dashboard";

  function handleRetour() {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(admin ? "/admin/dashboard" : "/dashboard");
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-40 border-b border-blue-100 bg-white/95 backdrop-blur-xl shadow-sm"
    >
      <div className="flex h-17 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-xl p-2 text-blue-700 transition hover:bg-blue-50 hover:text-blue-800 lg:hidden"
            aria-label="Ouvrir le menu"
          >
            <Menu size={21} />
          </button>

          {showBackButton && !estPageAccueil && (
            <motion.button
              type="button"
              onClick={handleRetour}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="hidden items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition hover:border-blue-200 hover:bg-blue-100 hover:text-blue-800 sm:flex"
              aria-label="Retour"
            >
              <ArrowLeft size={17} />
              <span>Retour</span>
            </motion.button>
          )}

          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/30"
            >
              <Code2 size={18} strokeWidth={2.2} />
            </motion.div>

            <div className="min-w-0">
              <p className="truncate text-[17px] font-bold tracking-tight text-blue-950">
                CodeDoctor
              </p>

              <p className="hidden text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-500 sm:block">
                {admin ? "Administration" : "Espace utilisateur"}
              </p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 sm:flex">
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-1.5 w-1.5 rounded-full bg-emerald-500"
            />
            <span className="text-xs font-medium text-blue-700">
              Système opérationnel
            </span>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to={admin ? "/admin/notifications" : "/notifications"}
              aria-label={
                notificationsNonLues > 0
                  ? `Notifications, ${notificationsNonLues} non lue${
                      notificationsNonLues > 1 ? "s" : ""
                    }`
                  : "Notifications"
              }
              className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition hover:bg-blue-100 hover:text-blue-700"
            >
              <motion.div
                animate={
                  notificationsNonLues > 0
                    ? { rotate: [0, -10, 10, -10, 10, 0] }
                    : {}
                }
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
                  {notificationsNonLues > 99 ? "99+" : notificationsNonLues}
                </motion.span>
              )}
            </Link>
          </motion.div>

          <div
            className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-blue-600 to-cyan-600 text-xs font-bold text-white shadow-md shadow-blue-500/30"
            title={
              utilisateur?.displayName ??
              utilisateur?.email ??
              (admin ? "Administrateur" : "Utilisateur")
            }
          >
            {admin ? "A" : "U"}
          </div>
        </div>
      </div>
    </motion.header>
  );
}