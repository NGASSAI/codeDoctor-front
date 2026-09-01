import { useEffect, useState, useRef } from "react";
import {
  ArrowLeft,
  Bell,
  Code2,
  Menu,
  ExternalLink,
  CheckCheck,
  Check,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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

  const [menuNotificationOuvert, setMenuNotificationOuvert] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const utilisateur = useAuthStore((state) => state.utilisateur);

  // Zustand Store
  const notifications = useNotificationStore((state) => state.notifications);
  const notificationsNonLues = useNotificationStore(
    (state) => state.nombreNonLues
  );
  const chargerNotifications = useNotificationStore(
    (state) => state.chargerNotifications
  );
  const chargerCompteur = useNotificationStore(
    (state) => state.chargerCompteur
  );
  const initialiserEcoute = useNotificationStore(
    (state) => state.initialiserEcoute
  );
  const marquerCommeLue = useNotificationStore(
    (state) => state.marquerCommeLue
  );
  const marquerToutesCommeLues = useNotificationStore(
    (state) => state.marquerToutesCommeLues
  );

  useEffect(() => {
    void chargerCompteur();
    void chargerNotifications();

    const desabonner: unknown = initialiserEcoute();
    return () => {
      if (typeof desabonner === "function") {
        desabonner();
      }
    };
  }, [chargerCompteur, chargerNotifications, initialiserEcoute]);

  // Fermer le menu lors d'un clic à l'extérieur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setMenuNotificationOuvert(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const compteurNotifications = notificationsNonLues;

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

  const lienPageNotifications = admin
    ? "/admin/notifications"
    : "/notifications";

  // Prendre les 5 notifications les plus récentes pour l'aperçu
  const notificationsAffichees = notifications.slice(0, 5);

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

          {/* SECTION CLOCHE + DROPDOWN */}
          <div className="relative" ref={dropdownRef}>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setMenuNotificationOuvert((prev) => !prev);
              }}
              aria-label="Notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition hover:bg-blue-100 hover:text-blue-700"
            >
              <motion.div
                animate={
                  compteurNotifications > 0
                    ? { rotate: [0, -10, 10, -10, 10, 0] }
                    : {}
                }
                transition={{ duration: 0.5 }}
              >
                <Bell size={20} strokeWidth={2} />
              </motion.div>

              {compteurNotifications > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 10,
                  }}
                  className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[10px] font-bold leading-none text-white ring-2 ring-white shadow-sm"
                >
                  {compteurNotifications > 99
                    ? "99+"
                    : compteurNotifications}
                </motion.span>
              )}
            </motion.button>

            {/* Menu Popover */}
            <AnimatePresence>
              {menuNotificationOuvert && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-blue-100 bg-white p-4 shadow-xl shadow-blue-950/10 z-50"
                >
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-blue-950 text-sm">
                        Notifications
                      </h3>
                      {compteurNotifications > 0 && (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                          {compteurNotifications} nouvelle
                          {compteurNotifications > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>

                    {compteurNotifications > 0 && (
                      <button
                        type="button"
                        onClick={() => void marquerToutesCommeLues()}
                        className="text-[11px] font-medium text-blue-600 hover:text-blue-800 hover:underline transition"
                      >
                        Tout marquer comme lu
                      </button>
                    )}
                  </div>

                  {/* Liste des notifications */}
                  <div className="my-2 max-h-80 overflow-y-auto space-y-2 py-1">
                    {notificationsAffichees.length > 0 ? (
                      notificationsAffichees.map((notif) => (
                        <div
                          key={notif.id}
                          className={`flex items-start justify-between gap-2 rounded-xl p-2.5 transition ${
                            !notif.lue
                              ? "bg-blue-50/70 border border-blue-100"
                              : "bg-gray-50/50 hover:bg-gray-50"
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <p
                              className={`text-xs ${
                                !notif.lue
                                  ? "font-semibold text-blue-950"
                                  : "font-medium text-gray-700"
                              }`}
                            >
                              {notif.titre || notif.message}
                            </p>
                            {notif.titre && notif.message && (
                              <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">
                                {notif.message}
                              </p>
                            )}
                          </div>

                          {!notif.lue && (
                            <button
                              type="button"
                              title="Marquer comme lue"
                              onClick={() => void marquerCommeLue(notif.id)}
                              className="shrink-0 flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white transition"
                            >
                              <Check size={14} />
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6 text-gray-400 space-y-1">
                        <CheckCheck size={28} className="text-emerald-500" />
                        <p className="text-xs font-medium text-gray-600">
                          Toutes les notifications sont lues !
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-gray-100 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMenuNotificationOuvert(false);
                        navigate(lienPageNotifications);
                      }}
                      className="flex items-center justify-center gap-1.5 w-full rounded-xl bg-blue-50 py-2.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition cursor-pointer"
                    >
                      <span>Voir toutes les notifications</span>
                      <ExternalLink size={13} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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