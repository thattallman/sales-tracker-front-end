import { api } from "../services";

export const register = async (userData) => {
  try {
    const response = await api.post(
      `/api/auth/signup`,
      userData
    );
    return response?.data;
  } catch (error) {
    console.error("Error posting registration data ", error);
     throw error;
  }
};

export const login = async (userData) => {
  try {
    const response = await api.post(
      `/api/auth/login`,
      userData
    );
    return response?.data;
  } catch (error) {
    console.error("Error posting login data ", error);
     throw error;
  }
};