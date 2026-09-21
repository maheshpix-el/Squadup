import api from "./axios";

// Get all activities
export const getActivities = async (params = {}) => {
  const response = await api.get("/activities/", {
    params,
  });

  return response.data;
};

// Get a single activity
export const getActivity = async (activityId) => {
  const response = await api.get(`/activities/${activityId}`);
  return response.data;
};

// Create activity
export const createActivity = async (activityData) => {
  const response = await api.post("/activities/", activityData);
  return response.data;
};

// Update activity
export const updateActivity = async (activityId, activityData) => {
  const response = await api.put(
    `/activities/${activityId}`,
    activityData
  );

  return response.data;
};

// Delete activity
export const deleteActivity = async (activityId) => {
  await api.delete(`/activities/${activityId}`);
};

// Get nearby activities
export const getNearbyActivities = async (
  latitude,
  longitude,
  radiusKm = 5
) => {
  const response = await api.get("/activities/nearby", {
    params: {
      latitude,
      longitude,
      radius_km: radiusKm,
    },
  });

  return response.data;
};
// Get activities created by the logged-in user
export const getCreatedActivities = async () => {
  const response = await api.get(
    "/users/me/activities/created"
  );

  return response.data;
};

// Get activities joined by the logged-in user
export const getJoinedActivities = async () => {
  const response = await api.get(
    "/users/me/activities/joined"
  );

  return response.data;
};