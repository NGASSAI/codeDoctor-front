
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignalementsAdminPage from "../pages/admin/SignalementsAdminPage";
import ExercicesPage from "../pages/user/ExercicesPage";
import ExerciceDetailPage from "../pages/user/ExerciceDetailPage";
import DiagnosticPage from "../pages/user/DiagnosticPage";  
import PublicLayout from "../layouts/PublicLayout";
import AuthLayout from "../layouts/AuthLayout";
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";
import PaiementsAdminPage from "../pages/admin/PaiementsAdminPage";
import HistoriquePage from "../pages/user/HistoriquePage";
import PremiumPage from "../pages/user/PremiumPage";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import NotificationsPage from "../pages/user/NotificationsPage";
import AccueilPage from "../pages/public/AccueilPage";
import ExperiencesPage from "../pages/public/ExperiencesPage";
import ConnexionPage from "../pages/auth/ConnexionPage";
import ProfilPage from "../pages/user/ProfilPage";
import ParametresPage from "../pages/user/ParametresPage";
import DashboardPage from "../pages/user/DashboardPage";
import DiscussionsPage from "../pages/user/DiscussionsPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import UtilisateursAdminPage from "../pages/admin/UtilisateursAdminPage";
import ExperiencesAdminPage from "../pages/admin/ExperiencesAdminPage";
import ExperienceDetailPage from "../pages/public/ExperienceDetailPage";
import HistoriqueDetailPage from "../pages/user/HistoriqueDetailPage";
import ConversationPage from "../pages/user/ConversationPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            ESPACE PUBLIC
        ========================== */}

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


        {/* =========================
            AUTHENTIFICATION
        ========================== */}

        <Route element={<AuthLayout />}>
          <Route
            path="/connexion"
            element={<ConnexionPage />}
          />
        </Route>


        {/* =========================
            ESPACE UTILISATEUR
        ========================== */}

                      <Route element={<ProtectedRoute />}>
  <Route element={<UserLayout />}>

    <Route
      path="/dashboard"
      element={<DashboardPage />}
    />
<Route
  path="/historique/conversations/:id"
  element={<ConversationPage />}
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
      path="/diagnostic"
      element={<DiagnosticPage />}
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
<Route
  path="/discussions"
  element={<DiscussionsPage />}
/>

  </Route>
</Route>

      
        {/* =========================
    ESPACE ADMINISTRATION
========================== */}


<Route
  element={
    <ProtectedRoute adminOnly />
  }
>
  <Route
  path="/admin/signalements"
  element={<SignalementsAdminPage />}
/>
  <Route element={<AdminLayout />}>

    {/* Dashboard */}

    <Route
      path="/admin"
      element={<AdminDashboardPage />}
    />

    <Route
      path="/admin/dashboard"
      element={<AdminDashboardPage />}
    />


    {/* Utilisateurs */}

    <Route
      path="/admin/utilisateurs"
      element={<UtilisateursAdminPage />}
    />


    {/* Expériences */}

    <Route
      path="/admin/experiences"
      element={<ExperiencesAdminPage />}
    />


    {/* Paiements */}

    <Route
      path="/admin/paiements"
      element={<PaiementsAdminPage />}
    />

  </Route>
</Route>

      

        {/* =========================
            ROUTE INCONNUE
        ========================== */}

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

