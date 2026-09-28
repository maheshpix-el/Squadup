import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { updateMyProfile } from "../api/users";

import "./EditProfile.css";


function EditProfile() {
  const navigate = useNavigate();
  const { user, updateAuthenticatedUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (name.trim().length < 2) {
      setError("Name must contain at least 2 characters.");
      return;
    }

    if (phone && (phone.length < 10 || phone.length > 15)) {
      setError("Phone number must contain 10 to 15 characters.");
      return;
    }

    try {
      setSaving(true);

      const updatedUser = await updateMyProfile({
        name: name.trim(),
        phone: phone.trim() || null,
      });

      updateAuthenticatedUser(updatedUser);

      navigate("/profile");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="edit-profile-page">
        <div className="edit-profile-container">

          {/* =================================================
              Page Header
              ================================================= */}

          <section className="edit-profile-hero">
            <button
              type="button"
              className="back-profile-button"
              onClick={() => navigate("/profile")}
            >
              <span aria-hidden="true">←</span>
              Back to Profile
            </button>

            <p className="edit-profile-eyebrow">
              ACCOUNT SETTINGS
            </p>

            <h1>
              Edit your <span>Profile</span>
            </h1>

            <p className="edit-profile-subtitle">
              Keep your SquadUp information up to date.
            </p>
          </section>


          {/* =================================================
              Edit Profile Card
              ================================================= */}

          <section className="edit-profile-card">

            {/* Card Header */}

            <div className="edit-profile-card-header">

              <div className="edit-profile-avatar">
                {(user?.name || "P")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <h2>
                  Profile Information
                </h2>

                <p>
                  Update the details associated with your account.
                </p>
              </div>

            </div>


            <div className="edit-profile-divider" />


            {/* Error */}

            {error && (
              <div
                className="edit-profile-error"
                role="alert"
              >
                <span
                  className="edit-profile-error-icon"
                  aria-hidden="true"
                >
                  !
                </span>

                <div>
                  <strong>
                    Unable to save changes
                  </strong>

                  <p>{error}</p>
                </div>
              </div>
            )}


            {/* Form */}

            <form
              className="edit-profile-form"
              onSubmit={handleSubmit}
            >

              {/* Name */}

              <div className="edit-profile-field">
                <label htmlFor="name">
                  Name
                </label>

                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setError("");
                  }}
                  placeholder="Enter your name"
                  autoComplete="name"
                  disabled={saving}
                />

                <span className="edit-profile-help">
                  This name will be displayed on your SquadUp profile.
                </span>
              </div>


              {/* Email */}

              <div className="edit-profile-field">
                <label htmlFor="email">
                  Email
                </label>

                <div className="edit-profile-input-wrapper">
                  <input
                    id="email"
                    type="email"
                    value={user?.email || ""}
                    disabled
                  />

                  <span className="edit-profile-locked">
                    Locked
                  </span>
                </div>

                <span className="edit-profile-help">
                  Email changes are currently unavailable.
                </span>
              </div>


              {/* Phone */}

              <div className="edit-profile-field">
                <label htmlFor="phone">
                  Phone
                  <span className="optional-label">
                    Optional
                  </span>
                </label>

                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => {
                    setPhone(event.target.value);
                    setError("");
                  }}
                  placeholder="Enter your phone number"
                  autoComplete="tel"
                  disabled={saving}
                />

                <span className="edit-profile-help">
                  Use 10 to 15 characters for your phone number.
                </span>
              </div>


              {/* Actions */}

              <div className="edit-profile-actions">

                <button
                  type="button"
                  className="edit-profile-cancel"
                  onClick={() => navigate("/profile")}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="edit-profile-save"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span
                        className="edit-profile-spinner"
                        aria-hidden="true"
                      />

                      Saving...
                    </>
                  ) : (
                    <>
                      Save Changes
                      <span
                        className="save-arrow"
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </>
                  )}
                </button>

              </div>

            </form>

          </section>

        </div>
      </main>
    </>
  );
}


export default EditProfile;