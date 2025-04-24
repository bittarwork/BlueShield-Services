// App.jsx
import React, { Suspense, lazy } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { ErrorBoundary } from 'react-error-boundary';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Components
import ProtectedRoute from './components/routes/ProtectedRoute';
import ErrorFallback from './components/errors/ErrorFallback';

// Lazy-loaded pages
// Public
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Services = lazy(() => import('./pages/Services'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const ForgetPassword = lazy(() => import('./pages/Auth/ForgetPassword'));

// User
const DashboardUser = lazy(() => import('./pages/User/DashboardUser'));
const AlternativeWaterUser = lazy(
  () => import('./pages/User/AlternativeWaterSupply')
);

// Admin
const DashboardAdmin = lazy(() => import('./pages/Admin/DashboardAdmin'));
const UserDashboardForAdmin = lazy(
  () => import('./pages/Admin/UserDashboardForAdmin')
);
const RequestDashboardAdmin = lazy(
  () => import('./pages/Admin/RequestDashboardAdmin')
);
const AlternativeWaterAdmin = lazy(
  () => import('./pages/Admin/AlternativeWaterSupply')
);
const MassegeDashboard = lazy(() => import('./pages/Admin/MassegeDashboard'));

// Tech
const DashboardTech = lazy(() => import('./pages/Tech/DashboardTech'));

// Errors
const Error404 = lazy(() => import('./pages/Errors/Error404'));
const Error403 = lazy(() => import('./pages/Errors/Error403'));

// Skeleton while loading
const LoadingSkeleton = () => (
  <React.Fragment>
    <Skeleton height={50} count={3} />
  </React.Fragment>
);

const App = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Router>
        <UserProvider>
          <Suspense fallback={<LoadingSkeleton />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgetpassword" element={<ForgetPassword />} />

              {/* User Routes */}
              <Route
                path="/request"
                element={
                  <ProtectedRoute>
                    <DashboardUser />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/alternative"
                element={
                  <ProtectedRoute>
                    <AlternativeWaterUser />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
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
              <Route
                path="/admin/alternativewatersupply"
                element={
                  <ProtectedRoute adminOnly>
                    <AlternativeWaterAdmin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/messages"
                element={
                  <ProtectedRoute adminOnly>
                    <MassegeDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Technician Routes */}
              <Route
                path="/tech/*"
                element={
                  <ProtectedRoute technicianOnly>
                    <DashboardTech />
                  </ProtectedRoute>
                }
              />

              {/* Error Pages */}
              <Route path="/403" element={<Error403 />} />
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
