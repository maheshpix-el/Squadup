import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <>
      <Navbar />

      <main className="profile-page">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {(user?.name || "P").charAt(0).toUpperCase()}
            </div>

            <div>
              <h1>{user?.name || "Player"}</h1>
              <p>SquadUp Player</p>
            </div>
          </div>

          <div className="profile-info">
            <div className="profile-field">
              <span>Name</span>
              <strong>{user?.name || "Not available"}</strong>
            </div>

            <div className="profile-field">
              <span>Email</span>
              <strong>{user?.email || "Not available"}</strong>
            </div>

            <div className="profile-field">
              <span>Phone</span>
              <strong>{user?.phone || "Not added"}</strong>
            </div>

            <div className="profile-field">
              <span>Account status</span>
              <strong>
                {user?.is_verified ? "Verified" : "Not verified"}
              </strong>
            </div>
          </div>

          <button
            type="button"
            className="profile-edit-button"
            onClick={() => navigate("/profile/edit")}
          >
            Edit Profile
          </button>
        </div>
      </main>
    </>
  );
}

export default Profile;