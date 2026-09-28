import { useNavigate } from "react-router-dom";

import "./ActivityCard.css";

function ActivityCard({ activity }) {
  const navigate = useNavigate();

  const formattedDate = activity.activity_date
    ? new Date(activity.activity_date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Date not available";

  const formattedTime = activity.activity_date
    ? new Date(activity.activity_date).toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
      })
    : "Time not available";

  const distanceText =
    typeof activity.distanceKm === "number"
      ? activity.distanceKm < 1
        ? `${Math.round(activity.distanceKm * 1000)} m away`
        : `${activity.distanceKm.toFixed(1)} km away`
      : null;

  const activityStatus = activity.status || "Open";

  const currentPlayers = Number(activity.current_players || 0);
  const maxPlayers = Number(activity.max_players || 0);

  const playerPercentage =
    maxPlayers > 0
      ? Math.min((currentPlayers / maxPlayers) * 100, 100)
      : 0;

  const isFull =
    activityStatus.toLowerCase() === "full" ||
    (maxPlayers > 0 && currentPlayers >= maxPlayers);

  const displayStatus = isFull ? "Full" : activityStatus;

  const handleOpenActivity = () => {
    navigate(`/activities/${activity.id}`);
  };

  const handleCardKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleOpenActivity();
    }
  };

  return (
    <article
      className="activity-card"
      role="article"
    >
      <div className="activity-card-top">
        <span className="activity-sport-badge">
          {activity.sport || "Sport"}
        </span>

        <span
          className={`activity-status ${
            displayStatus.toLowerCase()
          }`}
        >
          {displayStatus}
        </span>
      </div>

      <div className="activity-card-content">
        <h3>{activity.title || "Untitled Activity"}</h3>

        <p className="activity-description">
          {activity.description ||
            "Details are available on the activity page."}
        </p>

        <dl className="activity-info">
          <div className="activity-info-location">
            <dt className="activity-meta-label">Location</dt>
            <dd title={activity.location || "Location not specified"}>
              {activity.location || "Location not specified"}
            </dd>
          </div>

          <div>
            <dt className="activity-meta-label">Date</dt>
            <dd>{formattedDate}</dd>
          </div>

          <div>
            <dt className="activity-meta-label">Time</dt>
            <dd>{formattedTime}</dd>
          </div>

          <div className="activity-info-location">
            <dt className="activity-meta-label">Players</dt>

            <dd className="activity-player-value">
              <span>
                {currentPlayers}/{maxPlayers || "—"} joined
              </span>

              {maxPlayers > 0 && (
                <div
                  className="activity-player-progress"
                  aria-label={`${currentPlayers} of ${maxPlayers} players joined`}
                >
                  <span
                    style={{
                      width: `${playerPercentage}%`,
                    }}
                  />
                </div>
              )}
            </dd>
          </div>

          {distanceText && (
            <div className="activity-distance activity-info-location">
              <dt className="activity-meta-label">Distance</dt>
              <dd>{distanceText}</dd>
            </div>
          )}
        </dl>
      </div>

      <div className="activity-card-footer">
        <button
          type="button"
          className="view-activity-button"
          onClick={handleOpenActivity}
          onKeyDown={handleCardKeyDown}
        >
          View Activity
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </article>
  );
}

export default ActivityCard;