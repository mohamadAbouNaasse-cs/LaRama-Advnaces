import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./Auth.css";

const Auth = () => {
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser, register, loading } = useAuth();

  const redirectTo = location.state?.from?.pathname || "/dashboard";

  const heading = useMemo(
    () => (mode === "login" ? "Welcome back" : "Create your LaRama account"),
    [mode],
  );

  const description = useMemo(
    () =>
      mode === "login"
        ? "Access your orders, curated recommendations, and saved looks by logging in."
        : "Join LaRama to unlock tailored style inspiration, track purchases, and craft your signature ensembles.",
    [mode],
  );

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
      setError("Please fill in all fields");
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await loginUser({ email, password });
      if (result.success) {
        navigate(redirectTo, { replace: true });
      } else {
        setError(result.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name")?.toString().trim();
    const email = formData.get("signup-email")?.toString().trim();
    const password = formData.get("signup-password")?.toString();

    if (!name || !email || !password) {
      setError("Please fill in all fields");
      setIsSubmitting(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await register({ name, email, password });
      if (result.success) {
        navigate(redirectTo, { replace: true });
      } else {
        setError(result.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSignup = mode === "signup";

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setError("");
  };

  return (
    <section className="auth-wrapper">
      <div className={`auth-card${isSignup ? " is-signup" : ""}`}>
        <div className="auth-card__intro">
          <h1 className="auth-card__title">{heading}</h1>
          <p className="auth-card__description">{description}</p>
          
          {error && (
            <div className="error-message" style={{
              color: '#dc2626',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '6px',
              padding: '8px 12px',
              margin: '8px 0',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <div className="auth-card__switch" role="tablist" aria-label="Authentication mode">
            <span className="auth-card__thumb" aria-hidden="true" />
            <button
              type="button"
              role="tab"
              aria-selected={!isSignup}
              className="auth-card__switch-btn"
              onClick={() => handleModeChange("login")}
            >
              Login
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={isSignup}
              className="auth-card__switch-btn"
              onClick={() => handleModeChange("signup")}
            >
              Sign Up
            </button>
          </div>
        </div>

        <div className="auth-card__forms">
          <form
            className="auth-form auth-form--login"
            onSubmit={handleLoginSubmit}
            aria-hidden={isSignup}
            aria-labelledby="login-heading"
          >
            <h2 id="login-heading" className="auth-form__heading">
              Log in to your account
            </h2>
            <div className="auth-form__fields">
              <label className="auth-field">
                <span>Email address</span>
                <input type="email" name="email" autoComplete="email" required placeholder="you@example.com" disabled={isSubmitting || loading} />
              </label>
              <label className="auth-field">
                <span>Password</span>
                <input type="password" name="password" autoComplete="current-password" required placeholder="Your password" disabled={isSubmitting || loading} />
              </label>
            </div>
            <button type="submit" className="auth-form__submit" disabled={isSubmitting || loading}>
              {isSubmitting ? 'Logging in...' : 'Continue'}
            </button>
          </form>

          <form
            className="auth-form auth-form--signup"
            onSubmit={handleSignupSubmit}
            aria-hidden={!isSignup}
            aria-labelledby="signup-heading"
          >
            <h2 id="signup-heading" className="auth-form__heading">
              Start your style journey
            </h2>
            <div className="auth-form__fields">
              <label className="auth-field">
                <span>Full name</span>
                <input type="text" name="name" autoComplete="name" required placeholder="Alex Taylor" disabled={isSubmitting || loading} />
              </label>
              <label className="auth-field">
                <span>Email address</span>
                <input type="email" name="signup-email" autoComplete="email" required placeholder="you@example.com" disabled={isSubmitting || loading} />
              </label>
              <label className="auth-field">
                <span>Password</span>
                <input type="password" name="signup-password" autoComplete="new-password" required placeholder="Create a secure password (min 6 characters)" disabled={isSubmitting || loading} />
              </label>
            </div>
            <button type="submit" className="auth-form__submit" disabled={isSubmitting || loading}>
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Auth;
