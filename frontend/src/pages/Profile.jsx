import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

import "./Profile.css";


function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const userName = user?.name || "Player";
  const firstLetter = userName.charAt(0).toUpperCase();

  const isVerified = Boolean(user?.is_verified);

  return (
    <>
      <Navbar />

      <main className="profile-page">
        <div className="profile-container">

          {/* =================================================
              Header
              ================================================= */}

          <section className="profile-hero">
            <p className="profile-eyebrow">
              SQUADUP
            </p>

            <h1>
              Your <span>Profile</span>
            </h1>

            <p className="profile-subtitle">
              Manage your account information and SquadUp identity.
            </p>
          </section>


          {/* =================================================
              Profile Card
              ================================================= */}

          <section className="profile-card">

            {/* Profile Header */}

            <div className="profile-header">

              <div className="profile-avatar">
                {firstLetter}
              </div>

              <div className="profile-header-content">
                <div className="profile-name-row">
                  <h2>{userName}</h2>

                  {isVerified && (
                    <span className="profile-verified-badge">
                      <span aria-hidden="true">✓</span>
                      Verified
                    </span>
                  )}
                </div>

                <p>
                  SquadUp Player
                </p>
              </div>

            </div>


            {/* Divider */}

            <div className="profile-divider" />


            {/* Account Information */}

            <div className="profile-section-header">
              <div>
                <h3>Account Information</h3>

                <p>
                  Your basic account details.
                </p>
              </div>
            </div>


            <div className="profile-info">

              {/* Name */}

              <div className="profile-field">
                <span className="profile-field-label">
                  Name
                </span>

                <div className="profile-field-value">
                  <strong>
                    {user?.name || "Not available"}
                  </strong>
                </div>
              </div>


              {/* Email */}

              <div className="profile-field">
                <span className="profile-field-label">
                  Email
                </span>

                <div className="profile-field-value">
                  <strong>
                    {user?.email || "Not available"}
                  </strong>
                </div>
              </div>


              {/* Phone */}

              <div className="profile-field">
                <span className="profile-field-label">
                  Phone
                </span>

                <div className="profile-field-value">
                  <strong>
                    {user?.phone || "Not added"}
                  </strong>
                </div>
              </div>


              {/* Account Status */}

              <div className="profile-field">
                <span className="profile-field-label">
                  Account Status
                </span>

                <div className="profile-field-value">
                  <strong
                    className={
                      isVerified
                        ? "verified-text"
                        : "unverified-text"
                    }
                  >
                    <span
                      className="status-dot"
                      aria-hidden="true"
                    />

                    {isVerified
                      ? "Verified"
                      : "Not verified"}
                  </strong>
                </div>
              </div>

            </div>


            {/* Divider */}

            <div className="profile-divider" />


            {/* Actions */}

            <div className="profile-actions">

              <div className="profile-action-copy">
                <h3>
                  Profile Settings
                </h3>

                <p>
                  Update your personal information whenever you need.
                </p>
              </div>

              <button
                type="button"
                className="profile-edit-button"
                onClick={() => navigate("/profile/edit")}
              >
                <span>Edit Profile</span>
                <span
                  className="profile-button-arrow"
                  aria-hidden="true"
                >
                  →
                </span>
              </button>

            </div>

          </section>

        </div>
      </main>
    </>
  );
}


export default Profile;