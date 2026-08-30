
import {
  Bell,
  BookOpen,
  BrainCircuit,
  CreditCard,
  History,
  Home,
  LogOut,
  MessageCircle,
  Settings,
  ShieldCheck,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";

import { useAuthStore } from "../../stores/auth.store";

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
  admin?: boolean;
}

export default function Sidebar({
  open = false,
  onClose,
  admin = false,
}: SidebarProps) {
  const navigate = useNavigate();

  const utilisateur = useAuthStore(
    (state) => state.utilisateur
  );

  const deconnecter = useAuthStore(
    (state) => state.deconnecter
  );

  const items = admin
    ? [
        {
          label: "Vue d'ensemble",
          icon: Home,
          path: "/admin",
        },
        {
          label: "Utilisateurs",
          icon: Users,
          path: "/admin/utilisateurs",
        },
        {
          label: "Expériences",
          icon: BookOpen,
          path: "/admin/experiences",
        },
        {
          label: "Paiements",
          icon: CreditCard,
          path: "/admin/paiements",
        },
        {
          label: "Signalements",
          icon: ShieldCheck,
          path: "/admin/signalements",
        },
        {
          label: "Profil",
          icon: UserRound,
          path: "/admin/profil",
        },
        {
          label: "Paramètres",
          icon: Settings,
          path: "/admin/parametres",
        },
      ]
    : [
        {
          label: "Tableau de bord",
          icon: Home,
          path: "/dashboard",
        },
        {
          label: "Diagnostic",
          icon: BrainCircuit,
          path: "/diagnostic",
        },
        {
          label: "Exercices",
          icon: BookOpen,
          path: "/exercices",
        },
        {
          label: "Historique",
          icon: History,
          path: "/historique",
        },
        {
          label: "Discussions",
          icon: MessageCircle,
          path: "/discussions",
        },
        {
          label: "Notifications",
          icon: Bell,
          path: "/notifications",
        },
        {
          label: "Premium",
          icon: CreditCard,
          path: "/premium",
        },
        {
          label: "Profil",
          icon: UserRound,
          path: "/profil",
        },
        {
          label: "Paramètres",
          icon: Settings,
          path: "/parametres",
        },
      ];

  function gererDeconnexion() {
    deconnecter();

    onClose?.();

    navigate("/connexion", {
      replace: true,
    });
  }

  function estRouteExacte(path: string) {
    return (
      path === "/admin" ||
      path === "/admin/dashboard" ||
      path === "/admin/profil" ||
      path === "/admin/parametres" ||
      path === "/dashboard" ||
      path === "/exercices" ||
      path === "/historique" ||
      path === "/notifications" ||
      path === "/premium" ||
      path === "/profil" ||
      path === "/parametres" ||
      path === "/diagnostic"
    );
  }

  const contenuSidebar = (
    <div className="flex h-full min-h-0 flex-col">

      {/* =========================
          EN-TÊTE MOBILE
      ========================== */}
      <div className="flex items-center justify-between border-b border-blue-100 px-5 py-4 lg:hidden">
        <div>
          <p className="text-sm font-bold text-blue-950">
            {admin ? "Administration" : "CodeDoctor"}
          </p>

          <p className="mt-0.5 text-xs text-blue-500">
            {admin
              ? "Espace administrateur"
              : "Espace utilisateur"}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="
            rounded-xl
            p-2
            text-blue-500
            transition
            hover:bg-blue-50
            hover:text-blue-700
          "
          aria-label="Fermer le menu"
        >
          <X size={20} />
        </button>
      </div>

      {/* =========================
          IDENTITÉ
      ========================== */}
      <div className="border-b border-blue-100 px-5 py-5">
        <div className="flex items-center gap-3">

          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-linear-to-br
              from-blue-600
              to-cyan-500
              text-sm
              font-bold
              text-white
              shadow-md
              shadow-blue-500/20
            "
          >
            {admin ? "A" : "U"}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-blue-950">
              {utilisateur?.displayName ||
                (admin
                  ? "Administrateur"
                  : "Utilisateur")}
            </p>

            <p className="truncate text-xs text-blue-500">
              {utilisateur?.email || ""}
            </p>
          </div>

        </div>
      </div>

      {/* =========================
          NAVIGATION
      ========================== */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6">

        <p
          className="
            px-3
            text-[11px]
            font-bold
            uppercase
            tracking-[0.16em]
            text-blue-400
          "
        >
          {admin
            ? "Administration"
            : "Navigation"}
        </p>

        <nav className="mt-3 space-y-1.5">

          {items.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                end={estRouteExacte(item.path)}
                className={({ isActive }) =>
                  `
                    group
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    px-3.5
                    py-3
                    text-sm
                    font-medium
                    transition-all
                    ${
                      isActive
                        ? `
                        bg-linear-to-r
                          from-blue-600
                          to-cyan-500
                          text-white
                          shadow-md
                          shadow-blue-500/20
                        `
                        : `
                          text-blue-900
                          hover:bg-blue-50
                          hover:text-blue-700
                        `
                    }
                  `
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        transition
                        ${
                          isActive
                            ? "bg-white/15"
                            : "bg-blue-50 group-hover:bg-blue-100"
                        }
                      `}
                    >
                      <Icon
                        size={18}
                        strokeWidth={
                          isActive ? 2.3 : 2
                        }
                      />
                    </span>

                    <span className="truncate">
                      {item.label}
                    </span>

                    {isActive && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}

        </nav>
      </div>

      {/* =========================
          PARTIE BASSE
      ========================== */}
      <div className="border-t border-blue-100 p-4">

        <div
          className="
            mb-3
            rounded-xl
            border
            border-blue-100
            bg-blue-50/70
            px-3
            py-3
          "
        >
          <p className="text-xs font-semibold text-blue-900">
            {admin
              ? "Espace administrateur"
              : "Espace utilisateur"}
          </p>

          <p className="mt-1 text-[11px] leading-4 text-blue-600">
            {admin
              ? "Gestion et supervision de CodeDoctor"
              : "Accédez à vos fonctionnalités CodeDoctor"}
          </p>
        </div>

        {/* Déconnexion */}
        <button
          type="button"
          onClick={gererDeconnexion}
          className="
            group
            flex
            w-full
            items-center
            gap-3
            rounded-xl
            border
            border-blue-100
            bg-white
            px-3.5
            py-3
            text-sm
            font-semibold
            text-blue-700
            transition
            hover:border-blue-200
            hover:bg-blue-50
            hover:text-blue-800
          "
        >
          <span
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              bg-blue-50
              transition
              group-hover:bg-blue-100
            "
          >
            <LogOut
              size={18}
              strokeWidth={2}
            />
          </span>

          <span>Déconnexion</span>
        </button>

      </div>
    </div>
  );

  return (
    <>
      {/* =========================
          SIDEBAR DESKTOP
          Toujours visible à partir de lg
      ========================== */}
      <aside
        className="
          hidden
          h-[calc(100vh-68px)]
          w-72
          shrink-0
          flex-col
          border-r
          border-blue-100
          bg-white
          shadow-xl
          shadow-blue-900/5
          lg:flex
          lg:sticky
        lg:top-17
        "
      >
        {contenuSidebar}
      </aside>

      {/* =========================
          SIDEBAR MOBILE
      ========================== */}
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="
                fixed
                inset-0
                z-40
                bg-blue-950/30
                backdrop-blur-sm
                lg:hidden
              "
              onClick={onClose}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className="
                fixed
                inset-y-0
                left-0
                z-50
                flex
                w-72
                flex-col
                border-r
                border-blue-100
                bg-white
                shadow-2xl
                shadow-blue-950/20
                lg:hidden
              "
            >
              {contenuSidebar}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
