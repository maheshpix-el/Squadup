import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-container">

        <div className="navbar-brand">
          <span className="brand-mark">S</span>
          <span className="brand-name">SquadUp</span>
        </div>

        <div className="navbar-links">
          <a href="#discover">Discover</a>
          <button
  className="navbar-link-button"
  onClick={() => navigate("/my-activities")}
>
  My Activities
</button>
          <a href="#profile">
            {user?.name || "Profile"}
          </a>
        </div>

        <button
          className="logout-button"
          onClick={logout}
        >
          Logout
        </button>

      </div>
    </nav>
  );
}

export default Navbar;