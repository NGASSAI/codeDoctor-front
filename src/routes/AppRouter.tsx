import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import AuthLayout from "../layouts/AuthLayout";
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";

import ProtectedRoute from "../components/auth/ProtectedRoute";

/* Public */
import AccueilPage from "../pages/public/AccueilPage";
import ExperiencesPage from "../pages/public/ExperiencesPage";
import ExperienceDetailPage from "../pages/public/ExperienceDetailPage";

/* Auth */
import ConnexionPage from "../pages/auth/ConnexionPage";
import InscriptionPage from "../pages/auth/InscriptionPage";
import MotDePasseOubliePage from "../pages/auth/MotDePasseOubliePage";
import ReinitialiserMotDePassePage from "../pages/auth/ReinitialiserMotDePassePage";
import VerificationEmailPage from "../pages/auth/VerificationEmailPage";

/* User */
import DashboardPage from "../pages/user/DashboardPage";
import ExercicesPage from "../pages/user/ExercicesPage";
import ExerciceDetailPage from "../pages/user/ExerciceDetailPage";
import DiagnosticPage from "../pages/user/DiagnosticPage";
import HistoriquePage from "../pages/user/HistoriquePage";
import HistoriqueDetailPage from "../pages/user/HistoriqueDetailPage";
import PremiumPage from "../pages/user/PremiumPage";
import NotificationsPage from "../pages/user/NotificationsPage";
import ProfilPage from "../pages/user/ProfilPage";
import ParametresPage from "../pages/user/ParametresPage";
import DiscussionsPage from "../pages/user/DiscussionsPage";
import ConversationPage from "../pages/user/ConversationPage";

/* Admin */
import NotificationsAdminPage from "../pages/admin/NotificationsAdminPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import UtilisateursAdminPage from "../pages/admin/UtilisateursAdminPage";
import ExperiencesAdminPage from "../pages/admin/ExperiencesAdminPage";
import PaiementsAdminPage from "../pages/admin/PaiementsAdminPage";
import SignalementsAdminPage from "../pages/admin/SignalementsAdminPage";

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
            element={<AccueilPage />}
          />

          <Route
            path="/experiences"
            element={<ExperiencesPage />}
          />

          <Route
            path="/experiences/:id"
            element={<ExperienceDetailPage />}
          />
        </Route>

        {/* =====================================================
            AUTHENTIFICATION
        ====================================================== */}

        <Route element={<AuthLayout />}>
          <Route
            path="/connexion"
            element={<ConnexionPage />}
          />

          <Route
            path="/inscription"
            element={<InscriptionPage />}
          />

          <Route
            path="/mot-de-passe-oublie"
            element={<MotDePasseOubliePage />}
          />

          <Route
            path="/reinitialiser-mot-de-passe"
            element={<ReinitialiserMotDePassePage />}
          />

          <Route
            path="/verification-email"
            element={<VerificationEmailPage />}
          />
        </Route>

        {/* =====================================================
            ESPACE UTILISATEUR
        ====================================================== */}

        <Route element={<ProtectedRoute />}>
          <Route element={<UserLayout />}>
            <Route
              path="/dashboard"
              element={<DashboardPage />}
            />

            <Route
              path="/diagnostic"
              element={<DiagnosticPage />}
            />

            <Route
              path="/exercices"
              element={<ExercicesPage />}
            />

            <Route
              path="/exercices/:id"
              element={<ExerciceDetailPage />}
            />

            <Route
              path="/historique"
              element={<HistoriquePage />}
            />

            <Route
              path="/historique/:id"
              element={<HistoriqueDetailPage />}
            />

            <Route
              path="/historique/conversations/:id"
              element={<ConversationPage />}
            />

            <Route
              path="/discussions"
              element={<DiscussionsPage />}
            />

            <Route
              path="/premium"
              element={<PremiumPage />}
            />

            <Route
              path="/notifications"
              element={<NotificationsPage />}
            />

            <Route
              path="/profil"
              element={<ProfilPage />}
            />

            <Route
              path="/parametres"
              element={<ParametresPage />}
            />
          </Route>
        </Route>

        {/* =====================================================
            ESPACE ADMINISTRATION
        ====================================================== */}
  <Route element={<AdminLayout />}>

      <Route
        path="/admin"
        element={<AdminDashboardPage />}
      />

      <Route
        path="/admin/dashboard"
        element={<AdminDashboardPage />}
      />

      <Route
        path="/admin/notifications"
        element={<NotificationsAdminPage />}
      />

  <Route
    path="/admin/utilisateurs"
    element={<UtilisateursAdminPage />}
  />

  <Route
    path="/admin/experiences"
    element={<ExperiencesAdminPage />}
  />

  <Route
    path="/admin/paiements"
    element={<PaiementsAdminPage />}
  />
   <Route
      path="/admin/signalements"
      element={<SignalementsAdminPage />}
    />

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