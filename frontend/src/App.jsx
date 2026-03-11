import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import { Home, Ranking, Results, Open, About, Login } from "./views";
import {
  AdminLayout,
  AdminRanking,
  AdminResults,
  AdminOpens,
  AdminContent,
} from "./views/admin";

// Services
import { authService } from "./services/authService";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Initialize from localStorage immediately to prevent flash of logged-out state
    return !!localStorage.getItem("token");
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const status = await authService.checkStatus();
        setIsAuthenticated(status.isAuthenticated);
      } catch (err) {
        console.error("Auth check failed:", err);
        // If token exists in localStorage but server validation fails, clear it
        if (localStorage.getItem("token")) {
          localStorage.removeItem("token");
        }
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Listen for storage changes (logout in other tabs/windows)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token") {
        // Token was removed (logout) or changed in another tab
        setIsAuthenticated(!!e.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = async () => {
    try {
      authService.logout();
      setIsAuthenticated(false);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-alabaster_grey">
        <svg
          className="animate-spin h-12 w-12 text-orange"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    );
  }

  return (
    <Router>
      <Layout isAuthenticated={isAuthenticated} onLogout={handleLogout}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/results/:page" element={<Results />} />
          <Route path="/open" element={<Open />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/" />
              ) : (
                <Login setAuth={setIsAuthenticated} />
              )
            }
          />

          {/* Admin Routes */}
          {isAuthenticated ? (
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/ranking" replace />} />
              <Route path="ranking" element={<AdminRanking />} />
              <Route path="results" element={<AdminResults />} />
              <Route path="opens" element={<AdminOpens />} />
              <Route path="about" element={<AdminContent />} />
            </Route>
          ) : (
            /* Redirect any admin attempts to login if not authenticated */
            <Route path="/admin/*" element={<Navigate to="/login" />} />
          )}

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
