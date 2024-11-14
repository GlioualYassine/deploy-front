import axios from "axios";
import https from "https";

// Create the axios instance
const axiosInstance = axios.create({
  baseURL: "https://18.209.226.16/api/v1/", // Your backend base URL
  headers: {
    "Content-Type": "application/json",
  },
  // Disable SSL certificate validation for development purposes only
  httpsAgent: new https.Agent({
    rejectUnauthorized: false, // **Ignore SSL Certificate for self-signed certificates**
  }),
});

// Add a request interceptor to attach the token to every request (except login)
axiosInstance.interceptors.request.use(
  (config) => {
    // Exclude login request from attaching the token
    if (config.url && !config.url.includes("auth/login")) {
      // Ensure localStorage access only happens in the client
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token"); // Get the token from localStorage
        console.log(config.url);
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`; // Attach the token
        }
      } else {
        console.warn("localStorage is not available in this environment.");
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
