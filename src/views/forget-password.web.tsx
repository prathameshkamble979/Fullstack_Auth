import { useState } from "react";
import {
  handleForgotPassword,
  validateEmail,
} from "../controllers/forget-password.controller.web";
import "../styles/auth.css";

interface ForgotPasswordPageProps {
  onOTPSent: (email: string) => void;
  onBack: () => void;
}

export function ForgotPasswordPage({
  onOTPSent,
  onBack,
}: ForgotPasswordPageProps) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [alert, setAlert] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAlert(null);
    setEmailError("");

    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      return;
    }

    setLoading(true);
    const result = await handleForgotPassword({ email });
    setLoading(false);

    if (result.success) {
      setAlert({ type: "success", message: result.message });
      setTimeout(() => onOTPSent(email), 1500);
    } else {
      setAlert({ type: "error", message: result.message });
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-panel auth-panel--form">
        <div className="form-card">
          <div className="form-logo">Freelance.dev</div>
          <h1 className="form-heading">Forgot password</h1>
          <p className="form-subheading">
            Enter your email and we'll send you an OTP to reset your password.
          </p>

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
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                className={emailError ? "has-error" : ""}
                autoComplete="email"
              />
              {emailError && (
                <span className="field-error visible">{emailError}</span>
              )}
            </div>

            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>

          <p className="form-footer">
            Remember your password? <a onClick={onBack}>Back to sign in</a>
          </p>
        </div>
      </div>

      <div className="auth-panel auth-panel--brand">
        <div className="brand-content">
          <h2 className="brand-tagline">
            Forgot your
            <br />
            <em>password?</em>
          </h2>
          <p className="brand-sub">
            No worries. We'll send a one-time code to your inbox and get you
            back in.
          </p>
        </div>
      </div>
    </div>
  );
}
