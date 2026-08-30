import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { lazy, Suspense } from "react";

import PublicLayout from "../layouts/PublicLayout";
import AuthLayout from "../layouts/AuthLayout";
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";

import ProtectedRoute from "../components/auth/ProtectedRoute";
import PageTransition from "../components/ui/PageTransition";
import { TableSkeleton } from "../components/ui/TableSkeleton";

/* Public */
const AccueilPage = lazy(() => import("../pages/public/AccueilPage"));
const ExperiencesPage = lazy(() => import("../pages/public/ExperiencesPage"));
const ExperienceDetailPage = lazy(() => import("../pages/public/ExperienceDetailPage"));

/* Auth */
const ConnexionPage = lazy(() => import("../pages/auth/ConnexionPage"));
const InscriptionPage = lazy(() => import("../pages/auth/InscriptionPage"));
const MotDePasseOubliePage = lazy(() => import("../pages/auth/MotDePasseOubliePage"));
const ReinitialiserMotDePassePage = lazy(() => import("../pages/auth/ReinitialiserMotDePassePage"));
const VerificationEmailPage = lazy(() => import("../pages/auth/VerificationEmailPage"));

/* User */
const DashboardPage = lazy(() => import("../pages/user/DashboardPage"));
const ExercicesPage = lazy(() => import("../pages/user/ExercicesPage"));
const ExerciceDetailPage = lazy(() => import("../pages/user/ExerciceDetailPage"));
const DiagnosticPage = lazy(() => import("../pages/user/DiagnosticPage"));
const HistoriquePage = lazy(() => import("../pages/user/HistoriquePage"));
const HistoriqueDetailPage = lazy(() => import("../pages/user/HistoriqueDetailPage"));
const PremiumPage = lazy(() => import("../pages/user/PremiumPage"));
const NotificationsPage = lazy(() => import("../pages/user/NotificationsPage"));
const ProfilPage = lazy(() => import("../pages/user/ProfilPage"));
const ParametresPage = lazy(() => import("../pages/user/ParametresPage"));
const DiscussionsPage = lazy(() => import("../pages/user/DiscussionsPage"));
const ConversationPage = lazy(() => import("../pages/user/ConversationPage"));

/* Admin */
const NotificationsAdminPage = lazy(() => import("../pages/admin/NotificationsAdminPage"));
const AdminDashboardPage = lazy(() => import("../pages/admin/AdminDashboardPage"));
const UtilisateursAdminPage = lazy(() => import("../pages/admin/UtilisateursAdminPage"));
const ExperiencesAdminPage = lazy(() => import("../pages/admin/ExperiencesAdminPage"));
const PaiementsAdminPage = lazy(() => import("../pages/admin/PaiementsAdminPage"));
const SignalementsAdminPage = lazy(() => import("../pages/admin/SignalementsAdminPage"));
const ProfilAdminPage = lazy(() => import("../pages/admin/ProfilAdminPage"));
const ParametresAdminPage = lazy(() => import("../pages/admin/ParametresAdminPage"));

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =====================================================
            ESPACE PUBLIC
        ====================================================== */}

        <Route element={<PublicLayout />}>
          <Route
            path="/"
            element={
              <Suspense fallback={<TableSkeleton />}>
                <PageTransition><AccueilPage /></PageTransition>
              </Suspense>
            }
          />

          <Route
            path="/experiences"
            element={
              <Suspense fallback={<TableSkeleton />}>
                <PageTransition><ExperiencesPage /></PageTransition>
              </Suspense>
            }
          />

          <Route
            path="/experiences/:id"
            element={
              <Suspense fallback={<TableSkeleton />}>
                <PageTransition><ExperienceDetailPage /></PageTransition>
              </Suspense>
            }
          />
        </Route>

        {/* =====================================================
            AUTHENTIFICATION
        ====================================================== */}

        <Route element={<AuthLayout />}>
          <Route
            path="/connexion"
            element={
              <Suspense fallback={<TableSkeleton />}>
                <PageTransition><ConnexionPage /></PageTransition>
              </Suspense>
            }
          />

          <Route
            path="/inscription"
            element={
              <Suspense fallback={<TableSkeleton />}>
                <PageTransition><InscriptionPage /></PageTransition>
              </Suspense>
            }
          />

          <Route
            path="/mot-de-passe-oublie"
            element={
              <Suspense fallback={<TableSkeleton />}>
                <PageTransition><MotDePasseOubliePage /></PageTransition>
              </Suspense>
            }
          />

          <Route
            path="/reinitialiser-mot-de-passe"
            element={
              <Suspense fallback={<TableSkeleton />}>
                <PageTransition><ReinitialiserMotDePassePage /></PageTransition>
              </Suspense>
            }
          />

          <Route
            path="/verification-email"
            element={
              <Suspense fallback={<TableSkeleton />}>
                <PageTransition><VerificationEmailPage /></PageTransition>
              </Suspense>
            }
          />
        </Route>

        {/* =====================================================
            ESPACE UTILISATEUR
        ====================================================== */}

        <Route element={<ProtectedRoute />}>
          <Route element={<UserLayout />}>
            <Route
              path="/dashboard"
              element={
                <Suspense fallback={<TableSkeleton />}>
                  <PageTransition><DashboardPage /></PageTransition>
                </Suspense>
              }
            />

            <Route
              path="/diagnostic"
              element={
                <Suspense fallback={<TableSkeleton />}>
                  <PageTransition><DiagnosticPage /></PageTransition>
                </Suspense>
              }
            />

            <Route
              path="/exercices"
              element={
                <Suspense fallback={<TableSkeleton />}>
                  <PageTransition><ExercicesPage /></PageTransition>
                </Suspense>
              }
            />

            <Route
              path="/exercices/:id"
              element={
                <Suspense fallback={<TableSkeleton />}>
                  <PageTransition><ExerciceDetailPage /></PageTransition>
                </Suspense>
              }
            />

            <Route
              path="/historique"
              element={
                <Suspense fallback={<TableSkeleton />}>
                  <PageTransition><HistoriquePage /></PageTransition>
                </Suspense>
              }
            />

            <Route
              path="/historique/:id"
              element={
                <Suspense fallback={<TableSkeleton />}>
                  <PageTransition><HistoriqueDetailPage /></PageTransition>
                </Suspense>
              }
            />

            <Route
              path="/historique/conversations/:id"
              element={
                <Suspense fallback={<TableSkeleton />}>
                  <PageTransition><ConversationPage /></PageTransition>
                </Suspense>
              }
            />

            <Route
              path="/discussions"
              element={
                <Suspense fallback={<TableSkeleton />}>
                  <PageTransition><DiscussionsPage /></PageTransition>
                </Suspense>
              }
            />

            <Route
              path="/premium"
              element={
                <Suspense fallback={<TableSkeleton />}>
                  <PageTransition><PremiumPage /></PageTransition>
                </Suspense>
              }
            />

            <Route
              path="/notifications"
              element={
                <Suspense fallback={<TableSkeleton />}>
                  <PageTransition><NotificationsPage /></PageTransition>
                </Suspense>
              }
            />

            <Route
              path="/profil"
              element={
                <Suspense fallback={<TableSkeleton />}>
                  <PageTransition><ProfilPage /></PageTransition>
                </Suspense>
              }
            />

            <Route
              path="/parametres"
              element={
                <Suspense fallback={<TableSkeleton />}>
                  <PageTransition><ParametresPage /></PageTransition>
                </Suspense>
              }
            />
          </Route>
        </Route>

        {/* =====================================================
            ESPACE ADMINISTRATION
        ====================================================== */}
{/* =====================================================
    ESPACE ADMINISTRATION
====================================================== */}
<Route element={<ProtectedRoute adminOnly />}>
  <Route element={<AdminLayout />}>

    <Route
      path="/admin"
      element={
        <Suspense fallback={<TableSkeleton />}>
          <PageTransition><AdminDashboardPage /></PageTransition>
        </Suspense>
      }
    />

    <Route
      path="/admin/dashboard"
      element={
        <Suspense fallback={<TableSkeleton />}>
          <PageTransition><AdminDashboardPage /></PageTransition>
        </Suspense>
      }
    />

    <Route
      path="/admin/notifications"
      element={
        <Suspense fallback={<TableSkeleton />}>
          <PageTransition><NotificationsAdminPage /></PageTransition>
        </Suspense>
      }
    />

    <Route
      path="/admin/utilisateurs"
      element={
        <Suspense fallback={<TableSkeleton />}>
          <PageTransition><UtilisateursAdminPage /></PageTransition>
        </Suspense>
      }
    />

    <Route
      path="/admin/experiences"
      element={
        <Suspense fallback={<TableSkeleton />}>
          <PageTransition><ExperiencesAdminPage /></PageTransition>
        </Suspense>
      }
    />

    <Route
      path="/admin/paiements"
      element={
        <Suspense fallback={<TableSkeleton />}>
          <PageTransition><PaiementsAdminPage /></PageTransition>
        </Suspense>
      }
    />

    <Route
      path="/admin/signalements"
      element={
        <Suspense fallback={<TableSkeleton />}>
          <PageTransition><SignalementsAdminPage /></PageTransition>
        </Suspense>
      }
    />

    <Route
      path="/admin/profil"
      element={
        <Suspense fallback={<TableSkeleton />}>
          <PageTransition><ProfilAdminPage /></PageTransition>
        </Suspense>
      }
    />

    <Route
      path="/admin/parametres"
      element={
        <Suspense fallback={<TableSkeleton />}>
          <PageTransition><ParametresAdminPage /></PageTransition>
        </Suspense>
      }
    />

  </Route>
</Route>
        
        

        {/* =====================================================
            ROUTE INCONNUE
        ====================================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}