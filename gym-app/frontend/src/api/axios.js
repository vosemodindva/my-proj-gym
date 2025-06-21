import axios from "axios";


const api = axios.create({
  baseURL: "http://localhost:8000/api/",
});


/*
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});
*/
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;