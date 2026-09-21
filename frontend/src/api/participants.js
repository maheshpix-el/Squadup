import api from "./axios";

// Join an activity
export const joinActivity = async (activityId) => {
  const response = await api.post(
    `/activities/${activityId}/join`
  );

  return response.data;
};

// Leave an activity
export const leaveActivity = async (activityId) => {
  await api.delete(
    `/activities/${activityId}/leave`
  );
};

// Get participants
export const getActivityParticipants = async (activityId) => {
  const response = await api.get(
    `/activities/${activityId}/participants`
  );

  return response.data;
};

// Get participant count
export const getParticipantCount = async (activityId) => {
  const response = await api.get(
    `/activities/${activityId}/count`
  );

  return response.data;
};