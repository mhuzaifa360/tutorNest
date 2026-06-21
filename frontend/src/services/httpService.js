import axios from "axios";
import { getToken } from "./authService";

const API_BASE = "http://localhost:5000/v1";

const httpClient = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

httpClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const apiRequest = async (url, options = {}) => {
  try {
    const config = { url, ...options };
    if (options.body !== undefined) {
      config.data = options.body;
      delete config.body;
    }

    const response = await httpClient.request(config);
    return { ok: response.status >= 200 && response.status < 300, ...response.data };
  } catch (error) {
    if (error.response) {
      return {
        ok: false,
        success: false,
        message:
          error.response.data?.message ||
          error.response.data?.error ||
          error.response.statusText ||
          "Server error",
        ...error.response.data,
      };
    }

    return { ok: false, success: false, message: error.message || "Network error" };
  }
};

export { apiRequest };
