import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getCreatedActivities,
  getJoinedActivities,
} from "../api/activities";

import Navbar from "../components/useNavigate";

import "../components/MyActivities.css";


function ActivityItem({ activity }) {
  const navigate = useNavigate();

  const formattedDate = activity.activity_date
    ? new Date(activity.activity_date).toLocaleDateString(
        "en-IN",
        {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      )
    : "Date not available";

  const formattedTime = activity.activity_date
    ? new Date(activity.activity_date).toLocaleTimeString(
        "en-IN",
        {
          hour: "numeric",
          minute: "2-digit",
        }
      )
    : "";

  const sportIcons = {
    football: "⚽",
    cricket: "🏏",
    badminton: "🏸",
    basketball: "🏀",
    tennis: "🎾",
    volleyball: "🏐",
  };

  const icon =
    sportIcons[activity.sport?.toLowerCase()] || "🏅";

  return (
    <article
      className="my-activity-card"
      onClick={() =>
        navigate(`/activities/${activity.id}`)
      }
    >
      <div className="my-activity-icon">
        {icon}
      </div>

      <div className="my-activity-content">
        <div className="my-activity-top">
          <span className="my-activity-sport">
            {activity.sport}
          </span>

          <span
            className={`my-activity-status ${
              activity.status?.toLowerCase() || ""
            }`}
          >
            {activity.status || "Open"}
          </span>
        </div>

        <h3>{activity.title}</h3>

        {activity.description && (
          <p className="my-activity-description">
            {activity.description}
          </p>
        )}

        <div className="my-activity-meta">
          <span>
            📍 {activity.location || "Location not specified"}
          </span>

          <span>
            📅 {formattedDate}
          </span>

          <span>
            🕐 {formattedTime}
          </span>
        </div>
      </div>

      <div className="my-activity-arrow">
        →
      </div>
    </article>
  );
}


function EmptyState({ type }) {
  const navigate = useNavigate();

  if (type === "created") {
    return (
      <div className="my-empty-state">
        <div className="my-empty-icon">＋</div>

        <h3>No activities created yet</h3>

        <p>
          Create your first game and start building
          your squad.
        </p>

        <button
          onClick={() =>
            navigate("/activities/create")
          }
        >
          Create Activity
        </button>
      </div>
    );
  }

  return (
    <div className="my-empty-state">
      <div className="my-empty-icon">⚽</div>

      <h3>No joined activities</h3>

      <p>
        Discover nearby games and join your first
        squad.
      </p>

      <button
        onClick={() =>
          navigate("/dashboard")
        }
      >
        Discover Activities
      </button>
    </div>
  );
}


function MyActivities() {
  const [createdActivities, setCreatedActivities] =
    useState([]);

  const [joinedActivities, setJoinedActivities] =
    useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          created,
          joined,
        ] = await Promise.all([
          getCreatedActivities(),
          getJoinedActivities(),
        ]);

        setCreatedActivities(
          Array.isArray(created) ? created : []
        );

        setJoinedActivities(
          Array.isArray(joined) ? joined : []
        );
      } catch (error) {
        console.error(
          "Failed to load my activities:",
          error
        );

        setError(
          error.response?.data?.detail ||
            "Unable to load your activities."
        );
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, []);

  return (
    <div className="my-activities-page">

      <Navbar />

      <main className="my-activities-container">

        <section className="my-activities-hero">
          <p className="my-activities-eyebrow">
            SQUADUP
          </p>

          <h1>
            My <span>Activities</span>
          </h1>

          <p>
            Manage the games you've created and
            the squads you've joined.
          </p>
        </section>


        {loading && (
          <div className="my-activities-state">
            <div className="my-loading-spinner" />

            <p>
              Loading your activities...
            </p>
          </div>
        )}


        {!loading && error && (
          <div className="my-activities-state my-error-state">
            <div className="my-error-icon">
              !
            </div>

            <h3>
              Something went wrong
            </h3>

            <p>{error}</p>

            <button
              onClick={() =>
                window.location.reload()
              }
            >
              Try Again
            </button>
          </div>
        )}


        {!loading && !error && (
          <>

            {/* Created */}
            <section className="my-activities-section">

              <div className="my-section-header">
                <div>
                  <h2>
                    Created by Me
                  </h2>

                  <p>
                    Activities you've created
                  </p>
                </div>

                <span>
                  {createdActivities.length}
                </span>
              </div>


              {createdActivities.length === 0 ? (
                <EmptyState type="created" />
              ) : (
                <div className="my-activities-list">

                  {createdActivities.map(
                    (activity) => (
                      <ActivityItem
                        key={activity.id}
                        activity={activity}
                      />
                    )
                  )}

                </div>
              )}

            </section>


            {/* Joined */}
            <section className="my-activities-section">

              <div className="my-section-header">
                <div>
                  <h2>
                    Joined Activities
                  </h2>

                  <p>
                    Games you're participating in
                  </p>
                </div>

                <span>
                  {joinedActivities.length}
                </span>
              </div>


              {joinedActivities.length === 0 ? (
                <EmptyState type="joined" />
              ) : (
                <div className="my-activities-list">

                  {joinedActivities.map(
                    (activity) => (
                      <ActivityItem
                        key={activity.id}
                        activity={activity}
                      />
                    )
                  )}

                </div>
              )}

            </section>

          </>
        )}

      </main>

    </div>
  );
}


export default MyActivities;