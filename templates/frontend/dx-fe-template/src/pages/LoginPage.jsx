
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../api/authApi";

const LoginPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setResponse(null);
    setError(null);

    
    try {
      const data = await loginApi(
        form.username,
        form.password
      );

      setResponse(data);

      if (data.success) {
        // Simpan JWT untuk request API berikutnya
        sessionStorage.setItem("token", data.data.token);

        // Simpan status login
        sessionStorage.setItem("isLoggedIn", "true");

        // Redirect ke Dashboard
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError(
        err.response?.data || {
          message: err.message,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="card">
        <div className="card-header">
          <h1>Login</h1>
          <p>Asset DX Management</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="form"
          id="login-form"
        >
          <div className="form-group">
            <label htmlFor="username">
              Username
            </label>

            <input
              id="username"
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Masukkan username"
              required
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Masukkan password"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            id="login-btn"
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        {(response || error) && (
          <div
            className={`response-box ${
              error ? "error" : "success"
            }`}
          >
            <div className="response-label">
              {error
                ? "❌ Response Error"
                : "✅ Response Success"}
            </div>

            <pre id="response-output">
              {JSON.stringify(
                response || error,
                null,
                2
              )}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
