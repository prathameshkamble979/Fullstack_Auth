import { useState } from "react";
import {
  handleLogin,
  validateLoginForm,
} from "../controllers/login.controller.web";
import "../styles/auth.css";

interface LoginPageProps {
  onSuccess: () => void;
  onRegister: () => void;
  onForgotPassword: () => void;
}

interface FormState {
  email: string;
  password: string;
}

interface ErrorState {
  email: string;
  password: string;
}

export function LoginPage({
  onSuccess,
  onRegister,
  onForgotPassword,
}: LoginPageProps) {
  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [errors, setErrors] = useState<ErrorState>({ email: "", password: "" });
  const [alert, setAlert] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAlert(null);

    const validationErrors = validateLoginForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors({
        email: validationErrors.email || "",
        password: validationErrors.password || "",
      });
      return;
    }

    setLoading(true);
    const result = await handleLogin(form);
    setLoading(false);

    if (result.success) {
      setAlert({ type: "success", message: result.message });
      onSuccess();
    } else {
      setAlert({ type: "error", message: result.message });
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-panel auth-panel--form">
        <div className="form-card">
          <div className="form-logo">Freelance.dev</div>
          <h1 className="form-heading">Welcome back</h1>
          <p className="form-subheading">Sign in to continue to your account</p>

          {alert && (
            <div className={`alert alert--${alert.type} visible`}>
              {alert.message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className={errors.email ? "has-error" : ""}
                autoComplete="email"
              />
              {errors.email && (
                <span className="field-error visible">{errors.email}</span>
              )}
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className={errors.password ? "has-error" : ""}
                autoComplete="current-password"
              />
              {errors.password && (
                <span className="field-error visible">{errors.password}</span>
              )}
            </div>

            <div
              style={{
                textAlign: "right",
                marginTop: "-8px",
                marginBottom: "16px",
              }}
            >
              <a
                onClick={onForgotPassword}
                style={{
                  fontSize: "13px",
                  color: "var(--accent)",
                  cursor: "pointer",
                }}
              >
                Forgot password?
              </a>
            </div>

            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="form-footer">
            Don't have an account? <a onClick={onRegister}>Create one</a>
          </p>
        </div>
      </div>

      <div className="auth-panel auth-panel--brand">
        <div className="brand-content">
          <h2 className="brand-tagline">
            Welcome to your
            <br />
            <em>client portal.</em>
          </h2>
          <p className="brand-sub">
            Log in to track your website's progress, review designs, and manage your project seamlessly.
          </p>
        </div>
      </div>
    </div>
  );
}
