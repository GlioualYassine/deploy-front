import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    // Check if we're in the browser
    const token = localStorage.getItem("token");

    console.log("-----------------------------");
    console.log("config", config);
    console.log("-----------------------------");
    

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
