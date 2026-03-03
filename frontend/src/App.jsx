import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import { Spinner, Container } from "react-bootstrap";

import { Home, Ranking, Results, Open, About } from "./views";
import {
  AdminDashboard,
  AdminRanking,
  AdminResults,
  AdminOpens,
  AdminContent,
} from "./views/admin";
import { Login } from "./views/Auth";

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
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </Container>
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
            <>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/ranking" element={<AdminRanking />} />
              <Route path="/admin/results" element={<AdminResults />} />
              <Route path="/admin/opens" element={<AdminOpens />} />
              <Route path="/admin/about" element={<AdminContent />} />
            </>
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
