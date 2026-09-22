import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getActivities,
  getNearbyActivities,
} from "../api/activities";

import Navbar from "../components/Navbar";
import ActivityCard from "../components/ActivityCard";

import "../components/Dashboard.css";


function calculateDistanceKm(
  latitude1,
  longitude1,
  latitude2,
  longitude2
) {
  const earthRadius = 6371;

  const lat1 = (latitude1 * Math.PI) / 180;
  const lat2 = (latitude2 * Math.PI) / 180;

  const deltaLat =
    ((latitude2 - latitude1) * Math.PI) / 180;

  const deltaLon =
    ((longitude2 - longitude1) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) *
      Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return earthRadius * c;
}


function Dashboard() {
  const navigate = useNavigate();

  const [activities, setActivities] = useState([]);

  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] =
    useState(false);

  const [error, setError] = useState("");
  const [locationError, setLocationError] =
    useState("");

  const [search, setSearch] = useState("");

  const [selectedSport, setSelectedSport] =
    useState("all");

  const [viewMode, setViewMode] =
    useState("all");

  const [radiusKm, setRadiusKm] =
    useState(5);

  const [userLocation, setUserLocation] =
    useState(null);


  /*
   * Load all activities
   */
  const loadActivities = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getActivities();

      setActivities(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Failed to load activities:",
        error
      );

      setError(
        error.response?.data?.detail ||
          "Unable to load activities. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };


  /*
   * Load activities when dashboard opens
   */
  useEffect(() => {
    loadActivities();
  }, []);


  /*
   * Get user's current location
   */
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(
        "Location services are not supported by your browser."
      );

      return;
    }

    setLocationLoading(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;

        setUserLocation({
          latitude,
          longitude,
        });

        try {
          setLoading(true);

          const data =
            await getNearbyActivities(
              latitude,
              longitude,
              radiusKm
            );

          setActivities(
            Array.isArray(data) ? data : []
          );

          setViewMode("nearby");
        } catch (error) {
          console.error(
            "Failed to load nearby activities:",
            error
          );

          setLocationError(
            error.response?.data?.detail ||
              "Unable to find nearby activities."
          );
        } finally {
          setLoading(false);
          setLocationLoading(false);
        }
      },

      (error) => {
        console.error(
          "Geolocation error:",
          error
        );

        let message =
          "Unable to access your location.";

        if (error.code === 1) {
          message =
            "Location permission was denied. Please allow location access and try again.";
        } else if (error.code === 2) {
          message =
            "Your location could not be determined.";
        } else if (error.code === 3) {
          message =
            "Location request timed out. Please try again.";
        }

        setLocationError(message);
        setLocationLoading(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };


  /*
   * Change nearby radius
   */
  const handleRadiusChange = async (
    newRadius
  ) => {
    setRadiusKm(newRadius);

    if (!userLocation) {
      return;
    }

    try {
      setLoading(true);
      setLocationError("");

      const data =
        await getNearbyActivities(
          userLocation.latitude,
          userLocation.longitude,
          newRadius
        );

      setActivities(
        Array.isArray(data) ? data : []
      );

      setViewMode("nearby");
    } catch (error) {
      console.error(
        "Failed to update nearby activities:",
        error
      );

      setLocationError(
        error.response?.data?.detail ||
          "Unable to update nearby activities."
      );
    } finally {
      setLoading(false);
    }
  };


  /*
   * Switch back to all activities
   */
  const handleAllActivities = async () => {
    setViewMode("all");
    setLocationError("");

    await loadActivities();
  };


  /*
   * Get unique sports
   */
  const sports = useMemo(() => {
    const uniqueSports = [
      ...new Set(
        activities
          .map(
            (activity) =>
              activity.sport
          )
          .filter(Boolean)
      ),
    ];

    return uniqueSports;
  }, [activities]);


  /*
   * Add distance to activities
   */
  const activitiesWithDistance =
    useMemo(() => {
      if (!userLocation) {
        return activities;
      }

      return activities.map(
        (activity) => {
          if (
            activity.latitude === null ||
            activity.latitude === undefined ||
            activity.longitude === null ||
            activity.longitude === undefined
          ) {
            return activity;
          }

          const distance =
            calculateDistanceKm(
              userLocation.latitude,
              userLocation.longitude,
              Number(activity.latitude),
              Number(activity.longitude)
            );

          return {
            ...activity,
            distanceKm: distance,
          };
        }
      );
    }, [activities, userLocation]);


  /*
   * Search + sport filtering
   */
  const filteredActivities =
    useMemo(() => {
      const searchText =
        search.trim().toLowerCase();

      return activitiesWithDistance.filter(
        (activity) => {
          const matchesSport =
            selectedSport === "all" ||
            activity.sport
              ?.toLowerCase() ===
              selectedSport.toLowerCase();

          const matchesSearch =
            !searchText ||
            activity.title
              ?.toLowerCase()
              .includes(searchText) ||
            activity.sport
              ?.toLowerCase()
              .includes(searchText) ||
            activity.location
              ?.toLowerCase()
              .includes(searchText) ||
            activity.description
              ?.toLowerCase()
              .includes(searchText);

          return (
            matchesSport &&
            matchesSearch
          );
        }
      );
    }, [
      activitiesWithDistance,
      selectedSport,
      search,
    ]);


  /*
   * Clear filters
   */
  const clearFilters = () => {
    setSearch("");
    setSelectedSport("all");
  };


  return (
    <div className="dashboard-page">

      <Navbar />

      <main
        className="dashboard-container"
        id="discover"
      >

        {/* Hero */}
        <section className="dashboard-hero">

          <p className="dashboard-eyebrow">
            SQUADUP DISCOVER
          </p>

          <h1>
            Find your next{" "}
            <span>game.</span>
          </h1>

          <p className="dashboard-subtitle">
            Discover local games and find
            people who are ready to play.
          </p>

        </section>


        {/* Search */}
        <section className="search-section">

          <div className="search-wrapper">

            <span className="search-icon">
              🔍
            </span>

            <input
              className="search-box"
              type="text"
              placeholder="Search by sport, activity or location..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

            {search && (
              <button
                className="clear-search"
                onClick={() =>
                  setSearch("")
                }
                aria-label="Clear search"
              >
                ×
              </button>
            )}

          </div>

        </section>


        {/* Nearby controls */}
        <section className="nearby-section">

          <div className="nearby-header">

            <div>
              <h3>
                📍 Find games near you
              </h3>

              <p>
                Discover activities within your
                selected radius.
              </p>
            </div>

            <button
              className="location-button"
              onClick={handleUseMyLocation}
              disabled={locationLoading}
            >
              {locationLoading
                ? "Finding you..."
                : "Use My Location"}
            </button>

          </div>


          {userLocation && (
            <div className="radius-controls">

              <span className="radius-label">
                Search radius
              </span>

              <div className="radius-buttons">

                {[1, 3, 5, 10, 15].map(
                  (radius) => (
                    <button
                      key={radius}
                      className={`radius-button ${
                        radiusKm === radius
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        handleRadiusChange(
                          radius
                        )
                      }
                    >
                      {radius} km
                    </button>
                  )
                )}

              </div>

            </div>
          )}


          {locationError && (
            <p className="location-error">
              {locationError}
            </p>
          )}

        </section>


        {/* View mode */}
        <section className="view-mode-section">

          <button
            className={`view-mode-button ${
              viewMode === "all"
                ? "active"
                : ""
            }`}
            onClick={
              handleAllActivities
            }
          >
            All Activities
          </button>

          <button
            className={`view-mode-button ${
              viewMode === "nearby"
                ? "active"
                : ""
            }`}
            onClick={() => {
              if (userLocation) {
                setViewMode("nearby");
              } else {
                handleUseMyLocation();
              }
            }}
          >
            📍 Nearby
          </button>

        </section>


        {/* Sport filters */}
        <section className="filter-section">

          <button
            className={`filter-button ${
              selectedSport === "all"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setSelectedSport("all")
            }
          >
            All
          </button>

          {sports.map((sport) => (
            <button
              key={sport}
              className={`filter-button ${
                selectedSport === sport
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setSelectedSport(sport)
              }
            >
              {sport}
            </button>
          ))}

        </section>


        {/* Activities */}
        <section className="activities-section">

          <div className="activities-heading">

            <div>
              <h2>
                {viewMode === "nearby"
                  ? "Games Near You"
                  : "Available Activities"}
              </h2>

              <p className="activity-count">
                {filteredActivities.length}{" "}
                {filteredActivities.length === 1
                  ? "activity"
                  : "activities"}
              </p>
            </div>

            <button
              className="create-activity-button"
              onClick={() =>
                navigate(
                  "/activities/create"
                )
              }
            >
              <span>+</span>
              Create Activity
            </button>

          </div>


          {/* Loading */}
          {loading && (
            <div className="dashboard-state">

              <div className="loading-spinner" />

              <p>
                {viewMode === "nearby"
                  ? "Finding games near you..."
                  : "Finding activities..."}
              </p>

            </div>
          )}


          {/* Error */}
          {!loading &&
            error && (
              <div className="dashboard-state dashboard-error">

                <div className="state-icon">
                  !
                </div>

                <h3>
                  Something went wrong
                </h3>

                <p>{error}</p>

                <button
                  className="retry-button"
                  onClick={
                    loadActivities
                  }
                >
                  Try Again
                </button>

              </div>
            )}


          {/* Empty */}
          {!loading &&
            !error &&
            filteredActivities.length ===
              0 && (

              <div className="dashboard-state">

                <div className="empty-icon">
                  🏟️
                </div>

                <h3>
                  {viewMode === "nearby"
                    ? "No games found nearby"
                    : "No activities found"}
                </h3>

                <p>
                  {viewMode === "nearby"
                    ? `There are no activities within ${radiusKm} km of your location.`
                    : "Try changing your search or create a new activity."}
                </p>

                {viewMode === "nearby" ? (
                  <button
                    className="retry-button"
                    onClick={() =>
                      handleRadiusChange(
                        15
                      )
                    }
                  >
                    Search up to 15 km
                  </button>
                ) : (
                  (search ||
                    selectedSport !==
                      "all") && (
                    <button
                      className="retry-button"
                      onClick={
                        clearFilters
                      }
                    >
                      Clear Filters
                    </button>
                  )
                )}

              </div>
            )}


          {/* Activity cards */}
          {!loading &&
            !error &&
            filteredActivities.length >
              0 && (

              <div className="activities-grid">

                {filteredActivities.map(
                  (activity) => (
                    <ActivityCard
                      key={activity.id}
                      activity={activity}
                    />
                  )
                )}

              </div>
            )}

        </section>

      </main>

    </div>
  );
}


export default Dashboard;
