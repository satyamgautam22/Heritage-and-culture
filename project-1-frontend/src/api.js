import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ✅ ADD THIS NAMED EXPORT
export const getChatMessages = async (chatId) => {
  const res = await api.get(`/api/chat/${chatId}/messages`);
  return res.data;
};

export default api;
