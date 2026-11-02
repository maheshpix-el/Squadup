import api from "./axios";

export const updateMyProfile = async (profileData) => {
  const response = await api.put("/users/me", profileData);

  return response.data;
};

export const getMyDetailProfile = async () => {
  const response = await api.get("/users/me/profile");
  return response.data;
};

export const createMyDetailProfile = async (profileData) => {
  const response = await api.post("/users/me/profile", profileData);
  return response.data;
};

export const updateMyDetailProfile = async (profileData) => {
  const response = await api.put("/users/me/profile", profileData);
  return response.data;
};
