import api from "./axios";

export const loginUser = async (email, password) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post("/users/", userData);

  return response.data;
};