import axios from "axios";

const axiosInstance = axios.create({
   baseURL: process.env.NEXT_PUBLIC_URL,

   headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (config.url && !config.url.includes("auth/login")) {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        console.log(config.url);
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
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
