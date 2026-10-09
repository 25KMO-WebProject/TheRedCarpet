import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Automatically attach JWT to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle expired JWT
api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (
      error.response?.status === 401 &&
      error.response?.data?.error?.message === "Token expired"
    ) {
      const event = new CustomEvent("sessionExpired");
      window.dispatchEvent(event);
    }

    return Promise.reject(error);
  },
);

export default axios;
