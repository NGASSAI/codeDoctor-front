
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignalementsAdminPage from "../pages/admin/SignalementsAdminPage";
import ExercicesPage from "../pages/user/ExercicesPage";
import ExerciceDetailPage from "../pages/user/ExerciceDetailPage";

import PublicLayout from "../layouts/PublicLayout";
import AuthLayout from "../layouts/AuthLayout";
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";
import PaiementsAdminPage from "../pages/admin/PaiementsAdminPage";

import ProtectedRoute from "../components/auth/ProtectedRoute";

import AccueilPage from "../pages/public/AccueilPage";
import ExperiencesPage from "../pages/public/ExperiencesPage";
import ConnexionPage from "../pages/auth/ConnexionPage";

import DashboardPage from "../pages/user/DashboardPage";

import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import UtilisateursAdminPage from "../pages/admin/UtilisateursAdminPage";
import ExperiencesAdminPage from "../pages/admin/ExperiencesAdminPage";

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
      path="/exercices"
      element={<ExercicesPage />}
    />

    <Route
      path="/exercices/:id"
      element={<ExerciceDetailPage />}
    />

  </Route>
</Route>

        {/* =========================
            ESPACE ADMINISTRATION
        ========================== */}
        {/* =========================
    ESPACE ADMINISTRATION
========================== */}
<Route
  path="/admin/signalements"
  element={<SignalementsAdminPage />}
/>

<Route
  element={
    <ProtectedRoute adminOnly />
  }
>
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

