import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getActivity,
} from "../api/activities";

import {
  getActivityParticipants,
  getParticipantCount,
  joinActivity,
  leaveActivity,
} from "../api/participants";

import { useAuth } from "../context/AuthContext";

import Navbar from "../components/useNavigate";

import "../components/ActivityDetails.css";


function ActivityDetails() {
  const { activityId } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();

  const [activity, setActivity] = useState(null);
  const [participantData, setParticipantData] = useState(null);
  const [participants, setParticipants] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");


  /*
   * Load activity and participant information
   */
  const loadActivity = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [
        activityData,
        countData,
        participantsData,
      ] = await Promise.all([
        getActivity(activityId),
        getParticipantCount(activityId),
        getActivityParticipants(activityId),
      ]);

      setActivity(activityData);
      setParticipantData(countData);
      setParticipants(participantsData);

    } catch (error) {
      console.error(
        "Failed to load activity:",
        error
      );

      setError(
        error.response?.data?.detail ||
        "Unable to load this activity."
      );

    } finally {
      setLoading(false);
    }
  }, [activityId]);


  /*
   * Initial load
   */
  useEffect(() => {
    loadActivity();
  }, [loadActivity]);


  /*
   * Join activity
   */
  const handleJoin = async () => {
    try {
      setActionLoading(true);
      setActionMessage("");

      await joinActivity(activityId);

      setActionMessage(
        "You joined this squad successfully!"
      );

      await loadActivity();

    } catch (error) {
      console.error(
        "Failed to join activity:",
        error
      );

      setActionMessage(
        error.response?.data?.detail ||
        "Unable to join this activity."
      );

    } finally {
      setActionLoading(false);
    }
  };


  /*
   * Leave activity
   */
  const handleLeave = async () => {
    try {
      setActionLoading(true);
      setActionMessage("");

      await leaveActivity(activityId);

      setActionMessage(
        "You left the squad."
      );

      await loadActivity();

    } catch (error) {
      console.error(
        "Failed to leave activity:",
        error
      );

      setActionMessage(
        error.response?.data?.detail ||
        "Unable to leave this activity."
      );

    } finally {
      setActionLoading(false);
    }
  };


  /*
   * Loading state
   */
  if (loading) {
    return (
      <div className="activity-details-page">

        <Navbar />

        <main className="activity-details-container">

          <div className="details-state">
            Loading activity...
          </div>

        </main>

      </div>
    );
  }


  /*
   * Error / activity not found
   */
  if (error || !activity) {
    return (
      <div className="activity-details-page">

        <Navbar />

        <main className="activity-details-container">

          <div className="details-state error">

            <h2>
              Activity unavailable
            </h2>

            <p>
              {error ||
                "This activity could not be found."}
            </p>

            <button
              onClick={() =>
                navigate("/dashboard")
              }
            >
              Back to Discover
            </button>

          </div>

        </main>

      </div>
    );
  }


  /*
   * Participant information
   */
  const currentPlayers =
    participantData?.current_players ?? 0;

  const maxPlayers =
    participantData?.max_players ??
    activity.max_players;

  const availableSlots =
    participantData?.available_slots ??
    Math.max(
      maxPlayers - currentPlayers,
      0
    );


  /*
   * Activity status
   */
  const activityStatus =
    participantData?.status ||
    activity.status ||
    "open";

  const normalizedStatus =
    activityStatus.toLowerCase();


  const isFull =
    normalizedStatus === "full" ||
    currentPlayers >= maxPlayers;


  const isOpen =
    normalizedStatus === "open";


  /*
   * Check whether current user created
   * this activity
   */
  const isCreator =
    user?.id === activity.created_by;


  /*
   * Check whether current user joined
   * this activity
   */
  const isJoined =
    participants.some(
      (participant) =>
        participant.user_id === user?.id
    );


  /*
   * Progress percentage
   */
  const progressPercentage =
    maxPlayers > 0
      ? Math.min(
          (currentPlayers / maxPlayers) * 100,
          100
        )
      : 0;


  /*
   * Date formatting
   */
  const activityDate =
    new Date(activity.activity_date);


  const formattedDate =
    activityDate.toLocaleDateString(
      "en-IN",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );


  /*
   * Time formatting
   */
  const formattedTime =
    activityDate.toLocaleTimeString(
      "en-IN",
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );


  /*
   * Sport icons
   *
   * Unicode escapes are used here so
   * the source file does not suffer from
   * encoding problems.
   */
  const sportIcons = {
    football: "\u26BD",
    cricket: "\u{1F3CF}",
    badminton: "\u{1F3F8}",
    basketball: "\u{1F3C0}",
    tennis: "\u{1F3BE}",
    volleyball: "\u{1F3D0}",
  };


  const sportIcon =
    sportIcons[
      activity.sport?.toLowerCase()
    ] || "\u26BD";


  /*
   * Render page
   */
  return (
    <div className="activity-details-page">

      <Navbar />


      <main className="activity-details-container">

        {/* Back button */}
        <button
          className="back-button"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          {"\u2190"} Back to Discover
        </button>


        <div className="activity-details-card">

          {/* Header */}
          <header className="details-header">

            <div className="details-sport-icon">
              {sportIcon}
            </div>

            <span
              className={`details-status ${normalizedStatus}`}
            >
              {normalizedStatus}
            </span>

          </header>


          {/* Main information */}
          <section className="details-main">

            <p className="details-sport">
              {activity.sport}
            </p>


            <h1>
              {activity.title}
            </h1>


            {activity.description && (
              <p className="details-description">
                {activity.description}
              </p>
            )}


            {/* Activity information */}
            <div className="details-info">

              <div className="details-info-item">

                <span className="details-info-icon">
                  {"\u{1F4C5}"}
                </span>

                <div>
                  <small>
                    Date
                  </small>

                  <strong>
                    {formattedDate}
                  </strong>
                </div>

              </div>


              <div className="details-info-item">

                <span className="details-info-icon">
                  {"\u{1F552}"}
                </span>

                <div>
                  <small>
                    Time
                  </small>

                  <strong>
                    {formattedTime}
                  </strong>
                </div>

              </div>


              <div className="details-info-item">

                <span className="details-info-icon">
                  {"\u{1F4CD}"}
                </span>

                <div>
                  <small>
                    Location
                  </small>

                  <strong>
                    {activity.location}
                  </strong>
                </div>

              </div>

            </div>


            {/* Players section */}
            <section className="players-section">

              <div className="players-header">

                <div>

                  <h2>
                    Squad
                  </h2>

                  <p>
                    {currentPlayers} of{" "}
                    {maxPlayers} players joined
                  </p>

                </div>


                <strong>
                  {availableSlots}{" "}
                  {availableSlots === 1
                    ? "spot"
                    : "spots"}{" "}
                  left
                </strong>

              </div>


              {/* Progress bar */}
              <div className="players-progress">

                <div
                  className="players-progress-fill"
                  style={{
                    width: `${progressPercentage}%`,
                  }}
                />

              </div>


              {/* Action buttons */}
              <div className="details-actions">

                {isCreator ? (

                  <div className="creator-message">
                    You created this activity.
                  </div>

                ) : isJoined ? (

                  <button
                    className="action-button leave"
                    onClick={handleLeave}
                    disabled={actionLoading}
                  >
                    {actionLoading
                      ? "Leaving..."
                      : "Leave Squad"}
                  </button>

                ) : (

                  <button
                    className={`action-button ${
                      !isOpen || isFull
                        ? "disabled"
                        : "join"
                    }`}
                    onClick={handleJoin}
                    disabled={
                      actionLoading ||
                      !isOpen ||
                      isFull
                    }
                  >
                    {actionLoading
                      ? "Joining..."
                      : isFull
                        ? "Squad Full"
                        : !isOpen
                          ? "Activity Closed"
                          : "Join Squad"}
                  </button>

                )}

              </div>


              {/* Action message */}
              {actionMessage && (
                <p className="action-message">
                  {actionMessage}
                </p>
              )}

            </section>

          </section>

        </div>

      </main>

    </div>
  );
}


export default ActivityDetails;