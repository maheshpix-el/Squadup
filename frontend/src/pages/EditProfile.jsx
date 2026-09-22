import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { updateMyProfile } from "../api/users";

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

      <main className="profile-page">
        <div className="profile-card">
          <div className="profile-header">
            <div>
              <h1>Edit Profile</h1>
              <p>Update your SquadUp profile information.</p>
            </div>
          </div>

          {error && (
            <div className="profile-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="profile-form-field">
              <label htmlFor="name">Name</label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your name"
              />
            </div>

            <div className="profile-form-field">
              <label htmlFor="email">Email</label>

              <input
                id="email"
                type="email"
                value={user?.email || ""}
                disabled
              />
            </div>

            <div className="profile-form-field">
              <label htmlFor="phone">Phone</label>

              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="profile-actions">
              <button
                type="button"
                onClick={() => navigate("/profile")}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}

export default EditProfile;
