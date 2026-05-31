import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // backend của bạn
  headers: { 'Content-Type': 'application/json' }
});

// Interceptor để gắn token JWT sau này (nếu có)
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default api;