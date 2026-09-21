import { useNavigate } from "react-router-dom";


function ActivityCard({ activity }) {
  const navigate = useNavigate();


  const formattedDate =
    new Date(
      activity.activity_date
    ).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });


  const formattedTime =
    new Date(
      activity.activity_date
    ).toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    });


  const sportIcons = {
    football: "⚽",
    cricket: "🏏",
    badminton: "🏸",
    basketball: "🏀",
    tennis: "🎾",
    volleyball: "🏐",
  };


  const icon =
    sportIcons[
      activity.sport?.toLowerCase()
    ] || "🏆";


  const distanceText =
    typeof activity.distanceKm ===
    "number"
      ? activity.distanceKm < 1
        ? `${Math.round(
            activity.distanceKm * 1000
          )} m away`
        : `${activity.distanceKm.toFixed(
            1
          )} km away`
      : null;


  return (
    <article className="activity-card">

      {/* Card header */}
      <div className="activity-card-top">

        <div className="sport-icon">
          {icon}
        </div>

        <span
          className={`activity-status ${
            activity.status?.toLowerCase() || ""
          }`}
        >
          {activity.status}
        </span>

      </div>


      {/* Card content */}
      <div className="activity-card-content">

        <p className="activity-sport">
          {activity.sport}
        </p>

        <h3>
          {activity.title}
        </h3>


        {activity.description && (
          <p className="activity-description">
            {activity.description}
          </p>
        )}


        <div className="activity-info">

          <div>
            <span>📍</span>
            <span>
              {activity.location}
            </span>
          </div>


          <div>
            <span>📅</span>
            <span>
              {formattedDate}
            </span>
          </div>


          <div>
            <span>🕐</span>
            <span>
              {formattedTime}
            </span>
          </div>


          <div>
            <span>👥</span>
            <span>
              Up to{" "}
              {activity.max_players}{" "}
              players
            </span>
          </div>


          {distanceText && (
            <div className="activity-distance">
              <span>📍</span>
              <strong>
                {distanceText}
              </strong>
            </div>
          )}

        </div>

      </div>


      {/* Card footer */}
      <div className="activity-card-footer">

        <button
          className="view-activity-button"
          onClick={() =>
            navigate(
              `/activities/${activity.id}`
            )
          }
        >
          View Activity
        </button>

      </div>

    </article>
  );
}


export default ActivityCard;