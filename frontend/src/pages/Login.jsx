import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import "../components/Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else {
        setError("Unable to login. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setError("Google Sign-In will be available soon.");
  };

  return (
    <div className="login-page">
      {/* Left showcase panel */}
      <section className="login-showcase">
        <div className="login-showcase-content">
          <div className="login-showcase-brand">
            <span className="login-showcase-brand-mark">S</span>
            <span>SquadUp</span>
          </div>

          <div className="login-showcase-main">
            <span className="login-eyebrow">PLAY TOGETHER</span>

            <h2>
              Find your game.
              <br />
              Find your people.
            </h2>

            <p>
              Discover nearby games, join a squad, and get back to
              playing the sports you love.
            </p>

            <div className="login-features">
              <div className="login-feature">
                <span className="login-feature-icon">+</span>
                <div>
                  <strong>Find nearby games</strong>
                  <span>Discover activities happening around you.</span>
                </div>
              </div>

              <div className="login-feature">
                <span className="login-feature-icon">+</span>
                <div>
                  <strong>Join your squad</strong>
                  <span>Meet players and fill your next game.</span>
                </div>
              </div>

              <div className="login-feature">
                <span className="login-feature-icon">+</span>
                <div>
                  <strong>Play more</strong>
                  <span>Spend less time searching and more time playing.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="login-showcase-decoration" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </section>

      {/* Login form */}
      <section className="login-form-side">
        <div className="login-card">
          <div className="login-header">
            <div className="login-brand" aria-label="SquadUp">
              <span className="login-brand-mark" aria-hidden="true">
                S
              </span>

              <span>SquadUp</span>
            </div>

            <h1>Welcome back</h1>

            <p>
              Sign in to find your next game and connect with your squad.
            </p>
          </div>

          {error && (
            <div
              id="login-error"
              className="login-message login-error"
              role="alert"
            >
              {error}
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-form-group">
              <label htmlFor="email">Email</label>

              <div className="login-input-wrapper">
                <span className="login-input-icon" aria-hidden="true">
                  @
                </span>

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "login-error" : undefined}
                  required
                />
              </div>
            </div>

            <div className="login-form-group">
              <div className="login-password-label-row">
                <label htmlFor="password">Password</label>

                <button
                  type="button"
                  className="login-forgot-button"
                  onClick={() =>
                    setError("Password reset will be available soon.")
                  }
                >
                  Forgot password?
                </button>
              </div>

              <div className="login-input-wrapper">
                <span className="login-input-icon" aria-hidden="true">
                  *
                </span>

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "login-error" : undefined}
                  required
                />

                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="login-submit-button"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <span className="login-spinner" aria-hidden="true"></span>
                  Logging in...
                </>
              ) : (
                <>
                  Login
                  <span className="login-button-arrow" aria-hidden="true">
                    →
                  </span>
                </>
              )}
            </button>
          </form>

          <div className="login-divider">
            <span>OR</span>
          </div>

          <button
            type="button"
            className="login-google-button"
            onClick={handleGoogleLogin}
          >
            <span className="login-google-icon" aria-hidden="true">
              G
            </span>

            Continue with Google
          </button>

          <div className="login-register-section">
            <p>
              Don't have an account?{" "}
              <Link to="/register">Create account</Link>
            </p>
          </div>

          <p className="login-terms">
            By continuing, you agree to SquadUp's Terms of Service and
            Privacy Policy.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Login;