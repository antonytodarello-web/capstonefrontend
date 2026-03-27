import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8099",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // deve essere quello JWT dell’admin
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
