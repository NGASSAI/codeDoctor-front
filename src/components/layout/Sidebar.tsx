import {
  Bell,
  BookOpen,
  BrainCircuit,
  CreditCard,
  History,
  Home,
  MessageCircle,
  Settings,
  ShieldCheck,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { motion } from "framer-motion";

import { NavLink } from "react-router-dom";

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
  admin?: boolean;
}

export default function Sidebar({
  open = true,
  onClose,
  admin = false,
}: SidebarProps) {
  const items = admin
    ? [
        {
          label: "Vue d'ensemble",
          icon: Home,
          path: "/admin",
        },
        {
  label: "Discussions",
  icon: MessageCircle,
  path: "/discussions",
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

  return (
    <>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: open ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`
          fixed inset-y-0 left-0 z-50
          w-64 border-r border-blue-200/80
          bg-white/95 backdrop-blur-xl
          transition-transform duration-300
          lg:static lg:z-auto lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex h-full flex-col">
          {/* En-tête mobile */}

          <div className="flex items-center justify-between px-4 py-5 lg:hidden">
            <span className="text-sm font-semibold text-zinc-900">
              Menu
            </span>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={onClose}
              className="
                rounded-lg
                p-2
                text-zinc-500
                transition
                hover:bg-blue-50
                hover:text-blue-600
              "
              aria-label="Fermer le menu"
            >
              <X size={19} />
            </motion.button>
          </div>

          {/* Navigation */}

          <div className="flex-1 overflow-y-auto px-3 pt-6 lg:pt-7">
            <p
              className="
                px-3
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.16em]
                text-zinc-400
              "
            >
              {admin ? "Administration" : "Navigation"}
            </p>

            <nav className="mt-3 space-y-1">
              {items.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    end={
                      item.path === "/admin" ||
                      item.path === "/dashboard" ||
                      item.path === "/exercices" ||
                      item.path === "/historique" ||
                      item.path === "/notifications" ||
                      item.path === "/premium" ||
                      item.path === "/profil" ||
                      item.path === "/parametres" ||
                      item.path === "/diagnostic"
                    }
                    className={({ isActive }) =>
                      `
                      group
                      flex
                      items-center
                      gap-3
                      rounded-xl
                      px-3
                      py-2.5
                      text-sm
                      font-medium
                      transition-all
                      ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/30"
                          : "text-zinc-600 hover:bg-blue-50 hover:text-blue-700"
                      }
                      `
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          size={18}
                          strokeWidth={isActive ? 2.2 : 1.9}
                        />

                        <span>{item.label}</span>

                        {!admin &&
                          item.path ===
                            "/notifications" && (
                            <span className="ml-auto h-2 w-2 rounded-full bg-zinc-300 group-[.active]:bg-white" />
                          )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Bloc inférieur */}

          <div className="mt-auto border-t border-zinc-100 p-4">
            <div className="rounded-xl bg-zinc-50 px-3 py-3">
              <p className="text-xs font-medium text-zinc-900">
                {admin
                  ? "Espace administrateur"
                  : "Espace utilisateur"}
              </p>

              <p
                className="
                  mt-1
                  text-[11px]
                  leading-4
                  text-zinc-500
                "
              >
                {admin
                  ? "Gestion et supervision de CodeDoctor"
                  : "Accédez à vos fonctionnalités CodeDoctor"}
              </p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
