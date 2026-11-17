
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginApi } from "../api/authApi";

import {
  Layers,
  UserRound,
  LockKeyhole,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
} from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const data = await loginApi(
        form.username,
        form.password
      );

      if (data.success) {
        // Ambil informasi akun dari response login
        const user = data.data.user || data.data;

        // Simpan JWT
        sessionStorage.setItem("token", data.data.token);

        // Simpan status login
        sessionStorage.setItem("isLoggedIn", "true");

        // Simpan username akun yang login
        sessionStorage.setItem(
          "username",
          user.username || form.username
        );

        // Simpan role jika dikembalikan oleh backend
        if (user.role) {
          sessionStorage.setItem("role", user.role);
        } else {
          sessionStorage.removeItem("role");
        }

        // Redirect ke Dashboard
        navigate("/dashboard", { replace: true });
      } else {
        setError(
          data.message || "Username atau password tidak valid."
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Terjadi kesalahan saat login. Silakan coba kembali."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputWrapperStyle = {
    display: "flex",
    alignItems: "center",
    border: "1px solid #d1d5db",
    borderRadius: "9px",
    padding: "0 13px",
    backgroundColor: "#ffffff",
    transition: "border-color 0.2s ease",
  };

  const inputStyle = {
    width: "100%",
    border: "none",
    outline: "none",
    padding: "13px 10px",
    fontSize: "13px",
    color: "#1f2937",
    backgroundColor: "transparent",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "25px",
        boxSizing: "border-box",
        backgroundColor: "#f3f4f6",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "#ffffff",
          borderRadius: "15px",
          overflow: "hidden",
          boxShadow: "0 10px 35px rgba(15, 23, 42, 0.10)",
          border: "1px solid #e5e7eb",
        }}
      >
        {/* HEADER / BRANDING */}
        <div
          style={{
            backgroundColor: "#17243a",
            padding: "35px 30px",
            textAlign: "center",
            color: "#ffffff",
          }}
        >
          <div
            style={{
              width: "58px",
              height: "58px",
              margin: "0 auto 15px",
              borderRadius: "14px",
              backgroundColor: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Layers size={31} color="#ffffff" />
          </div>

          <h1
            style={{
              fontSize: "24px",
              fontWeight: "700",
              letterSpacing: "1px",
              margin: "0 0 7px",
            }}
          >
            DX AMS
          </h1>

          <p
            style={{
              fontSize: "11px",
              color: "#94a3b8",
              letterSpacing: "1.5px",
              margin: 0,
            }}
          >
            ASSET MANAGEMENT SYSTEM
          </p>
        </div>

        {/* LOGIN FORM */}
        <div style={{ padding: "32px 30px" }}>
          <div style={{ marginBottom: "27px" }}>
            <h2
              style={{
                fontSize: "21px",
                color: "#17243a",
                fontWeight: "700",
                margin: "0 0 8px",
              }}
            >
              Welcome Back
            </h2>

            <p
              style={{
                fontSize: "13px",
                color: "#64748b",
                margin: 0,
                lineHeight: "1.5",
              }}
            >
              Sign in to access your asset management dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* USERNAME */}
            <div style={{ marginBottom: "19px" }}>
              <label
                htmlFor="username"
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "9px",
                }}
              >
                Username
              </label>

              <div style={inputWrapperStyle}>
                <UserRound size={17} color="#94a3b8" />

                <input
                  id="username"
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  autoComplete="username"
                  required
                  disabled={loading}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div style={{ marginBottom: "22px" }}>
              <label
                htmlFor="password"
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "9px",
                }}
              >
                Password
              </label>

              <div style={inputWrapperStyle}>
                <LockKeyhole size={17} color="#94a3b8" />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  disabled={loading}
                  style={inputStyle}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  title={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  style={{
                    border: "none",
                    background: "transparent",
                    padding: "5px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    color: "#94a3b8",
                  }}
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "9px",
                  padding: "11px 12px",
                  marginBottom: "18px",
                  borderRadius: "8px",
                  backgroundColor: "#fef2f2",
                  border: "1px solid #fecaca",
                  color: "#dc2626",
                  fontSize: "12px",
                  lineHeight: "1.5",
                }}
              >
                <AlertCircle
                  size={17}
                  style={{ flexShrink: 0, marginTop: "1px" }}
                />

                <span>{error}</span>
              </div>
            )}

            {/* LOGIN BUTTON */}
            <button
              id="login-btn"
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "9px",
                padding: "13px",
                border: "none",
                borderRadius: "9px",
                backgroundColor: loading ? "#64748b" : "#2563eb",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background-color 0.2s ease",
              }}
            >
              <LogIn size={17} />

              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* FOOTER */}
          <div
            style={{
              borderTop: "1px solid #e5e7eb",
              marginTop: "27px",
              paddingTop: "18px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "11px",
                color: "#94a3b8",
                margin: 0,
              }}
            >
              © 2026 DX AMS. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;