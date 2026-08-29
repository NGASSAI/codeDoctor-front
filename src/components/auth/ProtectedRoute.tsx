import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/auth.store";

interface ProtectedRouteProps {
  adminOnly?: boolean;
}

export default function ProtectedRoute({
  adminOnly = false,
}: ProtectedRouteProps) {
  const location = useLocation();

  const {
    connecte,
    initialise,
    utilisateur,
  } = useAuthStore();

  /*
   * Au démarrage de l'application, on laisse
   * le store récupérer la session depuis localStorage.
   */
  if (!initialise) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="flex items-center gap-3 text-sm text-zinc-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-950" />
          Chargement...
        </div>
      </div>
    );
  }

  /*
   * Aucun utilisateur connecté.
   */
  if (!connecte || !utilisateur) {
    return (
      <Navigate
        to="/connexion"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  /*
   * Une route réservée aux administrateurs
   * ne doit jamais être accessible à un USER.
   */
  if (adminOnly && utilisateur.role !== "ADMIN") {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return <Outlet />;
}