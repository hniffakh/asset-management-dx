import {BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CategoryPage from "./pages/CategoryPage.jsx";
import DevicePage from "./pages/DevicePage.jsx";
import LinePage from "./pages/LinePage.jsx";
import SupplierPage from "./pages/SupplierPage.jsx";
import SpecPage from "./pages/SpecPage.jsx";
import OpoqPage from "./pages/OpoqPage";
import ReplacementRequestPage from "./pages/ReplacementRequestPage.jsx";
import AssetHistoryPage from "./pages/AssetHistoryPage.jsx";
import MainLayout from "./components/layout/MainLayout";

// Proteksi halaman yang membutuhkan login
const ProtectedRoute = ({ children }) => {
  const isLoggedIn =
    sessionStorage.getItem("isLoggedIn") === "true";

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Proteksi halaman khusus admin
const AdminRoute = ({ children }) => {
  const isLoggedIn =
    sessionStorage.getItem("isLoggedIn") === "true";

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const role = (sessionStorage.getItem("role") || "").trim().toLowerCase();

  if (role !== "admin") {
    return <Navigate to="/replacement-request" replace />;
  }

  return children;
};

function App() {
  return (
    <Router basename="/task-endpoint">
      <Routes>
        {/* Root diarahkan ke Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Halaman Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Halaman Dashboard (admin & user) */}
        <Route path="/dashboard" element={
            <ProtectedRoute>
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* ===== MASTER DATA (khusus admin) ===== */}

        {/* Halaman Category */}
        <Route path="/category" element={
            <AdminRoute>
              <MainLayout>
                <CategoryPage />
              </MainLayout>
            </AdminRoute>
          }
        />

        {/* Halaman Device */}
        <Route path="/device" element={
            <AdminRoute>
              <MainLayout>
                <DevicePage />
              </MainLayout>
            </AdminRoute>
          }
        />

        {/* Halaman Spec */}
        <Route path="/spec" element={
            <AdminRoute>
              <MainLayout>
                <SpecPage />
              </MainLayout>
            </AdminRoute>
          }
        />

        {/* Halaman Supplier */}
        <Route path="/supplier" element={
            <AdminRoute>
              <MainLayout>
                <SupplierPage />
              </MainLayout>
            </AdminRoute>
          }
        />

        {/* Halaman OPOQ */}
        <Route path="/opoq" element={
            <AdminRoute>
              <MainLayout>
                <OpoqPage />
              </MainLayout>
            </AdminRoute>
          }
        />

        {/* Halaman Line */}
        <Route path="/line" element={
            <AdminRoute>
              <MainLayout>
                <LinePage />
              </MainLayout>
            </AdminRoute>
          }
        />

        {/* ===== PEMINJAMAN ASET (admin & user) ===== */}

        {/* Halaman Replacement Request */}
        <Route path="/replacement-request" element={
            <ProtectedRoute>
              <MainLayout>
                <ReplacementRequestPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Halaman Asset History */}
        <Route path="/asset-history" element={
            <ProtectedRoute>
              <MainLayout>
                <AssetHistoryPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

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