import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('🌐 API Error:', err.response?.data || err.message);
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Dispatch a custom event to update AuthContext if needed
      window.dispatchEvent(new Event('auth-error'));
    }
    return Promise.reject(err);
  }
);

export default API;
