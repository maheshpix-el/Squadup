import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../api/auth";

import "../components/Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const password = formData.password;

    if (!name) {
      setError("Please enter your name.");
      return;
    }

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    if (phone && (phone.length < 10 || phone.length > 15)) {
      setError("Phone number must contain 10 to 15 characters.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        name,
        email,
        phone: phone || null,
        password,
      });

      setSuccess(
        "Registration successful. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      console.error("Registration failed:", error);

      const detail = error.response?.data?.detail;

      if (Array.isArray(detail)) {
        setError(
          detail
            .map((item) => item.msg)
            .join(", ")
        );
      } else {
        setError(
          detail ||
            "Unable to register. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-showcase">
        <div className="showcase-decoration showcase-decoration-one" />
        <div className="showcase-decoration showcase-decoration-two" />

        <div className="showcase-content">
          <div className="register-brand showcase-brand">
            <span className="register-brand-mark">S</span>
            <span>SquadUp</span>
          </div>

          <div className="showcase-main">
            <span className="showcase-eyebrow">
              PLAY TOGETHER
            </span>

            <h2>
              Find your game.
              <br />
              Find your people.
            </h2>

            <p>
              Discover nearby activities, meet players,
              and build your squad.
            </p>

            <div className="showcase-features">
              <div className="showcase-feature">
                <span className="feature-icon">+</span>
                <div>
                  <strong>Create a game</strong>
                  <span>Start your own activity.</span>
                </div>
              </div>

              <div className="showcase-feature">
                <span className="feature-icon">⌖</span>
                <div>
                  <strong>Find players nearby</strong>
                  <span>Discover games around you.</span>
                </div>
              </div>

              <div className="showcase-feature">
                <span className="feature-icon">→</span>
                <div>
                  <strong>Join your squad</strong>
                  <span>Show up and start playing.</span>
                </div>
              </div>
            </div>
          </div>

          <span className="showcase-footer">
            Your next game could be closer than you think.
          </span>
        </div>
      </div>

      <div className="register-form-side">
        <div className="register-card">
          <div className="register-header">
            <div className="register-brand register-mobile-brand">
              <span className="register-brand-mark">S</span>
              <span>SquadUp</span>
            </div>

            <h1>Create your account</h1>

            <p>
              Find your game. Find your people.
            </p>
          </div>

          {error && (
            <div
              className="register-message register-error"
              role="alert"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              className="register-message register-success"
              role="status"
            >
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="register-form-group">
              <label htmlFor="name">Name</label>

              <div className="register-input-wrapper">
                <span className="register-input-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="8" r="3.5" />
                    <path d="M5.5 20c.7-3.2 2.8-5 6.5-5s5.8 1.8 6.5 5" />
                  </svg>
                </span>

                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            <div className="register-form-group">
              <label htmlFor="email">Email</label>

              <div className="register-input-wrapper">
                <span className="register-input-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
                    <path d="m5 7 7 5 7-5" />
                  </svg>
                </span>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="register-form-group">
              <label htmlFor="phone">
                Phone
                <span className="optional">Optional</span>
              </label>

              <div className="register-input-wrapper">
                <span className="register-input-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M7.5 4.5 5.8 5.7c-.8.6-1.1 1.6-.7 2.5 1.8 4.4 5.3 7.9 9.7 9.7.9.4 1.9.1 2.5-.7l1.2-1.7c.4-.6.3-1.4-.3-1.8l-2.2-1.5c-.5-.3-1.2-.3-1.6.2l-.8 1c-1.7-.8-3.1-2.2-3.9-3.9l1-.8c.5-.4.5-1.1.2-1.6L9.3 4.8c-.4-.6-1.2-.7-1.8-.3Z" />
                  </svg>
                </span>

                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="register-form-group">
              <label htmlFor="password">Password</label>

              <div className="register-input-wrapper">
                <span className="register-input-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <rect x="5" y="10" width="14" height="10" rx="2" />
                    <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />
                  </svg>
                </span>

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 8 characters"
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="register-submit-button"
              disabled={loading}
            >
              <span>
                {loading
                  ? "Creating account..."
                  : "Create Account"}
              </span>

              {!loading && (
                <span className="register-button-arrow">
                  →
                </span>
              )}

              {loading && (
                <span className="register-spinner" />
              )}
            </button>
          </form>

          <div className="register-divider">
            <span>OR</span>
          </div>

          <button
            type="button"
            className="google-register-button"
            onClick={() => {
              setError(
                "Google Sign-In will be available soon."
              );
            }}
          >
            <span className="google-logo">G</span>
            <span>Continue with Google</span>
          </button>

          <p className="register-login-text">
            Already have an account?{" "}
            <Link to="/login">Login</Link>
          </p>

          <p className="register-terms">
            By creating an account, you agree to use SquadUp
            responsibly and respectfully.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;