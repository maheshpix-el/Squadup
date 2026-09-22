import api from "./axios";

export const updateMyProfile = async (profileData) => {
  const response = await api.put("/users/me", profileData);

  return response.data;
};
