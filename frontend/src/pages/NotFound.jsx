import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

import "./NotFound.css";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <Navbar />

      <main className="not-found-container">
        <section className="not-found-card">
          <div className="not-found-code">404</div>

          <div className="not-found-content">
            <p className="not-found-eyebrow">
              PAGE NOT FOUND
            </p>

            <h1>
              Looks like this page
              <span> left the squad.</span>
            </h1>

            <p className="not-found-description">
              The page you're looking for doesn't exist or may
              have been moved. Let's get you back to the action.
            </p>

            <div className="not-found-actions">
              <button
                type="button"
                className="not-found-primary"
                onClick={() => navigate("/dashboard")}
              >
                Back to Discover
              </button>

              <button
                type="button"
                className="not-found-secondary"
                onClick={() => navigate(-1)}
              >
                Go Back
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default NotFound;