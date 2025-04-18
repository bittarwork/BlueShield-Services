import React, { Suspense, lazy } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { UserProvider, useUser } from './contexts/UserContext';
import { ErrorBoundary } from 'react-error-boundary';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
// Lazy load pages to optimize performance
const LandingPage = lazy(() => import('./pages/LandingPage'));
const DashboardUser = lazy(() => import('./pages/User/DashboardUser'));
const DashboardAdmin = lazy(() => import('./pages/Admin/DashboardAdmin'));
const DashboardTech = lazy(() => import('./pages/Tech/DashboardTech'));
const Services = lazy(() => import('./pages/Services'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const ForgetPassword = lazy(() => import('./pages/Auth/ForgetPassword'));
const UserDashboardForAdmin = lazy(
  () => import('./pages/Admin/UserDashboardForAdmin')
);
const RequestDashboardAdmin = lazy(
  () => import('./pages/Admin/RequestDashboardAdmin')
);
const Error404 = lazy(() => import('./pages/Errors/Error404'));
const Error403 = lazy(() => import('./pages/Errors/Error403'));

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
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/403" />; // Redirect to "Forbidden" page
  }

  // If technicianOnly flag is set, ensure the user is a technician
  if (technicianOnly && user?.role !== 'technician') {
    return <Navigate to="/403" />; // Redirect to "Forbidden" page
  }

  // Return the children components if user has access
  return children;
};
const LoadingSkeleton = () => (
  <div>
    <Skeleton height={50} count={3} />
  </div>
);
const App = () => {
  return (
    // ErrorBoundary to catch errors and display fallback UI
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Router>
        <UserProvider>
          <Suspense fallback={<LoadingSkeleton></LoadingSkeleton>}>
            <Routes>
              {/* Route for (public access) */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/Register" element={<Register />} />
              <Route path="/ForgetPassword" element={<ForgetPassword />} />

              {/* Route for DashboardUser (user access) */}
              <Route
                path="/dashboard/*"
                element={
                  <ProtectedRoute>
                    <DashboardUser />
                  </ProtectedRoute>
                }
              />

              {/* Route for DashboardAdmin (admin access only) */}
              <Route
                path="/admin/"
                element={
                  <ProtectedRoute adminOnly>
                    <DashboardAdmin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute adminOnly>
                    <UserDashboardForAdmin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/requests"
                element={
                  <ProtectedRoute adminOnly>
                    <RequestDashboardAdmin />
                  </ProtectedRoute>
                }
              />
              {/* Route for DashboardTech (technician access only) */}
              <Route
                path="/tech/*"
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
        </UserProvider>
      </Router>
      <ToastContainer />
    </ErrorBoundary>
  );
};

export default App;
