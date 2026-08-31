import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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
const ExercicesAdminPage = lazy(() => import("../pages/admin/ExercicesAdminPage"));

/**
 * Encapsule un composant dans un Suspense fallback et applique une transition de page.
 */
const renderLazyPage = (Component: React.ComponentType) => (
  <Suspense fallback={<TableSkeleton />}>
    <PageTransition>
      <Component />
    </PageTransition>
  </Suspense>
);

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =====================================================
            ESPACE PUBLIC
        ====================================================== */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={renderLazyPage(AccueilPage)} />
          <Route path="/experiences" element={renderLazyPage(ExperiencesPage)} />
          <Route path="/experiences/:id" element={renderLazyPage(ExperienceDetailPage)} />
        </Route>

        {/* =====================================================
            AUTHENTIFICATION
        ====================================================== */}
        <Route element={<AuthLayout />}>
          <Route path="/connexion" element={renderLazyPage(ConnexionPage)} />
          <Route path="/inscription" element={renderLazyPage(InscriptionPage)} />
          <Route path="/mot-de-passe-oublie" element={renderLazyPage(MotDePasseOubliePage)} />
          <Route path="/reinitialiser-mot-de-passe" element={renderLazyPage(ReinitialiserMotDePassePage)} />
          <Route path="/verification-email" element={renderLazyPage(VerificationEmailPage)} />
        </Route>

        {/* =====================================================
            ESPACE UTILISATEUR
        ====================================================== */}
        <Route element={<ProtectedRoute />}>
          <Route element={<UserLayout />}>
            <Route path="/dashboard" element={renderLazyPage(DashboardPage)} />
            <Route path="/diagnostic" element={renderLazyPage(DiagnosticPage)} />
            <Route path="/exercices" element={renderLazyPage(ExercicesPage)} />
            <Route path="/exercices/:id" element={renderLazyPage(ExerciceDetailPage)} />
            <Route path="/historique" element={renderLazyPage(HistoriquePage)} />
            <Route path="/historique/:id" element={renderLazyPage(HistoriqueDetailPage)} />
            <Route path="/historique/conversations/:id" element={renderLazyPage(ConversationPage)} />
            <Route path="/discussions" element={renderLazyPage(DiscussionsPage)} />
            <Route path="/premium" element={renderLazyPage(PremiumPage)} />
            <Route path="/notifications" element={renderLazyPage(NotificationsPage)} />
            <Route path="/profil" element={renderLazyPage(ProfilPage)} />
            <Route path="/parametres" element={renderLazyPage(ParametresPage)} />
          </Route>
        </Route>

        {/* =====================================================
            ESPACE ADMINISTRATION
        ====================================================== */}
        <Route element={<ProtectedRoute adminOnly />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={renderLazyPage(AdminDashboardPage)} />
            <Route path="/admin/dashboard" element={renderLazyPage(AdminDashboardPage)} />
            <Route path="/admin/exercices" element={renderLazyPage(ExercicesAdminPage)} />
            <Route path="/admin/notifications" element={renderLazyPage(NotificationsAdminPage)} />
            <Route path="/admin/utilisateurs" element={renderLazyPage(UtilisateursAdminPage)} />
            <Route path="/admin/experiences" element={renderLazyPage(ExperiencesAdminPage)} />
            <Route path="/admin/paiements" element={renderLazyPage(PaiementsAdminPage)} />
            <Route path="/admin/signalements" element={renderLazyPage(SignalementsAdminPage)} />
            <Route path="/admin/profil" element={renderLazyPage(ProfilAdminPage)} />
            <Route path="/admin/parametres" element={renderLazyPage(ParametresAdminPage)} />
          </Route>
        </Route>

        {/* =====================================================
            ROUTE INCONNUE
        ====================================================== */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}