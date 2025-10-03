import axios from 'axios';

// const api = axios.create({
//   baseURL: 'https://clubshub-backend-uola.onrender.com/api',
//   withCredentials: true,
// });
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; 
  }
  return config;
});



export default api;



