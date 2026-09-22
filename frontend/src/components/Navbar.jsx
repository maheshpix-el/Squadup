import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">

      <div className="navbar-container">

        <button
          className="navbar-brand"
          onClick={() => navigate("/dashboard")}
          type="button"
        >
          <span className="navbar-brand-mark">
            S
          </span>

          <span className="navbar-brand-name">
            SquadUp
          </span>
        </button>

        <nav className="navbar-links">

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Discover
          </NavLink>

          <NavLink
            to="/my-activities"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            My Activities
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Profile
          </NavLink>

        </nav>

        <div className="navbar-user">

          <span className="navbar-user-name">
            {user?.name || "Player"}
          </span>

          <button
            className="navbar-logout"
            onClick={handleLogout}
            type="button"
          >
            Logout
          </button>

        </div>

      </div>

    </header>
  );
}

export default Navbar;