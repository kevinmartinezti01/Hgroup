import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL; // O process.env.REACT_APP_API_URL en CRA

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    return response.data; // { token, userData }
  } catch (error) {
    throw new Error(error.response?.data?.error || "Error al iniciar sesión");
  }
};

export const register = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Error al registrarse");
  }
};