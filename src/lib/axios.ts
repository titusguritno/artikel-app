import axios from "axios";

// Buat axios instance
const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "https://test-fe.mysellerpintar.com/", // ganti sesuai base URL kamu
});

// Tambah interceptor untuk otomatis pasang Authorization header
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
