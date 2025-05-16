// src/api/instance.ts
import axios from 'axios';

// Получаем токен из localStorage (если он там есть)

const token = localStorage.getItem('authToken');
export const instance = axios.create({
   baseURL: 'https://todo-list-web-service.onrender.com', // Базовый URL твоего API
   headers: {
        // Устанавливаем заголовок Authorization, если токен есть
       ...(token ? { Authorization: `Bearer ${token}` } : {})
   }
});

// --- Перехватчик запросов (Interceptor) ---
// Будет добавлять токен к КАЖДОМУ запросу, если он есть в localStorage
// Это нужно, чтобы токен добавлялся даже если пользователь обновил страницу

instance.interceptors.request.use(
   (config) => {
       const token = localStorage.getItem('authToken');
       if (token && config.headers) {
           config.headers['Authorization'] = `Bearer ${token}`;
       }
       return config;
   },
   (error) => {
       return Promise.reject(error);
   }
);