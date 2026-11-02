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


function startOfDay(date) {
  const result = new Date(date);

  result.setHours(0, 0, 0, 0);

  return result;
}


function endOfDay(date) {
  const result = new Date(date);

  result.setHours(23, 59, 59, 999);

  return result;
}


function startOfWeek(date) {
  const result = startOfDay(date);

  const day = result.getDay();

  const daysFromMonday =
    day === 0 ? 6 : day - 1;

  result.setDate(
    result.getDate() - daysFromMonday
  );

  return result;
}


function endOfWeek(date) {
  const result = startOfWeek(date);

  result.setDate(result.getDate() + 6);

  return endOfDay(result);
}


function isSameDay(date1, date2) {
  return (
    date1.getFullYear() ===
      date2.getFullYear() &&
    date1.getMonth() ===
      date2.getMonth() &&
    date1.getDate() ===
      date2.getDate()
  );
}


function isTomorrow(date, today) {
  const tomorrow = new Date(today);

  tomorrow.setDate(
    tomorrow.getDate() + 1
  );

  return isSameDay(date, tomorrow);
}


function isInThisWeek(date, today) {
  const weekStart = startOfWeek(today);
  const weekEnd = endOfWeek(today);

  return (
    date >= weekStart &&
    date <= weekEnd
  );
}


function matchesTimeOfDay(date, timeFilter) {
  if (timeFilter === "all") {
    return true;
  }

  const hour = date.getHours();

  if (timeFilter === "morning") {
    return hour >= 5 && hour < 12;
  }

  if (timeFilter === "afternoon") {
    return hour >= 12 && hour < 17;
  }

  if (timeFilter === "evening") {
    return hour >= 17 || hour < 5;
  }

  return true;
}


function Dashboard() {
  const navigate = useNavigate();

  const [activities, setActivities] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [locationLoading, setLocationLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [locationError, setLocationError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [selectedSport, setSelectedSport] =
    useState("all");

  const [dateFilter, setDateFilter] =
    useState("all");

  const [timeFilter, setTimeFilter] =
    useState("all");

  const [sortBy, setSortBy] =
    useState("starting-soon");

  const [viewMode, setViewMode] =
    useState("all");

  const [radiusKm, setRadiusKm] =
    useState(5);

  const [userLocation, setUserLocation] =
    useState(null);


  const loadActivities = async () => {
    try {
      const data = await getActivities();

      setError("");
      setActivities(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (requestError) {
      console.error(
        "Failed to load activities:",
        requestError
      );

      setError(
        requestError.response?.data?.detail ||
          "Unable to load activities. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const request = window.setTimeout(loadActivities, 0);
    return () => window.clearTimeout(request);
  }, []);


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
            Array.isArray(data)
              ? data
              : []
          );

          setViewMode("nearby");
        } catch (requestError) {
          console.error(
            "Failed to load nearby activities:",
            requestError
          );

          setLocationError(
            requestError.response?.data?.detail ||
              "Unable to find nearby activities."
          );
        } finally {
          setLoading(false);
          setLocationLoading(false);
        }
      },
      (geolocationError) => {
        console.error(
          "Geolocation error:",
          geolocationError
        );

        let message =
          "Unable to access your location.";

        if (geolocationError.code === 1) {
          message =
            "Location permission was denied. Please allow location access and try again.";
        } else if (
          geolocationError.code === 2
        ) {
          message =
            "Your location could not be determined.";
        } else if (
          geolocationError.code === 3
        ) {
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
        Array.isArray(data)
          ? data
          : []
      );

      setViewMode("nearby");
    } catch (requestError) {
      console.error(
        "Failed to update nearby activities:",
        requestError
      );

      setLocationError(
        requestError.response?.data?.detail ||
          "Unable to update nearby activities."
      );
    } finally {
      setLoading(false);
    }
  };


  const handleAllActivities = async () => {
    setViewMode("all");
    setLocationError("");

    setLoading(true);
    await loadActivities();
  };


  const sports = useMemo(() => {
    return [
      ...new Set(
        activities
          .map(
            (activity) =>
              activity.sport
          )
          .filter(Boolean)
      ),
    ];
  }, [activities]);


  const activitiesWithDistance =
    useMemo(() => {
      if (!userLocation) {
        return activities;
      }

      return activities.map(
        (activity) => {
          if (
            activity.latitude ===
              null ||
            activity.latitude ===
              undefined ||
            activity.longitude ===
              null ||
            activity.longitude ===
              undefined
          ) {
            return activity;
          }

          return {
            ...activity,

            distanceKm:
              calculateDistanceKm(
                userLocation.latitude,
                userLocation.longitude,
                Number(activity.latitude),
                Number(activity.longitude)
              ),
          };
        }
      );
    }, [activities, userLocation]);


  const filteredActivities =
    useMemo(() => {
      const searchText =
        search.trim().toLowerCase();

      const today = new Date();

      const todayStart =
        startOfDay(today);

      const todayEnd =
        endOfDay(today);

      return activitiesWithDistance
        .filter((activity) => {
          const activityDate =
            new Date(
              activity.activity_date
            );

          if (
            Number.isNaN(
              activityDate.getTime()
            )
          ) {
            return false;
          }

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

          let matchesDate = true;

          if (dateFilter === "today") {
            matchesDate =
              activityDate >=
                todayStart &&
              activityDate <=
                todayEnd;
          }

          if (dateFilter === "tomorrow") {
            matchesDate =
              isTomorrow(
                activityDate,
                today
              );
          }

          if (dateFilter === "this-week") {
            matchesDate =
              isInThisWeek(
                activityDate,
                today
              );
          }

          const matchesTime =
            matchesTimeOfDay(
              activityDate,
              timeFilter
            );

          return (
            matchesSport &&
            matchesSearch &&
            matchesDate &&
            matchesTime
          );
        })
        .sort((activityA, activityB) => {

          /*
           * SORT: NEAREST
           *
           * Activities with a smaller
           * distance appear first.
           */
          if (sortBy === "nearest") {
            const distanceA =
              activityA.distanceKm;

            const distanceB =
              activityB.distanceKm;

            if (
              distanceA === undefined &&
              distanceB === undefined
            ) {
              return (
                new Date(
                  activityA.activity_date
                ) -
                new Date(
                  activityB.activity_date
                )
              );
            }

            if (
              distanceA === undefined
            ) {
              return 1;
            }

            if (
              distanceB === undefined
            ) {
              return -1;
            }

            return (
              distanceA -
              distanceB
            );
          }


          /*
           * SORT: MOST AVAILABLE
           *
           * Activities with the highest
           * number of available slots
           * appear first.
           *
           * If two activities have the
           * same availability, the earlier
           * activity appears first.
           */
          if (
            sortBy === "most-available"
          ) {
            const availableA =
              Number(
                activityA.available_slots ?? 0
              );

            const availableB =
              Number(
                activityB.available_slots ?? 0
              );

            if (
              availableA !==
              availableB
            ) {
              return (
                availableB -
                availableA
              );
            }

            return (
              new Date(
                activityA.activity_date
              ) -
              new Date(
                activityB.activity_date
              )
            );
          }


          /*
           * SORT: STARTING SOON
           *
           * Activities with the earliest
           * start time appear first.
           */
          return (
            new Date(
              activityA.activity_date
            ) -
            new Date(
              activityB.activity_date
            )
          );
        });
    }, [
      activitiesWithDistance,
      search,
      selectedSport,
      dateFilter,
      timeFilter,
      sortBy,
    ]);


  const clearFilters = () => {
    setSearch("");
    setSelectedSport("all");
    setDateFilter("all");
    setTimeFilter("all");
    setSortBy("starting-soon");
  };


  const hasActiveFilters = Boolean(
    search ||
      selectedSport !== "all" ||
      dateFilter !== "all" ||
      timeFilter !== "all" ||
      sortBy !== "starting-soon"
  );


  return (
    <div className="dashboard-page">
      <Navbar />

      <main
        className="dashboard-container"
        id="discover"
      >
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


        <section
          className="search-section"
          aria-label="Search activities"
        >
          <div className="search-wrapper">
            <span
              className="search-icon"
              aria-hidden="true"
            />

            <input
              className="search-box"
              type="search"
              placeholder="Search by sport, activity or location..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              aria-label="Search activities"
            />

            {search && (
              <button
                type="button"
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


        <section
          className="nearby-section"
          aria-label="Nearby activities"
        >
          <div className="nearby-header">
            <div className="nearby-copy">
              <span
                className="location-marker"
                aria-hidden="true"
              />

              <div>
                <h3>
                  Find games near you
                </h3>

                <p>
                  Discover activities
                  within your selected
                  radius.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="location-button"
              onClick={
                handleUseMyLocation
              }
              disabled={
                locationLoading
              }
              aria-busy={
                locationLoading
              }
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
                      type="button"
                      key={radius}
                      className={`radius-button ${
                        radiusKm ===
                        radius
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
            <p
              className="location-error"
              role="alert"
            >
              {locationError}
            </p>
          )}
        </section>


        <section
          className="discovery-filters"
          aria-label="Activity filters"
        >
          <div className="view-mode-section">
            <button
              type="button"
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
              type="button"
              className={`view-mode-button ${
                viewMode === "nearby"
                  ? "active"
                  : ""
              }`}
              onClick={() => {
                if (userLocation) {
                  setViewMode(
                    "nearby"
                  );
                } else {
                  handleUseMyLocation();
                }
              }}
            >
              Nearby
            </button>
          </div>


          <div
            className="filter-section"
            aria-label="Filter by sport"
          >
            <button
              type="button"
              className={`filter-button ${
                selectedSport ===
                "all"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setSelectedSport(
                  "all"
                )
              }
            >
              All Sports
            </button>

            {sports.map(
              (sport) => (
                <button
                  type="button"
                  key={sport}
                  className={`filter-button ${
                    selectedSport ===
                    sport
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedSport(
                      sport
                    )
                  }
                >
                  {sport}
                </button>
              )
            )}
          </div>
        </section>


        <section
          className="advanced-filters"
          aria-label="Date, time and sorting filters"
        >
          <div className="advanced-filter-group">
            <span className="advanced-filter-label">
              Date
            </span>

            <div className="advanced-filter-options">
              {[
                ["all", "All"],
                ["today", "Today"],
                ["tomorrow", "Tomorrow"],
                ["this-week", "This Week"],
              ].map(
                ([value, label]) => (
                  <button
                    type="button"
                    key={value}
                    className={`advanced-filter-button ${
                      dateFilter ===
                      value
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setDateFilter(
                        value
                      )
                    }
                  >
                    {label}
                  </button>
                )
              )}
            </div>
          </div>


          <div className="advanced-filter-group">
            <span className="advanced-filter-label">
              Time
            </span>

            <div className="advanced-filter-options">
              {[
                ["all", "All Times"],
                ["morning", "Morning"],
                ["afternoon", "Afternoon"],
                ["evening", "Evening"],
              ].map(
                ([value, label]) => (
                  <button
                    type="button"
                    key={value}
                    className={`advanced-filter-button ${
                      timeFilter ===
                      value
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setTimeFilter(
                        value
                      )
                    }
                  >
                    {label}
                  </button>
                )
              )}
            </div>
          </div>


          <div className="advanced-filter-group">
            <span className="advanced-filter-label">
              Sort
            </span>

            <div className="advanced-filter-options">
              {[
                [
                  "starting-soon",
                  "Starting Soon",
                ],
                [
                  "nearest",
                  "Nearest",
                ],
                [
                  "most-available",
                  "Most Available",
                ],
              ].map(
                ([value, label]) => (
                  <button
                    type="button"
                    key={value}
                    className={`advanced-filter-button ${
                      sortBy === value
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setSortBy(value)
                    }
                  >
                    {label}
                  </button>
                )
              )}
            </div>
          </div>


          {hasActiveFilters && (
            <button
              type="button"
              className="clear-all-filters"
              onClick={clearFilters}
            >
              Clear all filters
            </button>
          )}
        </section>


        <section className="activities-section">
          <div className="activities-heading">
            <div>
              <h2>
                Available Activities
              </h2>

              <p className="activity-count">
                {viewMode === "nearby"
                  ? "Nearby results · "
                  : "Discover games · "}

                {filteredActivities.length}{" "}
                {filteredActivities.length ===
                1
                  ? "activity"
                  : "activities"}
              </p>
            </div>

            <button
              type="button"
              className="create-activity-button"
              onClick={() =>
                navigate(
                  "/activities/create"
                )
              }
            >
              <span aria-hidden="true">
                +
              </span>

              Create Activity
            </button>
          </div>


          {loading && (
            <div className="dashboard-state">
              <div
                className="loading-spinner"
                aria-hidden="true"
              />

              <p>
                {viewMode === "nearby"
                  ? "Finding games near you..."
                  : "Finding activities..."}
              </p>
            </div>
          )}


          {!loading && error && (
            <div
              className="dashboard-state dashboard-error"
              role="alert"
            >
              <div
                className="state-icon"
                aria-hidden="true"
              >
                !
              </div>

              <h3>
                Something went wrong
              </h3>

              <p>{error}</p>

              <button
                type="button"
                className="retry-button"
                onClick={async () => {
                  setLoading(true);
                  await loadActivities();
                }}
              >
                Try Again
              </button>
            </div>
          )}


          {!loading &&
            !error &&
            filteredActivities.length ===
              0 && (
              <div className="dashboard-state dashboard-empty-state">
                <div
                  className="empty-icon"
                  aria-hidden="true"
                />

                <h3>
                  {viewMode ===
                  "nearby"
                    ? "No games found nearby"
                    : "No activities found"}
                </h3>

                <p>
                  {viewMode ===
                  "nearby"
                    ? `There are no activities within ${radiusKm} km of your location.`
                    : "Try changing your search or create a new activity."}
                </p>

                {viewMode ===
                "nearby" ? (
                  <button
                    type="button"
                    className="retry-button"
                    onClick={() =>
                      handleRadiusChange(
                        15
                      )
                    }
                  >
                    Search up to 15 km
                  </button>
                ) : hasActiveFilters ? (
                  <button
                    type="button"
                    className="retry-button"
                    onClick={
                      clearFilters
                    }
                  >
                    Clear Filters
                  </button>
                ) : (
                  <button
                    type="button"
                    className="retry-button"
                    onClick={() =>
                      navigate(
                        "/activities/create"
                      )
                    }
                  >
                    Create Activity
                  </button>
                )}
              </div>
            )}


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
