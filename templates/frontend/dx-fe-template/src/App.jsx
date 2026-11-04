
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CategoryPage from "./pages/CategoryPage.jsx";

// Proteksi halaman yang membutuhkan login
const ProtectedRoute = ({ children }) => {
  const isLoggedIn =
    sessionStorage.getItem("isLoggedIn") === "true";

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router basename="/task-endpoint">
      <Routes>
        {/* Root diarahkan ke Login */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* Halaman Login */}
        <Route
          path="/login"
          element={<LoginPage />}
        />

        {/* Halaman Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route path="/category" element={<CategoryPage />} />

        {/* Route tidak ditemukan */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
