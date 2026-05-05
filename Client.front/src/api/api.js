// src/api/api.js
// Use este arquivo no lugar de importar axios diretamente.
// Exemplo: import api from '../api/api';
//          api.get('/atendimentos') em vez de axios.get('http://localhost:8080/api/atendimentos')

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Interceptor: adiciona o token JWT em todas as requisições automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: se o backend retornar 401, desloga o usuário e redireciona para o login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("nome");
      window.location.href = "/Login";
    }
    return Promise.reject(error);
  }
);

export default api;