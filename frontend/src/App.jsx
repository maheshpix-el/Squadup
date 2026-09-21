import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ActivityDetails from "./pages/ActivityDetails";
import CreateActivity from "./pages/CreateActivity";


/*
 * Protected Route
 *
 * Only authenticated users can access
 * dashboard and activity pages.
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // While checking the stored token
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial, sans-serif",
          color: "#555",
        }}
      >
        Loading...
      </div>
    );
  }

  // User is not logged in
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // User is authenticated
  return children;
}


/*
 * App
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================================
            ROOT
            ========================================= */}
        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />


        {/* =========================================
            LOGIN
            ========================================= */}
        <Route
          path="/login"
          element={<Login />}
        />


        {/* =========================================
            DASHBOARD
            ========================================= */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />


        {/* =========================================
            ACTIVITY DETAILS
            ========================================= */}
        <Route
          path="/activities/:activityId"
          element={
            <ProtectedRoute>
              <ActivityDetails />
            </ProtectedRoute>
          }
        />


        {/* =========================================
            CREATE ACTIVITY
            ========================================= */}
        <Route
          path="/activities/create"
          element={
            <ProtectedRoute>
              <CreateActivity />
            </ProtectedRoute>
          }
        />


        {/* =========================================
            UNKNOWN ROUTES
            ========================================= */}
        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}


export default App;