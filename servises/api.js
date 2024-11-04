import axios from "axios";

const api = axios.create({
  // Go to .env if you want to change the URL => http://localhost:8080/api/v1
  baseURL: "http://localhost:8080/api/v1",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;