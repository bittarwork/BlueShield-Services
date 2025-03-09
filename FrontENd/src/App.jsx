import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { UserProvider, useUser } from "./contexts/UserContext";
import { ErrorBoundary } from "react-error-boundary";

// Lazy load pages to optimize performance
const LandingPage = lazy(() => import("./pages/LandingPage"));
const DashboardUser = lazy(() => import("./pages/User/DashboardUser"));
const DashboardAdmin = lazy(() => import("./pages/Admin/DashboardAdmin"));
const DashboardTech = lazy(() => import("./pages/Tech/DashboardTech"));
const Error404 = lazy(() => import("./pages/Errors/Error404"));
const Error403 = lazy(() => import("./pages/Errors/Error403"));

// Error fallback UI for the ErrorBoundary component
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
};

// ProtectedRoute component for handling user access control based on roles
const ProtectedRoute = ({
  children,
  adminOnly = false,
  technicianOnly = false,
}) => {
  const { isAuthenticated, loading, user } = useUser();

  // Show loading state while user data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // If not authenticated or user data is missing, redirect to landing page
  if (!isAuthenticated || user === null) {
    return <Navigate to="/" />;
  }

  // If adminOnly flag is set, ensure the user is an admin
  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/403" />; // Redirect to "Forbidden" page
  }

  // If technicianOnly flag is set, ensure the user is a technician
  if (technicianOnly && user?.role !== "technician") {
    return <Navigate to="/403" />; // Redirect to "Forbidden" page
  }

  // Return the children components if user has access
  return children;
};

const App = () => {
  return (
    // ErrorBoundary to catch errors and display fallback UI
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <UserProvider>
        <Router>
          <Suspense fallback={<div>Loading pages...</div>}>
            <Routes>
              {/* Route for LandingPage (public access) */}
              <Route path="/" element={<LandingPage />} />

              {/* Route for DashboardUser (user access) */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardUser />
                  </ProtectedRoute>
                }
              />

              {/* Route for DashboardAdmin (admin access only) */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <DashboardAdmin />
                  </ProtectedRoute>
                }
              />

              {/* Route for DashboardTech (technician access only) */}
              <Route
                path="/tech"
                element={
                  <ProtectedRoute technicianOnly>
                    <DashboardTech />
                  </ProtectedRoute>
                }
              />

              {/* Route for Error403 (Forbidden page) */}
              <Route path="/403" element={<Error403 />} />

              {/* Catch-all route for Error404 (page not found) */}
              <Route path="*" element={<Error404 />} />
            </Routes>
          </Suspense>
        </Router>
      </UserProvider>
    </ErrorBoundary>
  );
};

export default App;
